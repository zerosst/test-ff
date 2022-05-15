<template>
  <video :src="video" controls />
  <br>
  <!-- <button @click="transcode">
    Start
  </button> -->
  <input type="file" id="uploader" @change="transcode">
  <p>{{ message }}</p>
</template>

<script lang="ts" setup>
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

// app state
const ffmpeg = createFFmpeg({
  log: true,
});
const message = ref("Click Start to Transcode");
let video = ref();
// methods
const transcode = async (e: { target: { files: { name: string; }[]; }; }) => {
  message.value = "Loading ffmeg-core.js";
  const file = e.target.files[0];
  const { name } = file
  await ffmpeg.load();
  message.value = "Start transcoding";
  ffmpeg.FS("writeFile", name, await fetchFile(file));
  await ffmpeg.run("-i", name, "test.mp4");
  message.value = "Complete transcoding";
  const data = ffmpeg.FS("readFile", "test.mp4");
  video.value = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mp4" })
  );
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
