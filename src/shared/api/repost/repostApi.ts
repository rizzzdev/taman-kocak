import { LikeEntity } from "@/shared/domain/like/likeEntity";
import { PostRepostDTO } from "@/shared/domain/repost/repostDTO";
import { axiosIns } from "@/shared/libs/axiosIns";
import { ApiResponse } from "@/shared/types/apiResponseType";
import { AxiosError } from "axios";

export const postRepostApi = async (
  data: PostRepostDTO,
  query: string = "",
) => {
  try {
    const response = await axiosIns.post<ApiResponse<LikeEntity>>(
      `/reposts?${query}`,
      data,
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data as ApiResponse<null>;
    }
  }
};
