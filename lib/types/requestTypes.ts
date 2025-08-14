export interface AuthRequestType {
  phoneNumber: string;
  password: string;
  // token: string;
}

export interface CompleteSignup {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
}
