export default function (statuses: string, status: number): number {
  try {
    const statusesToPass = JSON.parse(statuses);
    if (!Array.isArray(statusesToPass)) throw new Error();
    if (statusesToPass.includes(status)) {
      return Number(status);
    } else {
      return 200;
    }
  } catch {
    return 200;
  }
}
