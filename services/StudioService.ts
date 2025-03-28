import { NotFoundError, RequestError } from "@/lib/http-errors";
import { knex } from "@/services/knex";
import { Knex } from "knex";
export class StudioService {
  constructor(private knex: Knex) {}

  async validateStudioIdtoUserId(studioId: number, userId: number) {
    try {
      const isStudioExist = (await knex.select("*").from("studio").where("id", studioId).andWhere("user_id", userId))[0];

      //Throw error when the booking reference doesn't exist for the user
      if (isStudioExist == undefined) {
        throw new NotFoundError("場地");
      }

      return { success: true };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(500, error instanceof Error ? error.message : "系統發生錯誤，請重試。");
      }
    }
  }

  async getStudioIdBySlug(slug: string) {
    try {
      const result = (await this.knex.select("id").from("studio").where({ slug }))[0]?.id;

      if (!result) {
        throw new NotFoundError("此場地");
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(500, error instanceof Error ? error.message : "系統發生錯誤。");
      }
    }
  }

  async getStudioBasicInfo(studioId: number, userId: number) {
    try {
      const isStudioExist = await this.validateStudioIdtoUserId(studioId, userId);

      if (isStudioExist.success) {
        // Perform the update query
        const basicInfo = (
          await this.knex.select("cover_photo", "logo", "name", "slug", "status", "district", "address", "description").from("studio").where("id", studioId).andWhere("user_id", userId)
        )[0];

        if (basicInfo) {
          return {
            success: true,
            data: basicInfo,
          };
        } else {
          throw Error;
        }
      }
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(500, error instanceof Error ? error.message : "系統發生錯誤。");
      }
    }
  }

  async getAllStudios(userId: string) {
    try {
      const studios = await this.knex.select("id", "cover_photo", "logo", "name", "status", "area", "district").from("studio").where("user_id", userId);

      return {
        success: true,
        data: studios,
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(500, error instanceof Error ? error.message : "系統發生錯誤。");
      }
    }
  }

  async getStudioBusinessHours(studioId: number, userId: number) {
    try {
      const studioBusinessHoursData = await this.knex
        .select("studio_business_hour.day_of_week", "studio_business_hour.is_closed", "studio_business_hour.open_time", "studio_business_hour.end_time", "studio_price.price_type")
        .from("studio_business_hour")
        .leftJoin("studio_price", "studio_business_hour.price_type_id", "studio_price.id")
        .where("studio_business_hour.studio_id", studioId);

      return {
        success: true,
        data: studioBusinessHoursData,
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(500, error instanceof Error ? error.message : "系統發生錯誤。");
      }
    }
  }

  async getStudioPrice(studioId: number, userId: number) {
    try {
      const studioPriceData = await this.knex.select("price_type", "price").from("studio_price").where("studio_id", studioId);

      return {
        success: true,
        data: studioPriceData,
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(500, error instanceof Error ? error.message : "系統發生錯誤。");
      }
    }
  }

  async getStudioEquipment(studioId: number, userId: number) {
    try {
      const studioEquipmentData = await this.knex
        .select("equipment.equipment")
        .from("studio_equipment")
        .leftJoin("equipment", "studio_equipment.equipment_id", "equipment.id")
        .where("studio_equipment.studio_id", studioId);

      return {
        success: true,
        data: studioEquipmentData,
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(500, error instanceof Error ? error.message : "系統發生錯誤。");
      }
    }
  }

  async getGallery(studioId: number, userId: number) {
    try {
      const studioGalleryData = await this.knex.select("photo").from("studio_photo").where("studio_id", studioId);

      return {
        success: true,
        data: studioGalleryData,
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(500, error instanceof Error ? error.message : "系統發生錯誤。");
      }
    }
  }

  async removeGalleryImage(studioId: number, userId: number, imageURL: string) {
    try {
      await this.knex("studio_photo").where("studio_id", studioId).andWhere("photo", imageURL).del();
      return {
        success: true,
        data: "",
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(500, error instanceof Error ? error.message : "系統發生錯誤。");
      }
    }
  }

  //Get Phone
  async getPhone(studioId: number, userId: number) {
    try {
      const result = (await this.knex.select("phone").from("studio").where("id", studioId))[0].phone;

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(500, error instanceof Error ? error.message : "系統發生錯誤。");
      }
    }
  }

  //Get Social
  async getSocial(studioId: number, userId: number) {
    try {
      const result = await this.knex.select("type", "contact").from("studio_social").where("studio_id", studioId);
      return {
        success: true,
        data: result.length > 0 ? result : "",
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(500, error instanceof Error ? error.message : "系統發生錯誤。");
      }
    }
  }

  //Get Studio Payout Detail
  async getPayoutDetail(studioId: number, userId: number) {
    try {
      const isStudioExist = await this.validateStudioIdtoUserId(studioId, userId);

      if (isStudioExist.success) {
        const result = (await this.knex.select("method", "account_name", "account_number").from("studio_payout_detail").where("id", studioId))[0];

        return {
          success: true,
          data: result,
        };
      } else {
        throw new Error();
      }
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(500, error instanceof Error ? error.message : "系統發生錯誤。");
      }
    }
  }

  //Get Studio Door Password
  async getDoorPassword(studioId: number, userId: number) {
    try {
      const isStudioExist = await this.validateStudioIdtoUserId(studioId, userId);

      if (isStudioExist.success) {
        const result = (await this.knex.select("is_reveal_door_password", "door_password").from("studio").where("id", studioId))[0];

        return {
          success: true,
          data: result,
        };
      } else {
        throw new Error();
      }
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(500, error instanceof Error ? error.message : "系統發生錯誤。");
      }
    }
  }

  async getOnboardingSteps(studioId: number, userId: number) {
    try {
      const isStudioExist = await this.validateStudioIdtoUserId(studioId, userId);

      if (isStudioExist.success) {
        const result = await this.knex.select("step").from("studio_onboarding_step").where({ studio_id: studioId, is_complete: true });

        return {
          success: true,
          data: result,
        };
      } else {
        throw new Error();
      }
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(500, error instanceof Error ? error.message : "系統發生錯誤。");
      }
    }
  }

  async updateStudioStatus(studioId: number, userId: number, status: string) {
    try {
      const isStudioExist = await this.validateStudioIdtoUserId(studioId, userId);

      if (isStudioExist.success) {
        await knex("studio").where({ id: studioId, user_id: userId }).update({ status: status });

        return {
          success: true,
          data: "",
        };
      } else {
        throw new Error();
      }
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(500, error instanceof Error ? error.message : "系統發生錯誤。");
      }
    }
  }

  async completeOnboardingStep(studioId: number, userId: number, completedStep: string) {
    try {
      const isStudioExist = await this.validateStudioIdtoUserId(studioId, userId);

      if (isStudioExist.success) {
        await knex("studio_onboarding_step").where({ studio_id: studioId, step: completedStep }).update({ is_complete: true });

        return {
          success: true,
          data: "",
        };
      } else {
        throw new Error();
      }
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(500, error instanceof Error ? error.message : "系統發生錯誤。");
      }
    }
  }
}

export const studioService = new StudioService(knex);
