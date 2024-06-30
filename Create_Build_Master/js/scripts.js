mapboxgl.accessToken = 'pk.eyJ1IjoibWF0aWxkZWdhbG1hcmluaSIsImEiOiJjbHh6dmg5cWUwZ3FyMmtxeTBjY3AzbzVyIn0.B_RG6dCodC9EWzUFnSg73g';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [11.255, 43.7696],
  zoom: 12
});

let userLocationMarker;
let userLocation;

document.getElementById('getLocationBtn').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    document.getElementById('location').innerText = "Geolocation is not supported by this browser.";
  }
});

function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const accuracy = position.coords.accuracy;

  userLocation = [longitude, latitude];

  document.getElementById('location').innerHTML = `Latitude: ${latitude} <br>Longitude: ${longitude} <br>Accuracy: ${accuracy} meters`;

  map.setCenter([longitude, latitude]);
  map.zoomTo(15);

  if (!userLocationMarker) {
    userLocationMarker = new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map);
  } else {
    userLocationMarker.setLngLat([longitude, latitude]);
  }
}

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      document.getElementById('location').innerText = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      document.getElementById('location').innerText = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      document.getElementById('location').innerText = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      document.getElementById('location').innerText = "An unknown error occurred.";
      break;
  }
}

async function getRoute(start, end) {
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
    { method: 'GET' }
  );
  const json = await query.json();
  const data = json.routes[0];
  const route = data.geometry.coordinates;
  const geojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: route
    }
  };
  if (map.getSource('route')) {
    map.getSource('route').setData(geojson);
  } else {
    map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: geojson
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3887be',
        'line-width': 5,
        'line-opacity': 0.75
      }
    });
  }
}

document.getElementById('findRouteBtn').addEventListener('click', async () => {
  const destination = document.getElementById('destinationInput').value;
  if (destination && userLocation) {
    const destinationCoordinates = await findCoordinates(destination);
    getRoute(userLocation, destinationCoordinates);
  } else {
    alert('Please provide a valid destination and ensure your location is detected.');
  }
});

map.on('load', () => {
  const start = [11.255, 43.7696];
  getRoute(start, start);
  map.addLayer({
    id: 'point',
    type: 'circle',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: start
            }
          }
        ]
      }
    },
    paint: {
      'circle-radius': 10,
      'circle-color': '#3887be'
    }
  });
});