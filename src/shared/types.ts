export type ConfirmFn = (title: string, text: string) => Promise<boolean>;

export type Notify = {
  info: (msg: string) => void;
  success: (msg: string) => void;
  error: (msg: string) => void;
  warn: (msg: string) => void;
  confirm: ConfirmFn;
};
