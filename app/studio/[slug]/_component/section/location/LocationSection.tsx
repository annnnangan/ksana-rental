import Section from "../../Section";
import GoogleMapView from "./GoogleMapView";

interface Props {
  address: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

async function getLatLngForAddress(address: string, apiKey: string) {
  try {
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
    }

    throw new Error("Unable to retrieve coordinates for the address.");
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw error;
  }
}

const LocationSection = async ({ address }: Props) => {
  const coordinates: Coordinates = await getLatLngForAddress(
    address,
    process.env.NEXT_PUBLIC_MAPS_API_KEY!
  );

  return (
    <Section title={"場地位置"}>
      <GoogleMapView coordinates={coordinates} />
    </Section>
  );
};

export default LocationSection;
