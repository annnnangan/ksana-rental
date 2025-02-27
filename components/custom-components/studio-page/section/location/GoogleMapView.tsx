"use client";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

import { Coordinates } from "./LocationSection";

interface Props {
  coordinates: Coordinates;
}

const containerStyle = {
  width: "100%",
  height: "200px",
};

const GoogleMapView = ({ coordinates }: Props) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY!,
    libraries: ["geometry", "drawing"],
  });

  return (
    <>
      {isLoaded && (
        <GoogleMap mapContainerStyle={containerStyle} center={coordinates} zoom={20}>
          <Marker position={coordinates} />
        </GoogleMap>
      )}
    </>
  );
};

export default GoogleMapView;
