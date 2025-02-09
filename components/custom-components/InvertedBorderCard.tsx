import React, { ReactNode } from "react";
import styles from "./inverted-border-card.module.css";
import { CalendarClock } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  isLinkBtn: boolean;
  btn: ReactNode;
  link?: string;
}

const InvertedBorderCard = ({
  children,
  isLinkBtn = false,
  btn,
  link,
}: Props) => {
  return (
    <div className="h-[200px] bg-white rounded-lg relative">
      {children}

      <div className={styles.iconBtn}>
        <div className="absolute left-2 bottom-2">
          {isLinkBtn ? (
            <Link
              href={link!}
              className="flex justify-center items-center bg-primary text-white rounded-full h-12 w-12 transition-transform duration-300 hover:scale-110"
            >
              {btn}
            </Link>
          ) : (
            <div className="flex justify-center items-center bg-primary text-white rounded-full h-12 w-12">
              {btn}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvertedBorderCard;
