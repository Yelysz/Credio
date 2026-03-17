export interface ApiResponse<T> {
  detail: string;
  type: string;
  statusCode: number;
  data: T;
}