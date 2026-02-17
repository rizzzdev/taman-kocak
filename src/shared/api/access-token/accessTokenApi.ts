import { axiosIns } from "@/shared/libs/axiosIns";
import { ApiResponse } from "@/shared/types/apiResponseType";
import { AxiosError } from "axios";

export const postAccessTokenApi = async () => {
  try {
    const response = await axiosIns.post<ApiResponse<string>>(
      "/access-tokens",
      null,
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data as ApiResponse<null>;
    }
  }
};
