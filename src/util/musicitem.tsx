import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import React from "react";
import { Images } from "@/assets/images";

export default function MusicItem({thumbNail, id}:{thumbNail:any | null,id:string}) {
  return (
    <View style={styles.main}>
      <Image
        source={thumbNail}
        style={{ aspectRatio: 1 / 1, width: 75, borderRadius: 5 }}
      />
      {/* Details */}
      <View style={styles.details}>
        <Text>{id}</Text>
        <Text>Artist name</Text>
      </View>
    </View>
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
