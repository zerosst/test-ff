<template>
  <video style="margin:0 auto" :src="video" controls />
  <br>
  <input type="file" id="uploader" @change="transcode">
  <button @click="download">
    下载视频
  </button>
  <p>{{ message }}</p>
</template>

<script lang="ts" setup>
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

// app state
const ffmpeg = createFFmpeg({
  log: true,
});
let message = $ref("请上传视频");
let video = $ref<any>();
// methods
const transcode = async (e:any) => {
  const file = e.target.files[0];
  const { name } = file
  await ffmpeg.load();
  message = "视频转换中";
  ffmpeg.FS("writeFile", name, await fetchFile(file));
  await ffmpeg.run("-i", name, "test.mp4");
  message = "视频转换完成";
  const data = ffmpeg.FS("readFile", "test.mp4");
  video = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mp4" })
  );
  console.log(video);
}
const download=()=>{
  console.log(video);
  if(video){
    // 创建一个下载标签<a>
      const aLink = document.createElement('a')
      aLink.href = video
      // 2.直接使用自定义文件名,设置下载文件名称
      aLink.setAttribute('download', 'test.mp4' )
      document.body.appendChild(aLink)
      // 模拟点击下载
      aLink.click()
      // 移除改下载标签
      document.body.removeChild(aLink);
  }else{
    console.log('未存在转换视频');
    
  }
}
</script>

<style>
</style>
