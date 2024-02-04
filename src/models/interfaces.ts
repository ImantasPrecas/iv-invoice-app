export  interface IMyCustomError extends Error {
    statusCode?: number;
    error?: [];
    data: any
  }