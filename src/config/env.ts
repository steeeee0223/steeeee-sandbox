export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MAILCHIMP_URL = import.meta.env.VITE_MAILCHIMP_URL;
const params = new URLSearchParams({
    u: import.meta.env.VITE_MAILCHIMP_U,
    id: import.meta.env.VITE_MAILCHIMP_ID,
});

export const MAILCHIMP_API = `${MAILCHIMP_URL}?${params}`;
