import { PostLikeDTO } from "@/shared/domain/like/likeDTO";
import { LikeEntity } from "@/shared/domain/like/likeEntity";
import { axiosIns } from "@/shared/libs/axiosIns";
import { ApiResponse } from "@/shared/types/apiResponseType";
import { AxiosError } from "axios";

export const postLikeApi = async (data: PostLikeDTO, query: string = "") => {
  try {
    const response = await axiosIns.post<ApiResponse<LikeEntity>>(
      `/likes?${query}`,
      data,
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data as ApiResponse<null>;
    }
  }
};
