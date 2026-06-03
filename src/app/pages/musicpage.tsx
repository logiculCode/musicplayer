import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MusicItem from "@/util/musicitem";
import { useAudioFiles } from "../../hooks/useaudiofiles";
import { useThumbnails } from "@/hooks/usethumbnail";

export default function MusicPage() {
  const { songs, loading, error } = useAudioFiles();
  // const {thumbs} = useThumbnails(songs);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#f5c842" />
        <Text style={{ color: "#fff", marginTop: 12 }}>
          Scanning audio files...
        </Text>
      </View>
    );

  if (error)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#f55" }}>{error}</Text>
      </View>
    );

  return (
    <GestureHandlerRootView>
      <View style={{ flex: 1 }}>
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          renderItem={({ item,index }) => (
            <MusicItem key={item.uri} index={index} song={item} thumbNail={null} />
          )}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // justifyContent:"center",
    // alignItems:'center'
  },
});
