export function removeCountryCode(phoneNumber: string) {
  const countryCode = "+852";
  if (phoneNumber.startsWith(countryCode)) {
    return phoneNumber.slice(countryCode.length);
  }
  return phoneNumber;
}
