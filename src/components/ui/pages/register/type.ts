export type RegisterUIProps = {
  errorText?: string;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  userName: string;
  setUserName: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
};
