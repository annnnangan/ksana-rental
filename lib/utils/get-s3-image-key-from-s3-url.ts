export function getS3ImageKeyFromS3URL(s3URL: string) {
  // Create a URL object
  const url = new URL(s3URL);

  // Extract the pathname from the URL and get the last part (the file name)
  const s3ImageKey = url.pathname.split("/").pop();

  return s3ImageKey;
}
