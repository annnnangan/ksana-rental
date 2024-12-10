import { NotFoundError, RequestError } from "@/lib/http-errors";
import { knex } from "@/services/knex";
import { Knex } from "knex";
import { BasicInfo, districts } from "./model";
import { findAreaByDistrictValue } from "@/lib/utils/areas-districts-converter";
export class StudioCreateService {
  constructor(private knex: Knex) {}

  //Save image into Studio table
  //todo - params: studioId, userId, imageType (cover or logo). image S3 URL
  async saveImage(
    studioId: number,
    userId: number,
    imageType: "cover_photo" | "logo",
    imageUrl: string
  ) {
    try {
      // Perform the update query
      const updatedData = await knex("studio")
        .where({ id: studioId, user_id: userId })
        .update({ [imageType]: imageUrl }, ["id", "cover_photo", "logo"]);

      if (!updatedData || updatedData.length === 0) {
        throw new NotFoundError("場地");
      }

      return {
        success: true,
        data: "",
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(
          500,
          error instanceof Error ? error.message : "系統發生錯誤。"
        );
      }
    }
  }

  async saveBasicInfo(studioId: number, userId: number, basicInfo: BasicInfo) {
    try {
      const { name, slug, district, description, address } = basicInfo;

      if (!name || !slug || !district || !description || !address) {
        throw new Error("資料有缺少，請填寫。");
      }

      const validDistrictValues = districts.flatMap((region) =>
        region.district.map((district) => district.value)
      );

      if (!validDistrictValues.includes(district)) {
        throw new Error(`你所填寫之地區不正確。`);
      }

      await this.knex("studio")
        .update({
          name,
          slug,
          area: findAreaByDistrictValue(district)?.value,
          district,
          address,
          description,
        })
        .where({ id: studioId, user_id: userId });

      return {
        success: true,
        data: "",
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(
          500,
          error instanceof Error ? error.message : "系統發生錯誤。"
        );
      }
    }
  }
}

export const studioCreateService = new StudioCreateService(knex);
