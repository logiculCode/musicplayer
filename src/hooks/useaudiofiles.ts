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

      setSongs(mapped);
    } catch (e) {
      setError("Failed to load audio files.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return { songs, loading, error, reload: loadAudioFiles };
}
