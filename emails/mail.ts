import { Resend } from "resend";
import VerificationEmail from "./layout/VerificationEmail";
import BookingConfirmationEmail from "./layout/BookiongConfirmationEmail";
import { convertTimeToString } from "@/lib/utils/date-time/format-time-utils";
import { formatDate } from "@/lib/utils/date-time/format-date-utils";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL!;

const from = "Ksana <no-reply@ksana-yoga-rental.site>";

export const sendVerificationEmail = async (email: string, token: string, redirectUrl?: string) => {
  let confirmLink = `${domain}/auth/new-verification?token=${token}`;
  if (redirectUrl) {
    confirmLink = `${domain}/auth/new-verification?token=${token}&redirect=${redirectUrl}`;
  }

  await resend.emails.send({
    from: from,
    to: email,
    subject: "請驗證你的電郵地址。",
    react: VerificationEmail({ confirmLink }),
  });
};

export const sendBookingConfirmationEmail = async (
  date: string,
  startTime: string,
  endTime: string,
  studio: string,
  address: string,
  email: string
) => {
  date = formatDate(new Date(date));
  startTime = convertTimeToString(startTime);
  endTime = convertTimeToString(endTime) === "00:00" ? "24:00" : convertTimeToString(endTime);
  await resend.emails.send({
    from: from,
    to: email,
    subject: `🧘🏻‍♂️成功預約 - ${studio}🧘🏻‍♀️`,
    react: BookingConfirmationEmail({ date, startTime, endTime, studio, address, domain }),
  });
};
