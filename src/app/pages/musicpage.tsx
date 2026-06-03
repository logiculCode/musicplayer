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
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import MusicItem from "@/util/musicitem";
import { useAudioFiles } from "../../hooks/useaudiofiles";
import { useThumbnails } from "@/hooks/usethumbnail";

export default function MusicPage() {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const { songs, loading, error } = useAudioFiles();
  const {thumbs} = useThumbnails(songs);
  const [currentIndex, setCurrentIndex] = useState(0);

  // player
  const player = useAudioPlayer(
    songs.length > 0 ? { uri: songs[currentIndex].uri } : null,
  );
  const status = useAudioPlayerStatus(player);

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
        {/* <ScrollView style={styles.main}> */}
          <FlatList
            data={songs}
            keyExtractor={(item) => item.id}
            renderItem={({item})=> <MusicItem key={item.uri} id={item.title} thumbNail={thumbs[item.id] ?? null}/>}
          />
        {/* </ScrollView> */}
        <BottomSheet ref={bottomSheetRef} onChange={handleSheetChanges}>
          <BottomSheetView style={{ flex: 1 }}>
            <Text>Songs have been loaded</Text>
          </BottomSheetView>
        </BottomSheet>
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
