import fs from "fs";

export function auditLog(message: string) {
  fs.appendFileSync("audit.log", `${new Date().toISOString()} - ${message}\n`);
}
