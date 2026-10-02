/**
 * Turns a stored file URL into one the browser can open.
 *
 *  - Cloudinary URLs (https://...) are returned unchanged.
 *  - Local uploads are stored as "/uploads/images/x.png". In development the Vite proxy serves
 *    them, but in production the frontend (Netlify) and API (Render) live on different origins,
 *    so the path must be prefixed with the API origin or images show as broken.
 *  - Private verification documents are opened through an authenticated API route.
 */
const apiBase = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (!envUrl)
        return '';                                     // dev: same origin via Vite proxy
    return envUrl.trim().replace(/\/$/, '').replace(/\/api$/, '');
};
export const assetUrl = (url) => {
    if (!url)
        return '';
    if (/^https?:\/\//i.test(url))
        return url;
    return `${apiBase()}${url.startsWith('/') ? '' : '/'}${url}`;
};
export const documentUrl = (url) => {
    if (!url)
        return '';
    if (/^https?:\/\//i.test(url))
        return url;
    const filename = url.split('/').pop();
    const token = localStorage.getItem('sharehope_token') || '';
    return `${apiBase()}/api/users/documents/file/${encodeURIComponent(filename)}?token=${encodeURIComponent(token)}`;
};
