import { PostCommentDTO } from "@/shared/domain/comment/commentDTO";
import { CommentEntity } from "@/shared/domain/comment/commentEntity";
import { axiosIns } from "@/shared/libs/axiosIns";
import { ApiResponse } from "@/shared/types/apiResponseType";
import { AxiosError } from "axios";

export const postCommentApi = async (
  data: PostCommentDTO,
  query: string = "",
) => {
  try {
    const response = await axiosIns.post<ApiResponse<CommentEntity>>(
      `/comments?${query}`,
      data,
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data as ApiResponse<null>;
    }
  }
};
