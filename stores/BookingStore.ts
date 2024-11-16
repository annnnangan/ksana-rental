import { create } from "zustand";

interface BookingInfo {
  startTime: string;
  date: string;
  price: number;
  studio: string;
  remarks: string;
  whatsapp: string;
}

interface BookingStore {
  bookingInfo: BookingInfo;
  setBookingTime: (startTime: string) => void;
  resetBookingTime: () => void;
  setBookingDate: (date: string) => void;
  setBookingPrice: (price: number) => void;
  resetBookingPrice: () => void;
  setStudio: (studio: string) => void;
  setRemarks: (remarks: string) => void;
  setWhatsapp: (whatsapp: string) => void;
}

const useBookingStore = create<BookingStore>((set) => ({
  bookingInfo: {
    startTime: "",
    date: "",
    price: 0,
    studio: "",
    remarks: "",
    whatsapp: "",
  },
  setBookingTime: (startTime) =>
    set((store) => ({ bookingInfo: { ...store.bookingInfo, startTime } })),
  resetBookingTime: () =>
    set((store) => ({
      bookingInfo: { ...store.bookingInfo, startTime: "" },
    })),
  setBookingDate: (date) =>
    set((store) => ({ bookingInfo: { ...store.bookingInfo, date } })),
  setBookingPrice: (price) =>
    set((store) => ({ bookingInfo: { ...store.bookingInfo, price } })),
  resetBookingPrice: () =>
    set((store) => ({
      bookingInfo: { ...store.bookingInfo, bookingPrice: 0 },
    })),
  setStudio: (studio) =>
    set((store) => ({
      bookingInfo: { ...store.bookingInfo, studio },
    })),
  setRemarks: (remarks) =>
    set((store) => ({
      bookingInfo: { ...store.bookingInfo, remarks },
    })),
  setWhatsapp: (whatsapp) =>
    set((store) => ({
      bookingInfo: { ...store.bookingInfo, whatsapp },
    })),
}));

export default useBookingStore;
