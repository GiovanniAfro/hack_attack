function changePage() {
	setTimeout(function() {
		alert("WOW! Hai trovato una balena! Andiamo in cerca di altri rumori!")
		window.location.href = "../index.html";
	}, 10 * 1000);
}

// Wait for the scene to load
document.querySelector('a-scene').addEventListener('loaded', function () {
	// Get reference to the AR content entity
	var arContent = document.querySelector('#ar-content');
	
	// Get reference to the camera entity
	var camera = document.querySelector('[camera]');

	// Initial distance from camera
	var distance = 5;

	// Variables to store initial alpha, beta, gamma values
	var initialAlpha = null;
	var initialBeta = null;
	var initialGamma = null;

	// Listen for device orientation changes
	window.addEventListener('deviceorientation', function(event) {
		if (initialAlpha === null) {
			// Store initial orientation
			initialAlpha = event.alpha;
			initialBeta = event.beta;
			initialGamma = event.gamma;
		}

		// Calculate offsets from initial orientation
		var alphaOffset = event.alpha - initialAlpha;
		var betaOffset = event.beta - initialBeta;
		var gammaOffset = event.gamma - initialGamma;

		// Adjust position of AR content based on orientation
		var positionX = distance * Math.sin(alphaOffset * Math.PI / 180);
		var positionY = distance * Math.sin(gammaOffset * Math.PI / 180); // Inverted gamma for correct direction

		// Update position of AR content relative to camera
		arContent.setAttribute('position', `${positionX} ${positionY} -${distance}`);
	});
});