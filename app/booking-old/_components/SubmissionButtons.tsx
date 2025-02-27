"use client";
import { Button, Flex, Spinner } from "@radix-ui/themes";

interface Props {
  handleClick: () => void;
  isLoading: boolean;
}

const SubmissionButtons = ({ handleClick, isLoading }: Props) => {
  return (
    <Flex gap="4">
      <Button size="2" onClick={handleClick} disabled={isLoading}>
        {isLoading ? <Spinner loading></Spinner> : ""}
        <p className="px-8">確定</p>
      </Button>

      <Button variant="outline" disabled={isLoading}>
        {isLoading ? <Spinner loading></Spinner> : ""}
        <p className="px-8">返回</p>
      </Button>
    </Flex>
  );
};

export default SubmissionButtons;
