import crypto from "crypto";

const COOKIE_NAME = "admin_auth";

function expectedToken() {
  const password = process.env.ADMIN_PASSWORD ?? "";
  return crypto.createHmac("sha256", "moneystom7-admin-session").update(password).digest("hex");
}

export function isValidPassword(input: string) {
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!password) return false;
  return input === password;
}

export function getCookieName() {
  return COOKIE_NAME;
}

export function getSessionToken() {
  return expectedToken();
}

export function isValidSessionToken(token: string | undefined) {
  if (!token) return false;
  return token === expectedToken();
}
