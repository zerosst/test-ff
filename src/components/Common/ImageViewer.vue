<template>
  <div class="view-container">
    <el-image class="image" :src="previewFile.url" :fit="fit" :lazy="true">
      <template #error>
        <div class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </template>
    </el-image>
    <div class="btn-groups">
      <el-button type="text" @click="showPreviewBox">查看</el-button>
      <el-upload v-if="canUpload" ref="uploadRef" :action="action" :multiple="canMultiple" :limit="limit"
        :before-upload="beforeUploadFile" :auto-upload="isAutoUpload" :headers="headers" :data="data" :name="name"
        :accept="accept" :on-success="onSuccessFile" :on-error="onErrorFile" :show-file-list="showFileList">
        <el-button type="text">上传文件</el-button>
      </el-upload>
      <el-button v-if="canDownload" type="text" @click="download">下载</el-button>
    </div>
    <el-image-viewer v-if="isPreview" :url-list="previewList" @close="closePreviewBox" :z-index="10000">
    </el-image-viewer>
  </div>
</template>
<script lang="ts">
import { fileType } from '@/utils/constant/type'
import { downloadFile } from '@/utils/file'

export default defineComponent({
  name: 'ImageViewer',
  props: {
    fit: {
      type: String, default: 'fill',
    },
    file: {
      type: Object as PropType<fileType>, default: () => ({
        url: '',
        fullname: '',
        name: '',
        type: ''
      })
    },
    fileList: {
      type: Array as PropType<Array<fileType>>,
      default: () => ([])
    },
    canReview: { type: Boolean, default: true },
    canUpload: { type: Boolean, default: false },
    canDownload: { type: Boolean, default: true },
    action: { type: String, default: '#' },
    canMultiple: { type: Boolean, default: false },
    limit: { type: Number, default: 1 },
    maxSize: { type: Number, default: 1024 * 1024 * 1000 },
    isAutoUpload: { type: Boolean, default: true },
    headers: { type: Object, default: () => ({}) },
    data: { type: Object, default: () => ({}) },
    name: { type: String, default: 'file' },
    accept: { type: String, default: '' },
    showFileList: { type: Boolean, default: false }
  },
  setup(props, { attrs, slots, emit }) {

    /** props start */
    const { fit, file, fileList, canReview, canUpload, canDownload, action, canMultiple, limit, isAutoUpload, headers, data, name, accept, showFileList } = props
    /** props end */
    /** data start */
    const state = reactive({
      isPreview: false,
      fileList: []
    })
    const uploadRef = ref()
    /** data end */

    /** computed start */
    const previewList = computed(() => {
      return props.fileList.map(item => item.url)
    })

    const previewFile = computed(() => {
      return props.file
    })
    /** computed end */

    /** method start */
    const showPreviewBox = () => {
      state.isPreview = true;
    }

    const closePreviewBox = () => {
      state.isPreview = false
    }

    const download = () => {
      const { name, type, url, fullname } = previewFile.value
      downloadFile(name, type, url, fullname)
    }

    const beforeUploadFile = (file: File) => {
      const { maxSize, accept } = props
      const acceptList = accept ? accept.split(',').map((item: any) => item.trim().slice(1)) : []

      const { name, size } = file
      const extArr = name.split('.')
      const ext = extArr[extArr.length - 1]
      const isValidSize = maxSize ? (size / 1024 / 1024) <= maxSize : true
      const isValidType = acceptList.length > 0 ? acceptList.some((item: any) => ext.endsWith(item)) : true

      if (!isValidSize) {
        ElMessage.error('文件大小超出上传限制!')
      }

      if (!isValidType) {
        ElMessage.error('文件类型不受支持!')
      }

      return isValidSize && isValidType
    }

    const onSuccessFile = (response: any, file: File, fileList: File[]) => {
      emit('on-success', { response, file, fileList })
      uploadRef.value.clearFiles()
    }

    const onErrorFile = (err: Error, file: File, fileList: File[]) => {
      emit('on-error', { err, file, fileList })
    }
    /** method end */

    return {
      ...toRefs(state),
      fit,
      file,
      fileList,
      previewFile,
      previewList,
      canReview,
      canUpload,
      canDownload,
      action,
      canMultiple,
      limit,
      isAutoUpload,
      headers,
      data,
      name,
      accept,
      showFileList,
      uploadRef,
      download,
      showPreviewBox,
      closePreviewBox,
      beforeUploadFile,
      onSuccessFile,
      onErrorFile
    }
  },
})
</script>
<style lang="stylus" scoped>
.view-container {
  width: 100%;
  height: 100%;
  position: relative;
  .image {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    &-slot {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #ccc;
      border-radius: 4px;
      :deep(.el-icon-picture-outline) {
        font-size: 200px;
      }
    }
  }
  .btn-groups {
    position: absolute;
    left: 0;
    bottom: 0;
    display: none;
    justify-content: space-around;
    width: 100%;
    :deep(button) {
      color: #fff;
    }
  }

  &:hover {
    .btn-groups {
      height: 38px;
      background-color: rgba(0, 0, 0, .5);
      display: flex;
      justify-content: space-around;
    }
  }
}
</style>
