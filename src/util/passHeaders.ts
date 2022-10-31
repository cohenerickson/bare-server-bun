export default function passHeaders(
  passHeaders: string,
  headers: Headers
): { [key: string]: string } {
  try {
    const headersToPass = JSON.parse(passHeaders);
    const headersToPassObject: { [key: string]: string } = {};
    for (let i = 0; i < headersToPass.length; i++) {
      if (headers.has(headersToPass[i])) {
        headersToPassObject[headersToPass[i]] =
          "" + headers.get(headersToPass[i]);
      }
    }
    return headersToPassObject;
  } catch {
    return {};
  }
}
