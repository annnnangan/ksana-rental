"use client";
import { Button } from "@/components/shadcn/button";
import { Card } from "@/components/shadcn/card";
import { Building2, Calendar, MapPinHouse } from "lucide-react";
import { Tooltip } from "react-tooltip";
import AvatarWithFallback from "../AvatarWithFallback";

import { convertTimeToString, formatDate } from "@/lib/utils/date-time/date-time-utils";

import { validateDoorPasswordAvailability } from "@/lib/utils/date-time/manage-bookings-validation";
import Link from "next/link";
import { useEffect, useState } from "react";
import StudioPasswordModal from "./StudioPasswordModal";
import BookingDetailsModal from "./BookingDetailsModal";

export interface UserBookingRecord {
  studio_id: string;
  studio_logo: string;
  studio_slug: string;
  studio_name: string;
  price: string;
  actual_payment: string;
  credit_redeem_payment: string;
  studio_address: string;
  studio_contact: string;
  booking_reference_no: string;
  booking_date: Date;
  start_time: string;
  end_time: string;
  remarks: string;
  status: string;
  has_reviewed: boolean;
}

interface Props {
  bookingRecord: UserBookingRecord;
}

const BookingRecordCard = ({ bookingRecord }: Props) => {
  //Open modal
  const [isOpenDetailModal, setOpenDetailModal] = useState(false);
  const [isOpenPasswordModal, setOpenPasswordModal] = useState(false);

  //Password
  const [isPasswordAvailable, setPasswordAvailable] = useState(false);
  const [doorPassword, setDoorPassword] = useState(null);
  const [doorPasswordError, setDoorPasswordError] = useState("");
  const [isFetchingDoorPassword, setFetchingDoorPassword] = useState(false);

  useEffect(() => {
    setPasswordAvailable(validateDoorPasswordAvailability(bookingRecord.booking_date, bookingRecord.start_time));
  }, [bookingRecord.booking_date, bookingRecord.start_time, isPasswordAvailable]);

  const showDoorPassword = async () => {
    setFetchingDoorPassword(true);
    const response = await fetch(`/api/studio/${bookingRecord.studio_id}/door-password?booking=${bookingRecord.booking_reference_no}`);
    const result = await response.json();

    if (!response.ok) {
      setDoorPasswordError(result.error.message);
    }
    setDoorPassword(result.data["door_password"]);
    setFetchingDoorPassword(false);
  };

  return (
    <>
      <Card className="flex flex-wrap rounded-md p-5 mb-5">
        <div className="flex gap-4 ">
          <div>
            <AvatarWithFallback avatarUrl={bookingRecord.studio_logo} type={"studio"} />
          </div>
          <div>
            <ul>
              <li className="mb-2">
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar size={18} />
                  預約日期時間:{" "}
                </span>
                {formatDate(new Date(bookingRecord.booking_date))} {convertTimeToString(bookingRecord.start_time)} - {convertTimeToString(bookingRecord.end_time)}
              </li>
              <li className="mb-2">
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Building2 size={18} />
                  場地名稱:{" "}
                </span>
                <Link href={`/studio/${bookingRecord.studio_slug}`}>{bookingRecord.studio_name}</Link>
              </li>
              <li className="mb-2">
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPinHouse size={18} />
                  場地地址:{" "}
                </span>
                {bookingRecord.studio_address}{" "}
                <a className="text-primary underline hover:text-brand-700" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bookingRecord.studio_address)}`}>
                  (地圖)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-2 items-end ms-auto">
          <Tooltip id="password-reminder" />

          {bookingRecord.status === "confirmed" && (
            <div data-tooltip-id="password-reminder" data-tooltip-content="密碼於預約2小時前可查看。" data-tooltip-place="top">
              <Button
                disabled={!isPasswordAvailable}
                onClick={() => {
                  setOpenPasswordModal(true);
                  showDoorPassword();
                }}
              >
                查看密碼
              </Button>
            </div>
          )}

          <Button variant="outline" onClick={() => setOpenDetailModal(true)}>
            查看預約詳情
          </Button>
        </div>
      </Card>

      <StudioPasswordModal isOpen={isOpenPasswordModal} setOpenModal={setOpenPasswordModal} doorPassword={doorPassword} errorMessage={doorPasswordError} isLoading={isFetchingDoorPassword} />
      <BookingDetailsModal isOpen={isOpenDetailModal} setOpenModal={setOpenDetailModal} bookingRecord={bookingRecord} role="user" />
    </>
  );
};

export default BookingRecordCard;
