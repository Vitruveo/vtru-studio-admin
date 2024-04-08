import { ASSET_STORAGE_URL } from "@/constants/asset";

export const buildAssetSource = (path?: string) => {
  if (!path) return undefined;
  return `${ASSET_STORAGE_URL}/${path}`;
};

export const isVideoMedia = (media: string) => {
  return media.includes('.mp4' || '.webm' || '.ogg' || '.mov' || '.avi' || '.flv' || '.wmv' || '.mkv');
};