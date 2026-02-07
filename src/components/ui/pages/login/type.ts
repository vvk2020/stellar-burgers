export type LoginUIProps = {
  errorText?: string;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
};
