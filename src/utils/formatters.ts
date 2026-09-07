UPDATE REQUIRED — REPLACE HARDCODED FTC PRICE WITH LIVE MARKET PRICE

Target Token:
FTC / Fitcoin
Solana Mint Address:
5cKaxcoLhjc5A3gUD9nCFRfm69iMiggTHpafz4Gipump

CURRENT PROBLEM:
The existing "src/utils/formatters.ts" contains hardcoded values:

export const FTC_PRICE_USD = 0.000002986;
export const FTC_HIGH_24H = 0.000003432;
export const FTC_LOW_24H = 0.000002586;

These values must NOT be treated as the current market price.

REQUIRED CHANGE:

1. Remove the hardcoded FTC market price as the source of truth.

2. Implement a LIVE FTC PRICE SERVICE that fetches the current market price for the exact Solana mint address:

5cKaxcoLhjc5A3gUD9nCFRfm69iMiggTHpafz4Gipump

3. Use a reliable Solana-compatible market-price/data API that can identify the token by mint address rather than relying only on the ticker symbol "FTC".

4. The system must dynamically retrieve:
   
   - Current FTC/USD price
   - 24-hour price change
   - 24-hour high
   - 24-hour low
   - 24-hour volume, if available
   - Liquidity, if available
   - Last updated timestamp

5. Do NOT manually enter or periodically hardcode the price.

6. Add caching/rate-limit protection so the frontend does not repeatedly call the external API unnecessarily.

7. Recommended architecture:

Frontend
→ Backend/API proxy
→ Live market-price provider
→ Exact Solana mint address
→ Return normalized FTC market data

Do NOT expose any private API keys in React/Expo frontend code.

8. Update "formatFtcToUsd()" so that it receives the latest live price:

formatFtcToUsd(ftcAmount, liveFtcPriceUsd)

The calculation must remain:

USD Value = FTC Amount × Live FTC/USD Price

9. The UI must clearly display:

FTC Price: $LIVE_PRICE
24H Change: LIVE_CHANGE%
24H High: LIVE_HIGH
24H Low: LIVE_LOW
Last Updated: LIVE_TIMESTAMP

10. If the price API temporarily fails:

- Do NOT show "$0"
- Do NOT invent a price
- Do NOT silently revert to the old hardcoded price
- Display the last successfully cached price with a "Last updated" indicator, or show "Price unavailable" if no cached price exists.

11. Validate that the returned token/mint address exactly matches:

5cKaxcoLhjc5A3gUD9nCFRfm69iMiggTHpafz4Gipump

This is mandatory to prevent accidentally displaying the price of another token with ticker FTC.

12. Keep "formatUsd()" precision handling because FTC is a micro-priced token and values such as:

$0.000002986

must not be rounded to "$0.00".

13. Add automated tests for:

- Live price conversion
- Very small USD values
- 24H high/low
- API failure
- Cached price fallback
- Wrong mint-address response rejection
- Zero/negative/invalid price rejection

14. Remove or rename the existing constants so developers cannot accidentally use stale hardcoded market data.

15. The token mint address must be defined as a single configuration constant:

FTC_MINT_ADDRESS =
"5cKaxcoLhjc5A3gUD9nCFRfm69iMiggTHpafz4Gipump"

Do not duplicate this address throughout the codebase.

IMPORTANT:
The live market price must come from actual market data for this exact Solana token. Do not use a manually entered price, estimate, previous price, or unrelated FTC token.

Also update every dashboard, wallet, marketplace, reward, balance, portfolio, and USD-conversion component that currently depends on the old "FTC_PRICE_USD" constant so that they use the centralized live FTC price service.

Acceptance Test:
If the market price changes from P1 to P2, the application must automatically display P2 without requiring a new application build or manually changing source code.
