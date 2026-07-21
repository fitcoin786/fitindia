export const FTC_PRICE_USD = 0.000002986;
export const FTC_HIGH_24H = 0.000003432;
export const FTC_LOW_24H = 0.000002586;
export const PROMOTION_URL = "https://www.futurecoin.in";

/**
 * Format small USD amounts (like $0.000002986) without losing decimal precision
 */
export function formatUsd(amountUsd: number): string {
  if (amountUsd === 0) return '$0.00';
  if (amountUsd < 0.01) {
    // Show precision up to 9 decimals for micro-prices
    return `$${amountUsd.toFixed(9).replace(/0+$/, '').replace(/\.$/, '')}`;
  }
  return `$${amountUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
}

/**
 * Convert FTC token amount directly to USD formatted string
 */
export function formatFtcToUsd(ftcAmount: number, priceUsd: number = FTC_PRICE_USD): string {
  const usd = ftcAmount * priceUsd;
  return formatUsd(usd);
}
