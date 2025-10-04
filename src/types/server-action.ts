interface ActionSuccess<T = void> {
  success: true;
  data?: T;
  message?: string;
}

interface ActionError {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: string;
  };
}

export type ServerActionReturn<T = void> = ActionSuccess<T> | ActionError;
