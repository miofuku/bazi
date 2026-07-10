// MailerLite embedded-form subscribe — the one clean seam to email capture.
//
// Setup (once): in MailerLite create Forms → Embedded form, then copy the two
// IDs out of the embed snippet's action URL:
//   https://assets.mailerlite.com/jsonp/{ACCOUNT_ID}/forms/{FORM_ID}/subscribe
// Until both are filled in, the email block simply doesn't render.

const MAILERLITE_ACCOUNT_ID = '';
const MAILERLITE_FORM_ID = '';

export const emailConfigured = Boolean(MAILERLITE_ACCOUNT_ID && MAILERLITE_FORM_ID);

export async function subscribeEmail(email: string, readingUrl: string): Promise<void> {
  const body = new FormData();
  body.set('fields[email]', email);
  // Optional custom field — create "reading_url" in MailerLite to use it in
  // the welcome automation ("here's your reading"); ignored otherwise.
  body.set('fields[reading_url]', readingUrl);
  body.set('ml-submit', '1');

  const res = await fetch(
    `https://assets.mailerlite.com/jsonp/${MAILERLITE_ACCOUNT_ID}/forms/${MAILERLITE_FORM_ID}/subscribe`,
    { method: 'POST', body },
  );
  if (!res.ok) throw new Error(`subscribe failed: ${res.status}`);
}
