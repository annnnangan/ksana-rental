import { create } from "zustand";

interface BookingInfo {
  bookingTime: string;
  bookingDate: string;
  bookingPrice: number;
  studio: string;
}

interface BookingStore {
  bookingInfo: BookingInfo;
  setBookingTime: (bookingTime: string) => void;
  resetBookingTime: () => void;
  setBookingDate: (bookingDate: string) => void;
  setBookingPrice: (bookingPrice: number) => void;
  resetBookingPrice: () => void;
}

const useBookingStore = create<BookingStore>((set) => ({
  bookingInfo: {
    bookingTime: "",
    bookingDate: "",
    bookingPrice: 0,
    studio: "",
  },
  setBookingTime: (bookingTime) =>
    set((store) => ({ bookingInfo: { ...store.bookingInfo, bookingTime } })),
  resetBookingTime: () =>
    set((store) => ({
      bookingInfo: { ...store.bookingInfo, bookingTime: "" },
    })),
  setBookingDate: (bookingDate) =>
    set((store) => ({ bookingInfo: { ...store.bookingInfo, bookingDate } })),
  setBookingPrice: (bookingPrice) =>
    set((store) => ({ bookingInfo: { ...store.bookingInfo, bookingPrice } })),
  resetBookingPrice: () =>
    set((store) => ({
      bookingInfo: { ...store.bookingInfo, bookingPrice: 0 },
    })),
}));

export default useBookingStore;
