import { useState, useEffect } from "react";
import { createVideoPlayer } from "expo-video";
import {
  usePermissions,
  Query,
  Asset,
  AssetField,
  MediaType,
} from "expo-media-library";

export type AudioAsset = {
  id: string;
  title: string;
  duration: number; // milliseconds — call getDuration()
  uri: string;
};

// Folders to exclude — add or remove as needed
const EXCLUDED_FOLDERS = [
  "/Notifications/",
  "/Ringtones/",
  "/Alarms/",
  "/Podcasts/",
  "/Audiobooks/",
  "/WhatsApp/", // WhatsApp voice notes & received audio
  "/Android/media/", // app-specific media caches
  "/Telegram/",
  "/recordings/", // voice recorder apps
  "/PTT/", // push-to-talk apps
];

function isExcluded(uri: string): boolean {
  return EXCLUDED_FOLDERS.some((folder) =>
    uri.toLowerCase().includes(folder.toLowerCase()),
  );
}

export function useAudioFiles() {
  const [songs, setSongs] = useState<AudioAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [permission, requestPermission] = usePermissions({
    granularPermissions: ["audio"],
  });

  useEffect(() => {
    if (!permission) return;

    if (!permission.granted) {
      if (permission.canAskAgain) {
        requestPermission();
      } else {
        setError("Permission denied. Enable it in device settings.");
        setLoading(false);
      }
      return;
    }

    loadAudioFiles();
  }, [permission?.granted]);

  async function loadAudioFiles() {
    try {
      setLoading(true);

      // New Query API — replaces deprecated getAssetsAsync
      const assets = await new Query()
        .eq(AssetField.MEDIA_TYPE, MediaType.AUDIO)
        .orderBy(AssetField.CREATION_TIME)
        .exe();

      // Asset properties are async getters now
      const mapped = await Promise.all(
        assets.map(async (asset) => {
          const uri = await asset.getUri();
          const filename = await asset.getFilename();
          const duration = await asset.getDuration(); // milliseconds, can be null

          return {
            id: asset.id,
            title: filename.replace(/\.[^/.]+$/, ""),
            duration: duration ?? 0,
            uri,
          };
        }),
      );

      // Filter out excluded folders and very short clips (under 30s)
      const filtered = mapped.filter((song) => {
        if (isExcluded(song.uri)) return false;
        if (song.duration > 0 && song.duration < 30_000) return false; // skip < 30 seconds
        return true;
      });

      setSongs(filtered);
    } catch (e) {
      setError("Failed to load audio files.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return { songs, loading, error, reload: loadAudioFiles };
}
