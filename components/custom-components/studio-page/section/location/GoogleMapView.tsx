"use client";
import { AdvancedMarker, APIProvider, Map, Pin } from "@vis.gl/react-google-maps";
import { Coordinates } from "./LocationSection";

interface Props {
  coordinates: Coordinates;
  MAPS_API_KEY: string;
  MAP_ID: string;
}

const GoogleMapView = ({ coordinates, MAPS_API_KEY, MAP_ID }: Props) => {
  return (
    <>
      <APIProvider apiKey={MAPS_API_KEY}>
        <div className="w-full h-[200px]">
          <Map defaultZoom={20} center={coordinates} mapId={MAP_ID}>
            <AdvancedMarker position={coordinates}>
              <Pin />
            </AdvancedMarker>
          </Map>
        </div>
      </APIProvider>
    </>
  );
};

export default GoogleMapView;
