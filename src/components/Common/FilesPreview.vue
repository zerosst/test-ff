<template>
  <el-dialog v-model="visible" :width="width" :title="title" @close="handleCloseClick">
    <el-row>
      <el-col :span="3">
        <div v-for="(file, index) in files" :key="index" class="title" :class="{ active: index === activeIndex }"
          @click="handleClickFileTitle(index)">
          {{ file.title }}
        </div>
      </el-col>
      <el-col :span="20" :push="1">
        <iframe :src="activeUrl" width="100%" height="800px"></iframe>
      </el-col>
      <el-col v-if="isShowCloseButton" :span="24" class="text-right m-horizontal-10">
        <el-button @click="handleCloseClick">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script lang="ts">

interface fileType {
  title: string
  url: string
}

export default defineComponent({
  name: 'FilesPreview',
  props: {
    url: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '900px'
    },
    title: {
      type: String,
      default: '文件预览'
    },
    isShowCloseButton: {
      type: Boolean,
      default: true
    },
    files: {
      type: Array as PropType<fileType[]>,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const { url, width, title, isShowCloseButton, files } = props

    const state = reactive({
      visible: true,
      activeIndex: 0,
      activeUrl: ''
    })

    const handleCloseClick = () => {
      emit('close')
    }

    const handleClickFileTitle = (index: number) => {
      state.activeIndex = index
      state.activeUrl = props.files[index].url
    }

    handleClickFileTitle(0)

    return {
      ...toRefs(state),
      url,
      width,
      title,
      isShowCloseButton,
      files,
      handleCloseClick,
      handleClickFileTitle
    }
  }
})
</script>
<style lang="stylus" scoped>
.title
  margin 5px auto
  cursor pointer
.active
  padding 5px
  background-color #0788c4
  color #fff
  border-radius 4px
</style>
