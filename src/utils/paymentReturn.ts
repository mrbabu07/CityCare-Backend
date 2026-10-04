export function paymentReturnUrl(
  outcome: "success" | "failed" | "cancelled" | "unverified",
  complaintId?: string,
): string | null {
  const base = process.env.FRONTEND_URL;
  if (!base) return null;
  const url = new URL(base);
  if (
    url.username ||
    url.password ||
    (url.protocol !== "https:" &&
      !(
        url.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(url.hostname)
      ))
  ) {
    throw new Error(
      "FRONTEND_URL must use HTTPS (HTTP is allowed for localhost)",
    );
  }
  const target = new URL("/payment/result", url.origin);
  target.searchParams.set("outcome", outcome);
  if (complaintId) target.searchParams.set("complaintId", complaintId);
  return target.toString();
}
