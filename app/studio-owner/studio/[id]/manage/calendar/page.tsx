"use client";
import useStudioCalendar from "@/hooks/react-query/studio-panel/useStudioCalendar";
import { formatDate } from "@/lib/utils/date-time/format-date-utils";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { lastDayOfWeek, startOfWeek } from "date-fns";
import { useRef, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { Calendar, Clock10, NotebookPen, Phone, TriangleAlert, User } from "lucide-react";
import SectionTitle from "@/components/custom-components/common/SectionTitle";

const CalendarPage = () => {
  const calendarRef = useRef(null);
  const [week, setWeek] = useState<{ startDate: string; endDate: string }>({
    startDate: formatDate(startOfWeek(new Date())),
    endDate: formatDate(lastDayOfWeek(new Date())),
  });

  const { data, isLoading, isError } = useStudioCalendar("1", week?.startDate, week?.endDate);

  if (isError) {
    <div
      className="flex flex-col justify-center items-center"
      style={{ height: "calc(100vh - 100px)" }}
    >
      <TriangleAlert className="text-red-600" />
      <h2 className="text-red-600 font-bold mb-3">發生未知錯誤。</h2>
    </div>;
  }

  return (
    <>
      <SectionTitle textColor="text-primary">預約日曆</SectionTitle>
      <div className="relative calendar-card">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView={"timeGridWeek"}
          ref={calendarRef}
          datesSet={(dateInfo) => {
            setWeek({
              startDate: formatDate(new Date(dateInfo.start)),
              endDate: formatDate(new Date(dateInfo.end)),
            });
          }}
          events={data || []}
          allDaySlot={false}
          eventContent={renderEventContent}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
        />

        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-60 z-50 flex items-center justify-center pointer-events-none">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </>
  );
};

export default CalendarPage;

function renderEventContent(eventInfo: {
  timeText: string;
  event: {
    title: string;
    extendedProps: { booking_date: string; user_phone: string; remarks: string };
  };
}) {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="w-full h-full">
            <div className="flex flex-col items-start">
              <p className="flex items-center justify-center gap-1">
                <Clock10 size={15} />
                {eventInfo.timeText}
              </p>
              <p className="flex items-center justify-center gap-1">
                <User size={15} /> {eventInfo.event.title}
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-white text-black border-2 flex flex-col items-start gap-2">
            <p className="flex items-center justify-center gap-1">
              <User size={15} />
              預約用戶: {eventInfo.event.title}
            </p>
            <p className="flex items-center justify-center gap-1">
              <Calendar size={15} />
              預約日期: {eventInfo.event.extendedProps.booking_date}
            </p>
            <p className="flex items-center justify-center gap-1">
              <Clock10 size={15} />
              預約時間: {eventInfo.timeText}
            </p>
            <p className="flex items-center justify-center gap-1">
              <Phone size={15} /> 聯絡: {eventInfo.event.extendedProps.user_phone}
            </p>
            <p className="flex items-center justify-center gap-1">
              <NotebookPen size={15} />
              備註:{" "}
              {eventInfo.event.extendedProps.remarks === ""
                ? "N/A"
                : eventInfo.event.extendedProps.remarks}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
