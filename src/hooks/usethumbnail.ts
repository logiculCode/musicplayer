import { createVideoPlayer } from "expo-video";
import { AudioAsset } from "./useaudiofiles";
import { useEffect, useState } from "react";

// function to get audio image
async function getVideoThumbnail(videoUri: string): Promise<any | null> {
  const player = createVideoPlayer({ uri: videoUri });

  return new Promise((resolve) => {
    // Wait for the player to be ready before generating thumbnail
    const sub = player.addListener("statusChange", async ({ status }) => {
      if (status === "readyToPlay") {
        sub.remove();
        try {
          const [thumb] = await player.generateThumbnailsAsync([0], {
            maxWidth: 200,
            maxHeight: 200,
          });
          resolve(thumb); // pass the VideoThumbnail object directly to <Image>
        } catch {
          resolve(null);
        } finally {
          player.release();
        }
      } else if (status === "error") {
        sub.remove();
        player.release();
        resolve(null);
      }
    });
  });
}

// useThumbnails.ts
export function useThumbnails(songs: AudioAsset[]) {
  const [thumbs, setThumbs] = useState<Record<string, any>>({})

  useEffect(() => {
    if (songs.length === 0) return

    songs.forEach(async (song) => {
      if (thumbs[song.id]) return  // already generated

      const thumb = await getVideoThumbnail(song.uri)
      if (!thumb) return

      setThumbs(prev => ({ ...prev, [song.id]: thumb }))
    })
  }, [songs.length])

  return {thumbs}
}