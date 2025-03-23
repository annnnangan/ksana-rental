"use client";
import StudioCardLoadingSkeleton from "@/components/custom-components/loading/StudioCardLoadingSkeleton";
import StudioCard from "@/components/custom-components/studio/StudioCard";
import { equipmentMap } from "@/lib/constants/studio-details";
import { districts } from "@/services/model";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import React from "react";
import { studioCardInfo } from "./explore-studios/page";

const UserPagesLayout = ({ children }: { children: React.ReactNode }) => {
  //Pass in district information for AI to reference
  useCopilotReadable({
    description: "The list of district in Hong Kong",
    value: districts,
  });

  //Pass in available equipment list for AI to reference
  useCopilotReadable({
    description: "The list of yoga equipment",
    value: equipmentMap,
  });

  //Search studios for user with AI
  useCopilotAction({
    name: "select-yoga-studio",
    description: `Select at most 5 yoga studios to the users`,
    parameters: [
      {
        name: "district",
        type: "string",
        description: "The district of the yoga studio",
      },
      {
        name: "equipment",
        type: "string",
        description: "A list of equipments a yoga studio has. Use a comma to separate each option.",
      },
      {
        name: "date",
        type: "string",
        description: "The date that the user want to book for the studio. Format the date to YYYY-MM-DD when pass to API",
      },
      {
        name: "startTime",
        type: "string",
        description: "The start time that the user want to book for the studio. Format the time to xx (e.g. 01) when pass to API. Only accept value from 00 to 23",
      },
    ],

    handler: async ({ district, equipment, date, startTime }) => {
      const params = new URLSearchParams();

      if (district) params.append("district", district);
      if (equipment) params.append("equipment", equipment);
      if (date) params.append("date", date);
      if (startTime) params.append("startTime", startTime);

      const queryString = params.toString();
      const url = `/api/studios${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url);
      const result = await response.json();
      return result.data;
    },
    render: ({ status, result }) => {
      if (status === "executing" || status === "inProgress") {
        return <StudioCardLoadingSkeleton />;
      } else if (status === "complete") {
        return (
          <div className="flex flex-col gap-2">
            {result.data.studios.map((studio: studioCardInfo) => (
              <StudioCard studio={studio} key={studio.slug} />
            ))}
          </div>
        );
      } else {
        return <div className="text-red-500">沒有場地</div>;
      }
    },
  });
  return (
    <>
      <main>{children}</main>
      <CopilotPopup
        instructions={
          "You are assisting the user to search for suitable yoga studio in this website as best as you can. Answer in the best way possible given the data you have in English or Traditional Chinese. Please do not use simplified chinese"
        }
        labels={{
          title: "Ksana小幫手",
          initial: "你好！你想尋找什麼瑜珈場地？",
        }}
      />
    </>
  );
};

export default UserPagesLayout;
