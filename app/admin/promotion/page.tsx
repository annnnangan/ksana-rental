"use client";
import { setRecommendStudios } from "@/actions/admin";
import SubmitButton from "@/components/custom-components/common/buttons/SubmitButton";
import ErrorMessage from "@/components/custom-components/common/ErrorMessage";
import LoadingSpinner from "@/components/custom-components/common/loading/LoadingSpinner";
import SectionTitle from "@/components/custom-components/common/SectionTitle";
import StudioNameFilter from "@/components/custom-components/filters-and-sort/StudioNameFilter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/accordion";
import { Button } from "@/components/shadcn/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";

const PromotionPage = () => {
  const { data, isLoading } = useRecommendStudio();

  const [recommendStudio, setRecommendStudio] = useState<Record<number, string>>({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
  });

  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data) {
      const formatted = data.reduce((acc, item) => {
        acc[item.rank] = item.studio_id.toString();
        return acc;
      }, {} as Record<number, string>);
      setRecommendStudio(formatted);
    }
  }, [data]);

  const [error, setErrorMessage] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    const allFilled = Object.values(recommendStudio).every((val) => val.trim() !== "");
    if (!allFilled) {
      setErrorMessage("Please select 6 studios.");
    }
    const values = Object.values(recommendStudio).filter((val) => val !== "");
    const unique = new Set(values);
    const noDuplicatedStudio = unique.size === values.length ? true : false;

    if (!noDuplicatedStudio) {
      setErrorMessage("Please select 6 unique studios.");
    }

    startTransition(() => {
      setRecommendStudios(recommendStudio).then((data) => {
        toast(data?.error?.message || "Successfully save", {
          position: "top-right",
          type: data.success ? "success" : "error",
          autoClose: 1000,
        });
      });

      queryClient.invalidateQueries({
        queryKey: ["studios", "recommend"],
      });
    });
  };

  return (
    <div>
      <SectionTitle textColor="text-primary">Promotion</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Accordion type="single" defaultValue="item-1" collapsible className="mb-10">
          <AccordionItem value="item-1" className="border-0">
            <AccordionTrigger>
              <h2 className="text-lg font-bold">Set Homepage Recommend Studios</h2>
            </AccordionTrigger>
            <AccordionContent className="bg-slate-100 px-10 py-6 rounded-lg">
              <form onSubmit={onSubmit}>
                <div className="flex flex-col space-y-4 mb-4">
                  {isLoading ? (
                    <LoadingSpinner height="h-[100px]" />
                  ) : (
                    Array.from({ length: 6 }, (_, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <p>{index + 1}</p>
                        <StudioNameFilter
                          filter={recommendStudio}
                          setFilter={setRecommendStudio}
                          filterKey={(index + 1) as 1 | 2 | 3 | 4 | 5 | 6}
                          studioStatus="active"
                        />
                      </div>
                    ))
                  )}
                </div>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <div className="space-x-3 flex justify-between">
                  <SubmitButton
                    isSubmitting={isPending || isLoading}
                    submittingText={"Loading"}
                    nonSubmittingText={"Save"}
                    withIcon={false}
                  />
                  <div className="space-x-3 mt-5">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-primary"
                      onClick={() =>
                        setRecommendStudio({
                          1: "",
                          2: "",
                          3: "",
                          4: "",
                          5: "",
                          6: "",
                        })
                      }
                    >
                      Clear
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="border-primary"
                      onClick={() => {
                        if (!data) return;

                        const formatted = data.reduce((acc, item) => {
                          acc[item.rank] = item.studio_id.toString();
                          return acc;
                        }, {} as Record<number, string>);

                        setRecommendStudio(formatted);
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default PromotionPage;

const useRecommendStudio = () =>
  useQuery({
    queryKey: ["studios", "recommend"],
    queryFn: async () => {
      const res = await fetch(`/api/studios/recommend`);
      const result = await res.json();
      return result.data.data as {
        studio_id: string;
        rank: number;
        name: string;
        slug: string;
        cover_photo: string;
        district: string;
        rating: number;
      }[];
    },

    staleTime: 3 * 24 * 60 * 60 * 1000,
  });
