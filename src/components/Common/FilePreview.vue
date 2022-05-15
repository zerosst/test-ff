<template>
  <el-dialog v-model="visible" :width="width" :title="title" @close="handleCloseClick">
    <el-row>
      <el-col :span="24">
        <iframe :src="url" width="100%" height="800px"></iframe>
      </el-col>
      <el-col v-if="isShowCloseButton" :span="24" class="text-right m-horizontal-10">
        <el-button @click="handleCloseClick">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script lang="ts">

export default defineComponent({
  name: 'FilePreview',
  props: {
    url: {
      type: String, default: ''
    },
    width: {
      type: String, default: '800px'
    },
    title: {
      type: String, default: '文件预览'
    },
    isShowCloseButton: {
      type: Boolean, default: true
    }
  },
  setup(props, { emit }) {
    const { url, width, title, isShowCloseButton } = props

    const state = reactive({
      visible: true
    })

    const handleCloseClick = () => {
      emit('close')
    }

    return {
      ...toRefs(state),
      url,
      width,
      title,
      isShowCloseButton,
      handleCloseClick
    }
  }
})
</script>
