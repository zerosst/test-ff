<template>
  <el-pagination background :current-page="pageNum" :page-size="pageSize" :layout="layout" :page-sizes="pageSizes"
    :total="total" @size-change="onSizeChange" @current-change="onCurrentChange" />
</template>

<script lang="ts">
interface dataTypes {
  pageSize: Number
  pageNum: Number
}
export default defineComponent({
  name: 'Pagination',
  props: {
    current: {
      type: Number,
      default: 1
    },
    size: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 1
    },
    pageSizes: {
      type: Array,
      default: [10, 20, 30, 50]
    },
    layout: {
      type: String,
      default: 'sizes,prev,pager,next,total'
    }
  },
  emits: ['pagination'],
  setup(props, { emit }) {
    const data = reactive<dataTypes>({
      pageNum: props.current,
      pageSize: props.size
    })
    const onSizeChange = (val: Number) => {
      data.pageSize = val
      emit('pagination', { current: data.pageNum, size: val })
    }
    const onCurrentChange = (val: Number) => {
      data.pageNum = val
      emit('pagination', { current: val, size: data.pageSize })
    }
    const rest = (current = 1, size = 10) => {
      data.pageNum = current
      data.pageSize = size
      // emit('pagination', { current, size })
    }
    return {
      ...toRefs(data),
      onSizeChange,
      onCurrentChange,
      rest
    }
  }
})
</script>

<style scoped>
.pagination-container {
  background: #fff;
}

.pagination-container.hidden {
  display: none;
}
</style>
