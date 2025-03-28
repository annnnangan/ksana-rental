"use client";
import { AdvancedMarker, APIProvider, Map, Pin } from "@vis.gl/react-google-maps";
import { Coordinates } from "./LocationSection";

interface Props {
  coordinates: Coordinates;
}

const GoogleMapView = ({ coordinates }: Props) => {
  return (
    <>
      {
        <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY!}>
          <div className="w-full h-[200px]">
            <Map defaultZoom={20} center={coordinates} mapId={process.env.NEXT_PUBLIC_MAP_ID}>
              <AdvancedMarker position={coordinates}>
                <Pin />
              </AdvancedMarker>
            </Map>
          </div>
        </APIProvider>
      }
    </>
  );
};

export default GoogleMapView;
