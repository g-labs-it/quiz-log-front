import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '';

  const trimmed = path.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('data:')) {
    return trimmed;
  }

  // Handle localhost url that may be missing the port from APP_URL
  if (trimmed.startsWith('http://localhost/storage/')) {
    return trimmed.replace('http://localhost/storage/', `${CONFIG.storageUrl}/`);
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  const cleanPath = trimmed.replace(/^\/+/, '').replace(/^storage\/+/, '');
  return `${CONFIG.storageUrl}/${cleanPath}`;
}
