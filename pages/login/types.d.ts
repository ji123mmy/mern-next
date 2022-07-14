export interface LoginFormValues {
  username: string;
  password: string;
}

export interface LoginFormError {
  username?: string;
  password?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  token: string;
}
