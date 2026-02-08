export type ResetPasswordUIProps = {
  errorText?: string;
  password: string;
  setPassword: (value: string) => void;
  token: string;
  setToken: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
};
