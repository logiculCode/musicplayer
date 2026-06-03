import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import React from "react";
import { Images } from "@/assets/images";
import { router } from "expo-router";
import { AudioAsset } from "@/hooks/useaudiofiles";

export default function MusicItem({thumbNail, song, index}:{thumbNail:any | null,song:AudioAsset, index:number}) {
  return (
    <Pressable style={styles.main} onPress={() => router.push({pathname:'/pages/musicplayer', params:{song:JSON.stringify(song)}})}>
      <Image
        source={thumbNail?? Images.pain}
        style={{ aspectRatio: 1 / 1, width: 75, borderRadius: 5 }}
      />
      {/* Details */}
      <View style={styles.details}>
        <Text>{song.title}</Text>
        <Text>Artist name</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical:5
  },
  details:{
    alignSelf:'center',
    marginLeft:15
  }
});
