type LogLevel = "info" | "warn" | "error";

export function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context: context ?? {},
  };

  if (level === "error") {
    // eslint-disable-next-line no-console
    console.error(JSON.stringify(payload));
    return;
  }

  if (level === "warn") {
    // eslint-disable-next-line no-console
    console.warn(JSON.stringify(payload));
    return;
  }

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(payload));
}
