// Lemon Squeezy paywall seam for the paired reading — the same pattern as
// emailService: until the checkout URL is filled in, paymentConfigured is
// false and the paired report stays entirely free (no gate is shown).
//
// Setup (once): create the product in Lemon Squeezy with license keys enabled,
// then paste its hosted-checkout link below, e.g.
//   https://YOURSTORE.lemonsqueezy.com/buy/UUID
// Optionally set LEMONSQUEEZY_STORE_ID (from a validate response's meta) so
// keys from other stores/products can't unlock this one.
//
// Honest note: this is a client-side gate — bypassable by a determined
// developer. Accepted for now (see docs/monetization.md, constraint 1);
// tighten server-side once a backend exists.

const LEMONSQUEEZY_CHECKOUT_URL = '';
const LEMONSQUEEZY_STORE_ID = 0;

export const PRICE_LABEL = '$19';
export const paymentConfigured = Boolean(LEMONSQUEEZY_CHECKOUT_URL);
export const checkoutUrl = LEMONSQUEEZY_CHECKOUT_URL;

const STORAGE_KEY = 'rootwise.pair.license';

export const hasEntitlement = (): boolean => {
  try { return Boolean(localStorage.getItem(STORAGE_KEY)); } catch { return false; }
};

// Validate a license key against Lemon Squeezy's public License API (no API
// key required). If the browser ever blocks this on CORS, swap the URL for a
// one-file serverless proxy — the UI doesn't change.
export async function unlockWithLicense(key: string): Promise<boolean> {
  const body = new FormData();
  body.set('license_key', key.trim());
  const res = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body,
  });
  if (!res.ok) return false;
  const json = await res.json();
  const valid = json?.valid === true;
  const storeOk = !LEMONSQUEEZY_STORE_ID || json?.meta?.store_id === LEMONSQUEEZY_STORE_ID;
  if (!valid || !storeOk) return false;
  try { localStorage.setItem(STORAGE_KEY, key.trim()); } catch { /* private mode */ }
  return true;
}
