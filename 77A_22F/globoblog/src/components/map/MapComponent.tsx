import React, { FunctionComponent, useState } from "react";
import { PropsWithChildren, useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "next-leaflet-cluster";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import * as L from "leaflet";
import { NewPostForm } from "./NewPostForm";
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";

import { env } from "~/env";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/server/api/root";
import { formatDate } from "~/utils/date";
import { Button } from "../ui/button";
import { signIn, useSession } from "next-auth/react";

type MapComponentProps = {
  startingPosition: { lat: number; lng: number };
  startingZoom: number;
  posts?: inferRouterOutputs<AppRouter>["post"]["search"];
} & PropsWithChildren;
const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();

  return L.divIcon({
    html: `<div class="p-5 rounded-full flex justify-center items-center
    ${
      count < 10
        ? "bg-green-500 text-black h-8 w-8 animate-pulse-green"
        : count >= 10 && count < 50
          ? "bg-yellow-500 text-black h-10 w-10 animate-pulse-orange"
          : "bg-red-500 w-12 h-12 animate-pulse-red"
    }">
        ${count}
      </div>`,
    className: "",
  });
};
export default function MapComponent({
  startingPosition,
  startingZoom,
  children,
  posts,
}: MapComponentProps) {
  return (
    <MapContainer
      className="h-full w-full"
      center={L.latLng(startingPosition)}
      zoom={startingZoom}
      scrollWheelZoom={true}
    >
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${env.NEXT_PUBLIC_MAPBOX_SECRET}`}
      />
      {children}
      {posts && posts.length ? (
        <MarkerClusterGroup
          iconCreateFunction={createClusterCustomIcon}
          spiderLegPolylineOptions={{
            weight: 0,
            opacity: 0,
          }}
        >
          <MapContainerChild />
          {posts?.map((post, idx) => {
            return (
              <Marker
                key={idx}
                position={L.latLng(post.latitude, post.longitude)}
                title={`${post.city} - ${post.address}`}
                draggable={false}
                icon={L.divIcon({
                  html: `<div class="rounded-full bg-emerald-700 h-6 w-6 flex justify-center items-center">
                      <div class="rounded-full bg-emerald-950 h-4 w-4"></div>
                  </div>`,
                  className: "",
                })}
                eventHandlers={{
                  click() {
                    // open preview
                  },
                }}
              >
                <Popup
                  content={`<h3>${post.object} - <span class="text-xs text-gray-500">${post.city}, ${post.address}</span></h3><br><div class="font-mono text-ellipsis overflow-hidden">${post.content}</div><div class="text-xs font-mono mt-2 text-gray-800">${formatDate(new Date(post.createdAt))}</div>`}
                ></Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      ) : (
        <></>
      )}
    </MapContainer>
  );
}

const MapContainerChild: FunctionComponent = () => {
  const map = useMap();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {data, status}= useSession();
  const mapEvents = useMapEvents({
    click(ev) {
    },
    locationfound(e) {
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  function handleOnOpen(){
    if (status === 'unauthenticated'){
      signIn("discord")
    }
    onOpen();
  }

  return (
    <>
    <Button className="fixed top-8 right-6 z-[500]" onClick={handleOnOpen}>Add new post</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="top-1/2 isolate z-50 h-1/2 w-full max-w-3xl -translate-y-1/2 rounded-md border-none outline-none sm:px-4 sm:py-2">
          {(onClose) => (
            <>
              <ModalBody>
                <NewPostForm />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
