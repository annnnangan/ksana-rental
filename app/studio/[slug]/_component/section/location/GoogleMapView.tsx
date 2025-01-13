"use client";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Coordinates } from "./LocationSection";

interface Props {
  coordinates: Coordinates;
}

const containerStyle = {
  width: "100%",
  height: "200px",
};

const GoogleMapView = ({ coordinates }: Props) => {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={coordinates}
        zoom={20}
      >
        <Marker position={coordinates} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapView;
