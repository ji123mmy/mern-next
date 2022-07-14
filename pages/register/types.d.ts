export interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterFormError {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}
