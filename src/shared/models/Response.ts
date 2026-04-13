export interface ApiResponse<T> {
  detail: string;
  type: string;
  statusCode: number;
  data: T;
}

export const unwrapApiResponse = <T>(response: ApiResponse<T>): T => {
  return response.data;
};