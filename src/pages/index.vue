<script lang="ts" setup>
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import WebTorrent from 'webtorrent/dist/webtorrent.min.js';

const client = new WebTorrent()
console.log(client,'client');
// const torrentId = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'
const torrentId = 'magnet:?xt=urn:btih:7a257c98c7287886c3740fc901879ba96591ba05&dn=test.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337'
// const torrentId = 'magnet:?xt=urn:btih:3ac4fea59d5ff7566162a23bc52782e3ee6b5de7&dn=test2.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337'
navigator.serviceWorker.register('sw.min.js', { scope: './' }).then(reg => {
  console.log(reg,'reg');
  
  const worker:any = reg.active || reg.waiting || reg.installing
  console.log(worker.state,'worker.state');
  
  function checkState(worker:any) {
    return worker.state === 'activated' && client.createServer({ controller: reg }) && showTorren()
  }
  if (!checkState(worker)) {
    worker.addEventListener('statechange', ({ target }:any) => checkState(target))
  }
})

//展示内容
const showTorren =()=>{
  console.log(torrentId,'torrentId');
  
  client.add(torrentId, function (torrent:any) {
    console.log(torrent,'torrent');
    
  // Torrents can contain many files. Let's use the .mp4 file
  const file = torrent.files.find(function (file:any) {
    return file.name.endsWith('.mp4')
  })
  console.log(file,'file');
  
 // Stream the file in the browser
 file.streamTo(document.querySelector('#output'))
})

}

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
const streamfile = async () => {
  if (videoName) {
    message = "视频转换中";
    await ffmpeg.run("-i", videoName, '-strict', '-2', '-c:v', 'libx264', '-c:a', 'aac', '-f', 'hls', 'test.m3u8');
    // await ffmpeg.run("-i", videoName, '-c', 'copy', '-map', '0', '-f', '-segment_list', 'test.m3u8', '-segment_time', '2', 'test%03d.ts');
    message = "视频转换完成";
    downloadName = 'test.m3u8'
    const data = ffmpeg.FS("readFile", 'test.m3u8');
    video = URL.createObjectURL(
      new Blob([data.buffer], { type: `video/m3u8` })
    );
  } else {
    console.log('未选择文件');
  }
}
const intercept = async () => {
  if (videoName) {
    message = "视频截取中";
    await ffmpeg.run('-ss','00:00:04','-to','00:00:08',"-i", videoName, '-y', '-f', 'mp4', '-vcodec', 'copy', '-acodec','copy', '-q:v','1', 'test2.mp4');
    message = "视频截取完成";
    downloadName = 'test2.mp4'
    const data = ffmpeg.FS("readFile", 'test2.mp4');
    video = URL.createObjectURL(
      new Blob([data.buffer], { type: `video/mp4` })
    );
  } else {
    console.log('未选择文件');
  }
}
</script>
<template>
  <video id="output" style="margin:0 auto" :src="video" controls />
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
    <button btn ml-2 @click="transition('avi')">
      转换为avi
    </button>
    <button btn ml-2 @click="transition('ts')">
      转换为ts
    </button>
    <button btn ml-2 @click="streamfile">
      输出流文件
    </button>
    <button btn ml-2 @click="intercept">
      截取视频
    </button>
    <button btn ml-2 @click="download">
      下载视频
    </button>
  </div>
  <p>{{ message }}</p>
  <p>{{ '进度' + (ratios * 100).toFixed(2) + '%' }}</p>
</template>
<style>

</style>
