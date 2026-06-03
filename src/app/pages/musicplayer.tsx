import { Images } from "@/assets/images";
import { AudioAsset } from "@/hooks/useaudiofiles";
import Slider from "@expo/ui/community/slider";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  RewindIcon,
} from "phosphor-react-native";
import { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function MusicPlayer() {
  const { song: songData } = useLocalSearchParams<{ song: string }>();
  const song: AudioAsset = useMemo(() => {
    try {
      return JSON.parse(songData || "{}");
    } catch {
      return {};
    }
  }, [songData]);

  const [progress, setProgress] = useState<number>(0);
  const myPlayer = useAudioPlayer(song.uri || null);
  const playerStatus = useAudioPlayerStatus(myPlayer);

  const handlePlayPause = useCallback(() => {
    playerStatus.playing ? myPlayer.pause() : myPlayer.play();
  }, [playerStatus.playing, myPlayer]);

  const handleRewind = useCallback(() => {
    const newTime = Math.max(0, playerStatus.currentTime - 10);
    myPlayer.seekTo(newTime);
  }, [myPlayer, playerStatus.currentTime]);

  const handleForward = useCallback(() => {
    const newTime = Math.min(
      playerStatus.duration,
      playerStatus.currentTime + 10,
    );
    myPlayer.seekTo(newTime);
  }, [myPlayer, playerStatus.currentTime, playerStatus.duration]);

  const handleSliderChange = useCallback(
    (value: number) => {
      myPlayer.seekTo(value);
    },
    [myPlayer],
  );

  if (!song.uri) {
    return (
      <View style={styles.main}>
        <Text style={styles.errorText}>No song selected</Text>
      </View>
    );
  }

  return (
    <View style={styles.main}>
      <Image source={Images.pain} style={styles.albumArt} />

      <View style={styles.controlsContainer}>
        <Slider
          value={playerStatus.currentTime}
          onValueChange={handleSliderChange}
          minimumValue={0}
          maximumValue={playerStatus.duration || 1}
          minimumTrackTintColor="white"
          thumbTintColor="white"
        />
        <View style={styles.time}>
          <Text style={styles.timeText}>{playerStatus.currentTime}</Text>
          <Text style={styles.timeText}>{playerStatus.duration}</Text>
        </View>

        <View style={styles.mainControls}>
          <Pressable onPress={handleRewind}>
            <RewindIcon size={36} />
          </Pressable>

          <Pressable onPress={handlePlayPause}>
            {playerStatus.playing ? (
              <PauseIcon size={36} />
            ) : (
              <PlayIcon size={36} />
            )}
          </Pressable>

          <Pressable onPress={handleForward}>
            <FastForwardIcon size={36} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  albumArt: {
    aspectRatio: 1,
    width: 350,
    borderRadius: 8,
    alignSelf: "center",
  },
  controlsContainer: {
    // gap: 16,
  },
  time: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginVertical: 8,
  },
  timeText: {
    color: "#666",
    fontSize: 12,
  },
  mainControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 24,
    marginBottom:24
  },
  errorText: {
    color: "#f55",
    fontSize: 16,
    textAlign: "center",
  },
});
