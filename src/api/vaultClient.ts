// vaultClient.ts
// Declares the Vault API client surface for the Assets Manager. All requests are mediated by the Vault; no secrets are stored here.

const resolvedBaseUrl = (() => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VAULT_API_BASE_URL) {
    return import.meta.env.VAULT_API_BASE_URL as string;
  }
  if (typeof process !== 'undefined' && process.env && process.env.VAULT_API_BASE_URL) {
    return process.env.VAULT_API_BASE_URL;
  }
  return '';
})();

function ensureBaseUrl(): string {
  if (!resolvedBaseUrl) {
    throw new Error('Vault API base URL is not configured.');
  }
  return resolvedBaseUrl;
}

function buildRequestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

type RequestOptions = {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  sessionToken?: string;
};

type VaultResponse<T> = Promise<T>;

async function request<T = unknown>({ path, method = 'GET', body, sessionToken }: RequestOptions): VaultResponse<T> {
  const headers = new Headers();
  headers.set('X-Request-ID', buildRequestId());
  if (sessionToken) {
    headers.set('Authorization', `Bearer ${sessionToken}`);
  }
  const hasBody = body !== undefined && body !== null;
  if (hasBody) {
    headers.set('Content-Type', 'application/json');
  }

  const baseUrl = ensureBaseUrl();
  let response: Response;

  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: hasBody ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    console.error('Vault request failed to reach server', error);
    throw new Error('Vault request failed');
  }

  if (response.status === 401 || response.status === 403) {
    console.error('Vault access denied', { status: response.status });
    throw new Error('Vault access denied');
  }

  if (!response.ok) {
    console.error('Vault request returned non-OK status', { status: response.status });
    throw new Error('Vault request failed');
  }

  try {
    return (await response.json()) as T;
  } catch (_error) {
    return undefined as unknown as T;
  }
}

export function createVaultClient() {
  return {
    getSession(sessionToken?: string) {
      return request<{ session: unknown }>({ path: '/session', sessionToken });
    },
    async assertSession(sessionToken?: string) {
      return request<{ session: unknown }>({ path: '/session/assert', sessionToken });
    },
    fetchAssets(sessionToken?: string) {
      return request<{ assets: unknown[] }>({ path: '/assets', sessionToken });
    },
    fetchActivity(sessionToken?: string) {
      return request<{ activity: unknown[] }>({ path: '/activity', sessionToken });
    },
  } as const;
}
