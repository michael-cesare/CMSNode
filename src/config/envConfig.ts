  
export namespace EnvConfig {
  export const port: number = parseInt(process.env.SERVER_PORT || "5000");

  export const env: string = process.env.APP_ENV || "development";

  export const loggerName: string = process.env.LOGGER_NAME || "CMSNode";

  export const loggerLevel: string = process.env.LOGGER_LEVEL || "info";

  // export const siteUrl: string = process.env.SITE_URL || "http://localhost:5000";
  export const siteUrl: string = "http://localhost:5000";

  export const useMock: boolean = true;
}
