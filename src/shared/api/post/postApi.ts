import { PostEntity } from "@/shared/domain/post/postEntity";
import { axiosIns } from "@/shared/libs/axiosIns";
import { ApiResponse } from "@/shared/types/apiResponseType";
import { AxiosError } from "axios";

export const getPostsApi = async (query: string = "") => {
  try {
    const response = await axiosIns.get<ApiResponse<PostEntity[]>>(
      `/posts?${query}`,
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data as ApiResponse<null>;
    }
  }
};

export const getPostByIdApi = async (id: string, query: string = "") => {
  try {
    const response = await axiosIns.get<ApiResponse<PostEntity>>(
      `/posts/${id}?${query}`,
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data as ApiResponse<null>;
    }
  }
};

export const postPostApi = async (data: FormData, query?: string) => {
  try {
    const response = await axiosIns.post<ApiResponse<PostEntity>>(
      `/posts?${query}`,
      data,
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data as ApiResponse<null>;
    }
  }
};
