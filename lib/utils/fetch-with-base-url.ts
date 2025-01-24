// utils/fetchWithBaseUrl.ts
import { headers } from "next/headers";

export async function fetchWithBaseUrl(
  relativeUrl: string,
  options: RequestInit = {}
): Promise<any> {
  // Get the host from headers
  const headersList = headers();
  const origin = (await headersList).get("host"); // e.g., "localhost:3000" or "example.com"
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  // Construct the full URL
  const baseUrl = `${protocol}://${origin}`;
  const url = `${baseUrl}${relativeUrl}`;

  // Fetch data
  const response = await fetch(url, options);

  return response.json();
}
