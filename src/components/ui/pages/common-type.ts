export type PageUIProps = {
  errorText?: string;
  email: string;
  setEmail: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
};
