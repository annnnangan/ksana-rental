import React from "react";

import { bookingService } from "@/services/BookingService";
import { BookingQuery } from "../page";

interface Props {
  searchParams: BookingQuery;
}

const BookingStudioInfo = async ({ searchParams }: Props) => {
  const studioSlug = searchParams.studio;

  const studioInfo = await bookingService.getStudioNameAddress(studioSlug);

  return (
    <div>
      <p>Studio Name: {studioInfo.success ? studioInfo.data![0].name : ""}</p>
      <p>
        Studio Address: {studioInfo.success ? studioInfo.data![0].address : ""}
      </p>
    </div>
  );
};

export default BookingStudioInfo;
