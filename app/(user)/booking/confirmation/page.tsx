"use client";
import AvatarWithFallback from "@/components/custom-components/AvatarWithFallback";
import SubmitButton from "@/components/custom-components/buttons/SubmitButton";
import SectionTitle from "@/components/custom-components/studio-details/SectionTitle";
import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { ScrollArea } from "@/components/shadcn/scroll-area";

import { CalendarCheck2, Clock10, HandCoins, MapPinHouse } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { createConfirmedForFreeBooking, createPendingForPaymentBooking } from "@/actions/booking";
import { Textarea } from "@/components/shadcn/textarea";
import { useSessionUser } from "@/hooks/use-session-user";

import { formatDate } from "@/lib/utils/date-time/format-date-utils";
import { BookingFormData, BookingSchema } from "@/lib/validations/zod-schema/booking-schema";
import useBookingStore from "@/stores/BookingStore";
import { calculateBookingEndTime } from "@/lib/utils/date-time/format-time-utils";
import { useQueryClient } from "@tanstack/react-query";

const BookingConfirmationPage = () => {
  const user = useSessionUser();
  const [toastShown, setToastShown] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    bookingInfo: { date, startTime, studioSlug, studioName, studioAddress, studioLogo, price, usedCredit, paidAmount, isUsedCredit },
  } = useBookingStore();

  const queryClient = useQueryClient();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      username: "",
      phone: "",
      remarks: "",
      agreeBookingTerms: false,
    },
  });

  const { setValue, reset } = form;
  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (!date || !startTime || !studioSlug || price < 0) {
      if (!toastShown) {
        // Check if the toast has already been shown
        setToastShown(true);
        if (studioSlug) {
          router.push(`/booking?${studioSlug}`);
        } else {
          router.push("/explore-studios");
        }

        toast("請先選擇預約場地、日期和時間。", {
          position: "top-right",
          type: "error",
          autoClose: 1000,
        });
      }
    }
  }, [user, date, startTime, studioSlug, price, usedCredit, paidAmount, toastShown, router]);

  useEffect(() => {
    reset({
      date: date,
      startTime: startTime,
      studioSlug: studioSlug,
      studioName: studioName,
      studioAddress: studioAddress,
      studioLogo: studioLogo,
      price: price,
      usedCredit: usedCredit,
      paidAmount: paidAmount,
      isUsedCredit: isUsedCredit,
    });
  }, [date, startTime, studioSlug, studioName, studioAddress, studioLogo, price, usedCredit, paidAmount, isUsedCredit]);

  const handleSubmit = async (formData: BookingFormData) => {
    startTransition(() => {
      if (formData.paidAmount > 0) {
        createPendingForPaymentBooking(formData).then((data) => {
          if (!data.success) {
            //@ts-ignore
            toast(data?.error?.message, {
              position: "top-right",
              type: "error",
              autoClose: 1000,
            });
            router.push(`/booking?slug=${studioSlug}`);
          } else {
            router.push(`/booking/payment?booking=${data.data.reference_no}`);
          }
        });
      } else {
        createConfirmedForFreeBooking(formData).then((data) => {
          if (!data.success) {
            //@ts-ignore
            toast(data?.error?.message, {
              position: "top-right",
              type: "error",
              autoClose: 1000,
            });
            router.push(`/booking?slug=${studioSlug}`);
          } else {
            router.push(`/booking/success?booking=${data.data.reference_no}`);
          }
        });
      }

      queryClient.invalidateQueries({ queryKey: ["timeslots", studioSlug, formatDate(date)] });
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <SectionTitle>請確認你的預約</SectionTitle>
        <div className="flex flex-col space-y-2 bg-gray-50 p-5 rounded-lg">
          <div className="flex items-center gap-2">
            <AvatarWithFallback avatarUrl={studioLogo} type={"studio"} />
            <p>{studioName}</p>
          </div>
          <div className="flex items-center gap-2">
            <CalendarCheck2 size={20} />
            <p>預約日期：{formatDate(date)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock10 size={20} />
            <p>
              預約時間：{startTime} - {calculateBookingEndTime(startTime)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <MapPinHouse size={20} />
            <p>場地地址：{studioAddress} </p>
          </div>
          <div className="flex items-center gap-2">
            <HandCoins size={20} />
            <p>
              實付：HK$ {paidAmount} {isUsedCredit && `(已使用HK$ ${usedCredit}積分折抵)`}
            </p>
          </div>
        </div>
        <div className="flex flex-col space-y-2 bg-gray-50 p-5 rounded-lg">
          <p className="font-bold mb-2">場地使用者聯絡資料</p>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm" htmlFor="username">
                    名稱 *
                  </FormLabel>
                  <FormControl>
                    <Input type="text" id="username" className={`form-input text-sm`} placeholder="請輸入使用者名稱" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm" htmlFor="phone">
                    聯絡電話 *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="phone"
                      className="form-input text-sm"
                      placeholder="請填寫場地聯絡電話"
                      onChange={(e) => {
                        const phoneNumber = e.target.value;
                        // Update the form value with the country code on change
                        setValue("phone", `+852${phoneNumber}`);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm" htmlFor="remarks">
                    備註
                  </FormLabel>
                  <FormControl>
                    <Textarea id="remarks" placeholder="請填寫備註。" className="text-sm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="agreeBookingTerms"
          render={({ field }) => {
            return (
              <FormItem>
                <div className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6" />
                  </FormControl>
                  <FormLabel className="text-md font-normal">
                    我已閱畢，並同意
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button type="button" variant="link" className="p-0 text-md">
                          條款與細則
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>場地租用條款與細則</DialogTitle>
                          <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[80vh] text-left">
                          <p className="mb-4">歡迎使用我們的瑜伽場地租賃平台！為確保所有租用者擁有良好的體驗，請仔細閱讀以下條款與細則。完成預訂即代表您同意遵守本規則。</p>

                          <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">1. 預訂與付款</h2>
                            <ul className="list-disc list-inside space-y-2">
                              <li>所有預訂需通過本平台完成，並需全額付款以確認租用。</li>
                              <li>僅接受平台指定的付款方式，恕不接受現金交易。</li>
                              <li>預訂時間包含進場與退場時間，請務必準時離場，以免影響下一位租用者。</li>
                            </ul>
                          </section>

                          <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">2. 取消與退款政策</h2>
                            <ul className="list-disc list-inside space-y-2">
                              <li>
                                <strong>48小時或之前</strong>取消預訂，會將場地費用/已使用積分全數退回為平台積分，下次租用時可使用，恕不提供退款選項。
                              </li>
                              <li>
                                <strong>48小時內</strong>取消預訂，恕不退款/退回平台積分。
                              </li>
                              <li>若因不可抗力因素（如天災、政府法規）導致場地無法使用，本平台將安排延期或全額退款。</li>
                              <li>若租用者因個人原因未能準時使用場地，恕不補時或退款。</li>
                            </ul>
                          </section>

                          <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">3. 場地使用規則</h2>
                            <ul className="list-disc list-inside space-y-2">
                              <li>租用者須愛惜場地設施，若有損壞，需照價賠償。</li>
                              <li>禁止攜帶食物、酒精飲料或非法物品進入場地。</li>
                              <li>禁止吸煙、燃燒香薰或任何可能影響空氣品質的行為。</li>
                              <li>使用音響設備時，請將音量控制在合理範圍，以免影響他人。</li>
                              <li>請確保場地乾淨整潔，所有個人物品及垃圾需自行帶走。</li>
                              <li>嚴禁轉租場地，違者將被取消租賃資格，並不予退款。</li>
                            </ul>
                          </section>

                          <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">4. 責任與安全</h2>
                            <ul className="list-disc list-inside space-y-2">
                              <li>本平台及場地業主不負責租用者或其參與者的個人財物遺失、損壞或人身傷害。</li>
                              <li>租用者應自行評估活動風險，並確保參與者的安全。</li>
                              <li>若租用者發生任何意外，請立即通知場地管理員或相關負責人。</li>
                            </ul>
                          </section>
                        </ScrollArea>

                        <DialogFooter className="sm:justify-start">
                          <DialogClose asChild></DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </FormLabel>
                </div>

                <FormMessage />
              </FormItem>
            );
          }}
        />
        <SubmitButton isSubmitting={isSubmitting || isPending} submittingText={"處理中..."} nonSubmittingText={"前往付款"} withIcon={false} className="w-full md:w-fit" />
      </form>
    </Form>
  );
};

export default BookingConfirmationPage;
