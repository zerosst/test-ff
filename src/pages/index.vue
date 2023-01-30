<template>
  <video style="margin:0 auto" :src="video" controls />
  <br>
  <input type="file" id="uploader" @change="transcode">
  <div mt-3>
    <button btn @click="transition('webm')">
      转换为webm
    </button>
    <button btn ml-2 @click="transition('mp4')">
      转换为MP4
    </button>
    <button btn ml-2 @click="transition('mkv')">
      转换为mkv
    </button>
    <button btn ml-2 @click="transition('ogv')">
      转换为ogv
    </button>
    <button btn ml-2 @click="download">
      下载视频
    </button>
  </div>
  <p>{{ message }}</p>
  <p>{{ '进度' + (ratios * 100).toFixed(2) + '%' }}</p>
</template>

<script lang="ts" setup>
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

let message = $ref("请上传视频");
let video = $ref<any>();
let ratios = $ref(0)
let videoName = $ref('')
let downloadName = $ref('')
// 创建ffmpeg
const ffmpeg = createFFmpeg({
  log: true,
});
// 查询进度
ffmpeg.setProgress(({ ratio }) => {
  ratios = ratio
});
// methods
const transcode = async (e: any) => {
  const file = e.target.files[0];
  const { name } = file
  if (!ffmpeg.isLoaded()) {
    message = "脚本加载中";
    await ffmpeg.load();
  }
  message = "视频读取中";
  ffmpeg.FS("writeFile", name, await fetchFile(file));
  message = "视频读取完成";
  videoName = name
  const data = ffmpeg.FS("readFile", name);
  video = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mp4" })
  );
}
const download = () => {
  if (video) {
    // 创建一个下载标签<a>
    const aLink = document.createElement('a')
    aLink.href = video
    // 2.直接使用自定义文件名,设置下载文件名称
    aLink.setAttribute('download', downloadName)
    document.body.appendChild(aLink)
    // 模拟点击下载
    aLink.click()
    // 移除改下载标签
    document.body.removeChild(aLink);
  } else {
    console.log('未存在转换视频');
  }
}
const transition = async (type: string) => {
  if (videoName) {
    message = "视频转换中";
    await ffmpeg.run("-i", videoName, `test.${type}`);
    message = "视频转换完成";
    downloadName = `test.${type}`
    const data = ffmpeg.FS("readFile", `test.${type}`);
    video = URL.createObjectURL(
      new Blob([data.buffer], { type: `video/${type}` })
    );
  } else {
    console.log('未选择文件');
  }
}
</script>

<style>

</style>
