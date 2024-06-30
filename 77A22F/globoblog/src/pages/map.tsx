import * as L from "leaflet";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import {api} from '../utils/api';


const initialPosition = {lat: 43.7760868, lon: 11.0100329}

export default function MapPage() {
  const {data: posts, isLoading, isError, error} = api.post.search.useQuery({text: ""}, {refetchInterval: 30000, refetchOnWindowFocus: false})


  const Map = useMemo(
    () =>
      dynamic(() => import("~/components/map/MapComponent"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [],
  );

	if (isLoading){
		return (<div>Loading...</div>)
	}
	if (isError){
		return (<div className="text-red-500 text-xl w-full h-full content-center">
			Internal server error
		</div>);
	}

  return (
    <div className="h-pagemax w-full">
      <Map startingPosition={{lat: initialPosition.lat, lng: initialPosition.lon}} posts={posts} startingZoom={9}>
      </Map>
    </div>
  );
}
