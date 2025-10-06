export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}


export interface PageMeta {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
}

export interface Paginate<T = any> extends PageMeta {
  items: T[];
}
