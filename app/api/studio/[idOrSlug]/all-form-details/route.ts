import handleError from "@/lib/handlers/error";
import { UnauthorizedError } from "@/lib/http-errors";
import { auth } from "@/lib/next-auth-config/auth";
import { adminService } from "@/services/admin/AdminService";
import { studioService } from "@/services/studio/StudioService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, props: { params: Promise<{ idOrSlug: string }> }) {
  try {
    const params = await props.params;
    const studioId = params.idOrSlug;
    const session = await auth();
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    if (session.user.role !== "admin") {
      //check if studio belong to user
    }

    const [basicInfoResponse, businessHoursResponse, priceResponse, equipmentResponse, galleryResponse, doorPasswordResponse, socialResponse, payoutInfoResponse, statusResponse] = await Promise.all([
      studioService.getBasicInfoFormData(studioId),
      studioService.getBusinessHoursByStudioId(studioId),
      studioService.getPrice({ studioId: studioId }),
      studioService.getEquipment({ studioId: studioId }),
      studioService.getGallery({ studioId: studioId }),
      studioService.getDoorPassword(studioId),
      studioService.getSocial({ studioId: studioId }),
      studioService.getPayoutInfo(studioId),
      studioService.getStudioStatus(studioId),
    ]);

    if (
      basicInfoResponse.success &&
      businessHoursResponse.success &&
      priceResponse.success &&
      equipmentResponse.success &&
      galleryResponse.success &&
      doorPasswordResponse.success &&
      socialResponse.success &&
      payoutInfoResponse.success &&
      statusResponse.success
    ) {
      const businessHoursAndPriceValue = {
        businessHours: businessHoursResponse.data,
        nonPeakHourPrice: priceResponse.data["non-peak"].toString(),
        peakHourPrice: priceResponse.data["peak"].toString(),
      };

      return NextResponse.json(
        {
          success: true,
          data: {
            status: statusResponse.data,
            basicInfo: basicInfoResponse.data,
            businessHoursAndPrice: businessHoursAndPriceValue,
            equipment: equipmentResponse.data,
            gallery: galleryResponse.data,
            doorPassword: doorPasswordResponse.data,
            social: socialResponse.data,
            payoutInfo: payoutInfoResponse.data,
          },
        },
        { status: 201 }
      );
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
