"use client";
import { AdvancedMarker, APIProvider, Map, Pin } from "@vis.gl/react-google-maps";
import { Coordinates } from "./LocationSection";

interface Props {
  coordinates: Coordinates;
}

const GoogleMapView = ({ coordinates }: Props) => {
  const API_KEY = (process.env.NEXT_PUBLIC_MAPS_API_KEY as string) ?? globalThis.MAPS_API_KEY;
  console.log("GoogleMapView", API_KEY);
  return (
    <>
      {
        <APIProvider apiKey={API_KEY}>
          <div className="w-full h-[200px]">
            <Map defaultZoom={20} center={coordinates} mapId={"3006abc1f20a98b1"}>
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
