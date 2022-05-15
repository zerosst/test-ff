<template>
  <div>
    <el-table ref="table" v-loading="isLoading" border :data="data" :highlight-row="isHighlightRow"
      @selection-change="handleSelectionChange">
      <slot name="custom"></slot>
      <template v-if="isSingleSelect">
        <el-table-column width="75" align="center" label="单选">
          <template #default="{ row }">
            <input type="radio" :checked="data[row._index]._checked" @click="() => handleSingleChange(row)" />
          </template>
        </el-table-column>
      </template>
      <template v-if="isMultiSelect">
        <el-table-column type="selection" align="center" width="75" label="全选"></el-table-column>
      </template>
      <template v-if="isShowSN">
        <el-table-column type="index" width="80" align="center" label="序号" />
      </template>
      <template v-for="column in columns">
        <template v-if="column.key === 'actions'">
          <el-table-column :key="column.key" :align="column.align || 'center'" :width="column.width"
            :label="column.title" :fixed="column.fixed">
            <template #default="scope">
              <span v-for="action in column.actions" style="margin: 0 5px;">
                <el-button v-if="$AuthConsumer(action.title)" :key="action.type" type="text" size="small"
                  @click="handleClick(scope.row, action.type, action.title)">{{ action.title }}</el-button>
              </span>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <template v-if="column.type && column.type === 'slot'">
            <el-table-column :key="column.key" :align="column.align || 'center'" :width="column.width"
              :label="column.title" :fixed="column.fixed">
              <template #default="scope">
                <slot :name="column.key" :scope="scope"></slot>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column :key="column.key" :align="column.align || 'center'" :prop="column.key"
              :width="column.width" :label="column.title" :formatter="column.formatter" :show-overflow-tooltip="true"
              :fixed="column.fixed" />
          </template>
        </template>
      </template>
    </el-table>
    <el-row type="flex" justify="center" style="margin-top: 10px">
      <el-pagination v-if="isShowPagination" background :total="total" :page-sizes="pageSizeOptions"
        :current-page="pagination.current" :page-size="pagination.size" layout="total, prev, pager, next, sizes, jumper"
        @current-change="changePage" @size-change="changePageSize" />
    </el-row>
  </div>
</template>
<script lang="ts">
import { Method } from 'axios'
import { ObjectAnyType } from '@/utils/constant/type'
import request from '@/utils/request'

interface Action {
  type: string
  title: string
}

interface Column {
  key: string
  width: string
  align: string
  title: string
  actions: Action[]
  formatter: any
  type?: string
  fixed?: string
}

interface Pagination {
  current: number
  size: number
}

interface DataTypes {
  data: ObjectAnyType[]
  total: number
  isLoading: boolean
  isSelectAll: boolean
  pagination: Pagination
  singleSelectIndex: number
}

export default defineComponent({
  name: 'Table',
  props: {
    // 请求表格数据的url地址
    url: { type: String, required: true },
    // 默认分页数
    pageSize: { type: Number, default: 10 },
    // 是否展示序号
    isShowSN: { type: Boolean, default: false },
    // 表格的列的结构
    columns: { type: Array as PropType<Array<Column>>, required: true },
    // 请求表格数据的方法
    method: { type: String as PropType<Method>, default: 'post' },
    // 请求表格数据的参数
    params: { type: Object, default: () => ({}) },
    // 是否支持高亮选中
    isHighlightRow: { type: Boolean, default: false },
    // 是否显示分页
    isShowPagination: { type: Boolean, default: true },
    // 是否显示迷你分页
    isPaginationSizeSmall: { type: Boolean, default: false },
    // 是否开启多选
    isMultiSelect: { type: Boolean, default: false },
    // 是否开启单选
    isSingleSelect: { type: Boolean, default: false }
  },
  setup(props, { attrs, slots, emit }) {
    /** lifecycle start */
    onBeforeMount(() => {
      getTableData()
    })
    /** data start */
    const state = reactive<DataTypes>({
      // 表格的行
      data: [],
      // 分页总数
      total: 0,
      // 表格数据是否加载
      isLoading: false,
      // 是否全选
      isSelectAll: false,
      // 分页
      pagination: {
        current: 1,
        size: props.pageSize
      },
      // 单选选中的下标
      singleSelectIndex: -1
    })
    /** data end */

    /** computed start */
    const pageSizeOptions = computed(() => (props.isPaginationSizeSmall ? [10, 20, 30] : [10, 20, 30, 50, 100]))
    /** computed end  */

    /** method start */

    // 获取表格的数据
    const getTableData = () => {
      if (!props.url) {
        return
      }
      const { url, params, isShowPagination, method } = props
      const {
        pagination: { current, size }
      } = state
      state.isLoading = true
      state.isSelectAll = false
      const parameter = isShowPagination ? { current, size, ...params } : { ...params }
      request({
        url,
        method,
        [method === 'post' ? 'data' : 'params']: parameter,
        json: true
      })
        .then((res) => {
          const {
            data: { records = [], total, current, size }
          } = res || {}
          state.isLoading = false
          state.data = records.map((item: ObjectAnyType, index: number) => ({ _checked: false, _index: index, ...item }))
          if (props.isShowPagination) {
            state.total = total === null ? 0 : total
            state.pagination = {
              current,
              size
            }
          }
        })
        .catch((err) => {
          state.isLoading = false
          console.log(err)
        })
    }

    // 手动挡分页查询
    const query = (current = 1, size = 10) => {
      state.pagination = { current, size }
      getTableData()
    }

    // 改变分页
    const changePage = (page: number) => {
      state.pagination.current = page
      getTableData()
    }

    // 改变分页大小
    const changePageSize = (pageSize: number) => {
      state.pagination.size = pageSize
      getTableData()
    }

    // 操作栏点击事件
    const handleClick = (row: object, type: string, title: string) => {
      emit('click-action', row, type, title)
    }

    // 多选
    const handleSelectionChange = (rows: any[]) => {
      emit('on-selection-change', rows)
    }

    // 单选
    const handleSingleChange = (row: any) => {
      for (let i = 0; i < state.data.length; i++) {
        if (i === row._index) {
          state.data[i]._checked = true
        } else {
          state.data[i]._checked = false
        }
      }
      emit('on-single-change', row)
    }
    /** method end */

    /** lifecycle end */

    return {
      ...toRefs(state),
      pageSizeOptions,
      query,
      handleClick,
      changePage,
      changePageSize,
      handleSelectionChange,
      handleSingleChange
    }
  }
})
</script>
<style lang="stylus" scoped>
:deep(.el-table__header .el-table-column--selection .cell .el-checkbox:after){
  content: "全选";
  color: #909399;
  margin-left: 6px;
  font-weight: bold;
}
</style>
