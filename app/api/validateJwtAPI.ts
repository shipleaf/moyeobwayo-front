import axiosInstance from "./axiosInstance";

export interface jwtData {
    jwt: string;
}

export interface validateResponse{
    message: boolean;
}

export const validateJwt = async (data: jwtData): Promise<validateResponse> => {
  try {
    const response = await axiosInstance.post("/", data);
    return response.data;
  } catch (error){
    console.log(error)
    throw(error)
  }
};
