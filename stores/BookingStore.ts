import { BookingDateTimeSelectFormData } from "@/lib/validations/zod-schema/booking-schema";
import { create } from "zustand";

interface BookingStore {
  bookingInfo: BookingDateTimeSelectFormData;
  setBookingInfo: (updatedInfo: Partial<BookingDateTimeSelectFormData>) => void;
}

const useBookingStore = create<BookingStore>((set) => ({
  bookingInfo: {
    date: new Date(),
    startTime: "",
    studioSlug: "",
    studioName: "",
    studioLogo: "",
    studioAddress: "",
    price: 0,
    usedCredit: 0,
    paidAmount: 0,
    isUsedCredit: false,
  },
  setBookingInfo: (updatedInfo) =>
    set((store) => ({
      bookingInfo: { ...store.bookingInfo, ...updatedInfo },
    })),
}));

export default useBookingStore;
