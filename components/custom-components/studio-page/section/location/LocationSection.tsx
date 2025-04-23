import Section from "../Section";
import GoogleMapView from "./GoogleMapView";

interface Props {
  address: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

async function getLatLngForAddress(address: string, apiKey: string) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`
  );

  if (response.ok) {
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    }
  } else {
    return undefined;
  }
}
const MAPS_API_KEY = process.env.NEXT_PUBLIC_MAPS_API_KEY;
const MAP_ID = process.env.NEXT_PUBLIC_MAP_ID;

const LocationSection = async ({ address }: Props) => {
  const coordinates: Coordinates | undefined = await getLatLngForAddress(address, MAPS_API_KEY!);

  if (!coordinates) {
    return null;
  }
  return (
    <Section title={"場地位置"}>
      <GoogleMapView coordinates={coordinates} MAPS_API_KEY={MAPS_API_KEY!} MAP_ID={MAP_ID!} />
    </Section>
  );
};

export default LocationSection;
