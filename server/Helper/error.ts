export const throwError = (statusCode: number, message: string) => {
  const err = new Error(message) as Error & { statusCode: number };
  err.statusCode = statusCode;
  return err;
};


