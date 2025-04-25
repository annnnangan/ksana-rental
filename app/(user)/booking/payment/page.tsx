import { auth } from "@/lib/next-auth-config/auth";
import PaymentPageContent from "./PaymentPageContent";

const STRIPE_API = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

const page = async () => {
  const user = await auth();

  return <PaymentPageContent STRIPE_API={STRIPE_API!} userId={user?.user.id as string} />;
};

export default page;
