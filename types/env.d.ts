declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL?: string;
    JWT_SECRET?: string;
    BUN_PUBLIC_BASE_URL?: string;
    PORT?: string;
  }
}
