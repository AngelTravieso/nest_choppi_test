export interface StandardResponse<T> {
  status: number;
  message: string;
  data: T;
  date: string;
  trackId: string;
}
