import { Button } from "@/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";

import { cancelBooking } from "@/actions/booking";
import {
  convertTimeToString,
  formatDate,
} from "@/lib/utils/date-time/date-time-utils";
import {
  validateCancelBookingAvailability,
  validateCanLeaveBookingReview,
} from "@/lib/utils/date-time/manage-bookings-validation";
import {
  Building2,
  Calendar,
  EllipsisVertical,
  HandCoins,
  Hash,
  MapPinHouse,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { BookingRecord } from "./BookingRecordCard";
import ReviewBookingModal from "./ReviewBookingModal";

interface Props {
  isOpen: boolean;
  setOpenModal: (open: boolean) => void;
  bookingRecord: BookingRecord;
}

const BookingDetailsModal = ({
  isOpen,
  setOpenModal,
  bookingRecord,
}: Props) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOpenRatingModal, setOpenRatingModal] = useState(false);

  const [showEllipsisButton, setShowEllipsisButton] = useState(false);

  const [couldCancel, setCouldCancel] = useState(false);
  const [couldReview, setCouldReview] = useState(false);

  useEffect(() => {
    const canCancelBooking = validateCancelBookingAvailability(
      bookingRecord.status,
      bookingRecord.booking_date,
      bookingRecord.start_time
    );

    const canLeaveBookingReview: boolean = validateCanLeaveBookingReview(
      bookingRecord.has_reviewed,
      bookingRecord.status,
      bookingRecord.booking_date,
      bookingRecord.start_time
    );

    if (canCancelBooking) {
      setCouldCancel(true);
    }

    if (canLeaveBookingReview) {
      setCouldReview(true);
    }

    if (canCancelBooking || canLeaveBookingReview) {
      setShowEllipsisButton(true);
    }
  }, [bookingRecord]);

  const handleCancelBooking = () => {
    startTransition(() => {
      cancelBooking(bookingRecord.booking_reference_no).then((data) => {
        toast(data.error?.message || "預約成功取消", {
          position: "top-right",
          type: data?.success ? "success" : "error",
          autoClose: 1000,
        });
        router.refresh();
      });
    });
    setIsDropdownOpen(false); // Close the dropdown after clicking
  };
  return (
    <>
      <Dialog open={isOpen}>
        <DialogContent hideClose>
          {showEllipsisButton && (
            <div className="relative">
              <Button
                variant="ghost"
                className="absolute top-0 right-0"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                <EllipsisVertical />
              </Button>

              {isDropdownOpen && (
                <div className="absolute top-8 right-4 bg-white border border-gray-300 rounded shadow-lg">
                  <ul className="flex flex-col">
                    {couldCancel && (
                      <li>
                        <Button
                          variant="ghost"
                          className="w-full text-left"
                          onClick={handleCancelBooking}
                          disabled={isPending}
                        >
                          取消預約
                        </Button>
                      </li>
                    )}
                    {couldReview && (
                      <>
                        <li>
                          <Button
                            variant="ghost"
                            className="w-full text-left"
                            onClick={() => {
                              setOpenRatingModal(true);
                              setOpenModal(false);
                            }}
                            disabled={isPending}
                          >
                            撰寫場地評論
                          </Button>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
          <DialogHeader className="flex justify-center items-center">
            <DialogTitle>預約詳情</DialogTitle>

            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="mb-4">
            <ul className="flex flex-col gap-5">
              <li>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Hash size={18} />
                  預約編號:{" "}
                </span>
                {bookingRecord.booking_reference_no}
              </li>
              <li>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar size={18} />
                  預約日期時間:{" "}
                </span>
                {formatDate(new Date(bookingRecord.booking_date))}{" "}
                {convertTimeToString(bookingRecord.start_time)} -{" "}
                {convertTimeToString(bookingRecord.end_time)}
              </li>
              <li>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <HandCoins size={18} />
                  場地費用:{" "}
                </span>
                HKD$ {bookingRecord.price} (實付: HKD${" "}
                {bookingRecord.actual_payment} ) (已兌換積分:{" "}
                {bookingRecord.credit_redeem_payment})
              </li>
              <li>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Building2 size={18} />
                  場地名稱:{" "}
                </span>
                <Link href={`/studio/${bookingRecord.studio_slug}`}>
                  {bookingRecord.studio_name}
                </Link>
              </li>
              <li>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPinHouse size={18} />
                  場地地址:{" "}
                </span>
                {bookingRecord.studio_address}{" "}
                <a
                  className="text-primary underline hover:text-brand-700"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    bookingRecord.studio_address
                  )}`}
                >
                  (地圖)
                </a>
              </li>
              <li>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Phone size={18} />
                  場地聯絡電話:{" "}
                </span>

                <a
                  className="text-primary underline hover:text-brand-700"
                  href={`tel:${bookingRecord.studio_contact}`}
                >
                  {bookingRecord.studio_contact}
                </a>
              </li>
            </ul>
          </div>

          <Button variant="outline" onClick={() => setOpenModal(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>

      <ReviewBookingModal
        isOpen={isOpenRatingModal}
        setOpenModal={setOpenRatingModal}
        bookingRecord={bookingRecord}
      />
    </>
  );
};

export default BookingDetailsModal;
