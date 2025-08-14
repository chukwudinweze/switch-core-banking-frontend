export interface ApiResponse<T> {
  succeeded: boolean;
  code: number;
  message: string;
  data: T;
  pageMeta: PageMeta;
  error: string[] | null;
}

export interface PageMeta {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

export interface AuthResponseType {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  defaultRole: number;
  defaultRoleMeaning: string;
  isActive: true;
  isLoggedIn: true;
  lastLoginTime: string;
  jwToken: string;
  expiresIn: number;
  expiryDate: string;
  // Add OAuth 2.0 fields
  refreshToken?: string;
  scope?: string;
  tokenType?: string;
}
