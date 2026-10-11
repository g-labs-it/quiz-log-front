import packageJson from '../package.json';

// ----------------------------------------------------------------------

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (!envUrl) {
    return 'http://localhost:8000/api/v1';
  }
  const cleanUrl = envUrl.replace(/\/+$/, '');
  return cleanUrl.endsWith('/api/v1') ? cleanUrl : `${cleanUrl}/api/v1`;
};

const getStorageURL = () => {
  const storageUrl = import.meta.env.VITE_STORAGE_URL?.trim();
  if (storageUrl) {
    return storageUrl.replace(/\/+$/, '');
  }
  const apiUrl = getBaseURL();
  return `${apiUrl.replace(/\/api\/v1\/?$/, '')}/storage`;
};

export type ConfigValue = {
  appName: string;
  appVersion: string;
  apiUrl: string;
  storageUrl: string;
};

export const CONFIG: ConfigValue = {
  appName: 'G Labs',
  appVersion: packageJson.version,
  apiUrl: getBaseURL(),
  storageUrl: getStorageURL(),
};
