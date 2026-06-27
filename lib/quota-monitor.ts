export interface QuotaStatus {
  requestsRemaining: number;
  tokensRemaining: number;
  resetRequests: string;
  resetTokens: string;
  lastUpdated: number;
}

let lastKnownQuotaStatus: QuotaStatus = {
  requestsRemaining: 9999,
  tokensRemaining: 9999,
  resetRequests: '0s',
  resetTokens: '0s',
  lastUpdated: 0,
};

export function getQuotaStatus(): QuotaStatus {
  return lastKnownQuotaStatus;
}

export async function fetchWithQuotaChecking(url: string, options: RequestInit): Promise<Response> {
  const now = Date.now();
  
  try {
    const response = await fetch(url, options);

    // Groq rate limit response headers:
    // x-ratelimit-remaining-requests
    // x-ratelimit-remaining-tokens
    // x-ratelimit-reset-requests
    // x-ratelimit-reset-tokens
    const remainingRequests = response.headers.get('x-ratelimit-remaining-requests');
    const remainingTokens = response.headers.get('x-ratelimit-remaining-tokens');
    const resetRequests = response.headers.get('x-ratelimit-reset-requests');
    const resetTokens = response.headers.get('x-ratelimit-reset-tokens');

    if (remainingRequests !== null) {
      lastKnownQuotaStatus.requestsRemaining = parseInt(remainingRequests, 10);
    }
    if (remainingTokens !== null) {
      lastKnownQuotaStatus.tokensRemaining = parseInt(remainingTokens, 10);
    }
    if (resetRequests !== null) {
      lastKnownQuotaStatus.resetRequests = resetRequests;
    }
    if (resetTokens !== null) {
      lastKnownQuotaStatus.resetTokens = resetTokens;
    }
    lastKnownQuotaStatus.lastUpdated = now;

    if (response.status === 429) {
      console.warn('AI Quota Monitor Warning: Rate Limit Exceeded (429) from API provider.');
      throw new Error('API Rate Limit Exceeded (429).');
    }

    return response;
  } catch (error: any) {
    console.error('API call in fetchWithQuotaChecking encountered error:', error.message);
    throw error;
  }
}
