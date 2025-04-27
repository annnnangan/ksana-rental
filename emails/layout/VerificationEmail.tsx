import { Body, Container, Html, Img, Link, Preview, Tailwind, Text } from "@react-email/components";

const VerificationEmail = ({ confirmLink }: { confirmLink: string }) => {
  return (
    <Html>
      <Preview>請驗證你的電郵地址。</Preview>
      <Tailwind>
        <Body className="bg-white">
          <Container>
            <Img
              src="https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/email/logo.png"
              alt="ksana logo"
              width="100"
              height="auto"
            />
            <Text className="font-bold">
              你好，感謝你註冊成為Ksana會員，請點擊以下連結驗證你的電郵地址：
            </Text>
            <Link href={confirmLink}>{confirmLink}</Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationEmail;
