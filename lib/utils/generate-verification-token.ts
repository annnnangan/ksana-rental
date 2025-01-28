import { verificationService } from "@/services/user/VerificationService";
import { v4 as uuidv4 } from "uuid";

export const generateVerificationToken = async (email: string) => {
  const existingToken = (
    await verificationService.getVerificationTokenByEmail(email)
  )?.data;
  //If there is existing token, remove it
  if (existingToken) {
    await verificationService.deleteVerificationToken(existingToken.id);
  }
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); //expire in 1 hour
  //then generate a new one
  const verificationToken = (
    await verificationService.insertVerificationToken(email, token, expires)
  ).data;
  return verificationToken;
};
