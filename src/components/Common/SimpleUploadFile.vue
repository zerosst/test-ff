<template>
  <el-upload ref="uploadRef" class="upload-container" :drag="canDrag" :action="action" :multiple="canMultiple"
    :limit="limit" :before-upload="beforeUploadFile" :auto-upload="isAutoUpload" :headers="headers" :data="data"
    :name="name" :accept="accept" :on-success="onSuccessFile" :on-error="onErrorFile" :show-file-list="showFileList">
    <i class="ic ic-add el-upload__icon"></i>
    <div class="el-upload__text">{{ title }}</div>
    <template v-if="tip" #tip>
      <div class="el-upload__tip">{{ tip }}</div>
    </template>
  </el-upload>
</template>
<script lang="ts">

export default defineComponent({
  name: 'SimpleUploadFile',
  props: {
    action: { type: String, default: '#' },
    title: { type: String, default: '' },
    tip: { type: String, default: '' },
    canDrag: { type: Boolean, default: true },
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

    /** data start */
    const { action, title, tip, canDrag, canMultiple, limit, isAutoUpload, headers, data, name, accept, showFileList } = props;
    const uploadRef = ref()
    /** data end */

    /** method start */
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
      action,
      title,
      tip,
      canDrag,
      canMultiple,
      limit,
      isAutoUpload,
      headers,
      data,
      name,
      accept,
      showFileList,
      beforeUploadFile,
      uploadRef,
      onSuccessFile,
      onErrorFile
    }
  }
})
</script>
<style lang="stylus" scoped>
.upload-container {
  width: 100%;
  height: 100%;
  :deep(.el-upload) {
    width: 100%;
    height: 100%;
  }
  :deep(.el-upload-dragger) {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
  }
}

.el-upload__icon, .el-upload__text {
  display: flex;
  justify-content: center;
  flex-basis: 100%;
}

.el-upload__icon {
  align-items: flex-end;
  font-size: 40px;
  font-weight: bold;
}

.el-upload__text {
  align-items: flex-start;
  font-size: 20px;
}
</style>
