import {
  Body,
  Button,
  Container,
  Html,
  Img,
  Link,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

const BookingConfirmationEmail = ({
  date,
  startTime,
  endTime,
  studio,
  address,
  domain,
}: {
  date: string;
  startTime: string;
  endTime: string;
  studio: string;
  address: string;
  domain: string;
}) => {
  return (
    <Html>
      <Preview>{`🎉🎉 恭喜你已成功預約${studio}於${date} ${startTime} - ${endTime}的場地。`}</Preview>
      <Tailwind>
        <Body className="bg-white">
          <Container>
            <Link href={domain}>
              <Img
                src="https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/email/logo.png"
                alt="ksana logo"
                width="100"
                height="auto"
              />
            </Link>

            <Text className="font-bold">你好，你已成功預約場地 {studio}，詳情如下：</Text>
            <Text className="font-bold flex items-center gap-1">日期：{date}</Text>
            <Text className="font-bold flex items-center gap-1">
              時間：{startTime} - {endTime}
            </Text>
            <Text className="font-bold flex items-center gap-1">場地地址：{address}</Text>

            <Text className="font-bold flex items-center gap-1">
              你可於預約開始前2小時，到平台「我的預約」中查看大門密碼。
            </Text>

            <Button
              href={`${domain}/manage-bookings`}
              className="bg-[#01a2c7] text-white px-5 py-2 rounded-lg"
            >
              查看預約
            </Button>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default BookingConfirmationEmail;
