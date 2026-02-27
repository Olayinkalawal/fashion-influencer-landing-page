const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(error) {
  return error instanceof TypeError;
}

function isRetryableStatus(status) {
  return RETRYABLE_STATUS_CODES.has(status);
}

export async function fetchWithRetry(
  url,
  options = {},
  config = {},
) {
  const attempts = config.attempts ?? 3;
  const baseDelayMs = config.baseDelayMs ?? 500;
  const method = options.method ?? "GET";

  let lastResponse = null;
  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (response.ok || !isRetryableStatus(response.status) || attempt === attempts) {
        return response;
      }

      lastResponse = response;
      const delay = baseDelayMs * 2 ** (attempt - 1);
      console.warn(
        `[retry] ${method} ${url} returned ${response.status} (attempt ${attempt}/${attempts}), retrying in ${delay}ms`,
      );
      await wait(delay);
      continue;
    } catch (error) {
      lastError = error;
      if (!isRetryableError(error) || attempt === attempts) {
        throw error;
      }

      const delay = baseDelayMs * 2 ** (attempt - 1);
      console.warn(
        `[retry] ${method} ${url} failed with network error (attempt ${attempt}/${attempts}), retrying in ${delay}ms`,
      );
      await wait(delay);
    }
  }

  if (lastResponse) {
    return lastResponse;
  }

  throw lastError ?? new Error(`Request failed: ${method} ${url}`);
}
