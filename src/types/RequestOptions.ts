export default interface RequestOptions {
  protocol: string;
  host: string;
  port: string | number;
  path: string;
  method: string;
  headers: { [key: string]: string };
}
