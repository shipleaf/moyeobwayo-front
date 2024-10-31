import axiosInstance from "./axiosInstance";

export interface TableId {
  table_id: string;
}

export interface GetUserAvatarResponse {
  userId: number,
  userName: string,
  profileImage: string,
}

export const getUserAvatar = async (data: TableId): Promise<GetUserAvatarResponse[]> => {
  try {
    const response = await axiosInstance.get(`/party/${data.table_id}/users`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("에러 발생: ", error);
    throw error;
  }
};
