export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPERIMENTAL_DATA_CAPTURE_ENABLED?: boolean;
      EXPERIMENTAL_DATA_CAPTURE_EXPORT_URL?: string;
      ENV?: 'test' | 'dev' | 'prod';
    }
  }
}
