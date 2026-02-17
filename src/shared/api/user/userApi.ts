import { UserEntity } from "@/shared/domain/user/userEntity";
import { axiosIns } from "@/shared/libs/axiosIns";
import { ApiResponse } from "@/shared/types/apiResponseType";
import { AxiosError } from "axios";

export const getUserByIdApi = async (id: string, query: string = "") => {
  try {
    const response = await axiosIns.get<ApiResponse<UserEntity>>(
      `/users/${id}?${query}`,
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data as ApiResponse<null>;
    }
  }
};

export const postUserApi = async (data: FormData, query?: string) => {
  try {
    const response = await axiosIns.post<ApiResponse<UserEntity>>(
      `/users?${query}`,
      data,
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data as ApiResponse<null>;
    }
  }
};

export const patchUserByIdApi = async (
  id: string,
  data: FormData,
  query?: string,
) => {
  try {
    const response = await axiosIns.patch<ApiResponse<UserEntity>>(
      `/users/${id}?${query}`,
      data,
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data as ApiResponse<null>;
    }
  }
};
