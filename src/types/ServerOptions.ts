export default interface ServerOptions {
  maintainer?: {
    email: string;
    website: string;
  };
  logLevel?: 0 | 1 | 2;
  // logLevel?: "none" | "error" | "debug";
  stackTrace?: boolean;
}
