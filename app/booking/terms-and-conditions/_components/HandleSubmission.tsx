"use client";
import { Box, Button, Checkbox, Flex, Spinner, Text } from "@radix-ui/themes";
import React, { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SubmissionButtons from "../../_components/SubmissionButtons";
import ErrorMessage from "@/app/_components/ErrorMessage";

const HandleSubmission = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingReferenceNumber = searchParams.get("booking");

  const handleCheckbox = (checked: boolean) => {
    setIsChecked(!isChecked);
    if (checked === true) {
      setError("");
    }
  };

  const handleClick = async () => {
    try {
      setLoading(true);
      //check if the checkbox is checked
      //Display error when the checkbox is not checked
      if (!isChecked) {
        setError("錯誤：條款與細則必須同意才可繼續。");
        setLoading(false);
      }

      if (isChecked) {
        //When checkbox is checked, fetch the API to update the is_accept_tnc
        const response = await fetch(
          `/api/booking/terms-and-conditions?booking=${bookingReferenceNumber}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          // If the response status is not 2xx, throw an error with the response message
          const errorData = await response.json();
          throw new Error(errorData?.error.message || "系統發生未預期錯誤。");
        }

        router.push(`/booking/summary?booking=${bookingReferenceNumber}`);
        router.refresh();
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = (error as Error).message || "系統發生未預期錯誤。";
      router.push(`/studio`);
    }
  };

  return (
    <>
      <Text as="label" size="3">
        <Flex gap="2">
          <Checkbox
            required
            checked={isChecked}
            onCheckedChange={handleCheckbox}
          />
          我同意以上條款與細則。
        </Flex>
        {error && <ErrorMessage> {error}</ErrorMessage>}
      </Text>
      <Box mt="5">
        <SubmissionButtons handleClick={handleClick} isLoading={isLoading} />
      </Box>
    </>
  );
};

export default HandleSubmission;
