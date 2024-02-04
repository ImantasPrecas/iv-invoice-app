export const newError = (msg: string, statusCode: number, data?: any) => {
    const error = new Error(msg) as any;
    error.statusCode = statusCode;
    if (data) {
      error.data = data;
    }
    return error
  };