import { PostSessionDTO } from "@/shared/domain/session/sessionDTO";
import { SessionEntity } from "@/shared/domain/session/sessionEntity";
import { axiosIns } from "@/shared/libs/axiosIns";
import { ApiResponse } from "@/shared/types/apiResponseType";
import { AxiosError } from "axios";

export const getSessionByIdApi = async (id: string, query?: string) => {
  try {
    const response = await axiosIns.get<ApiResponse<SessionEntity>>(
      `/sessions/${id}?${query}`,
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data.data as ApiResponse<null>;
    }
  }
};

export const postSessionApi = async (
  data: PostSessionDTO,
  query: string = "",
) => {
  try {
    const response = await axiosIns.post<
      ApiResponse<SessionEntity & { accessToken: string }>
    >(`/sessions?${query}`, data);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data as ApiResponse<null>;
    }
  }
};

export const deleteSessionById = async (id: string) => {
  try {
    const response = await axiosIns.delete<ApiResponse<SessionEntity>>(
      `/sessions/${id}`,
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data as ApiResponse<null>;
    }
  }
};
