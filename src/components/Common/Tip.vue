<template>
  <div class="tip-container">
    <el-row>
      <el-col :span="24" class="title">{{ title }}</el-col>
      <el-col :span="24">
        <ul>
          <li v-for="(item, index) in data" :key="index">
            <span v-if="isShowNO">{{ index + 1 }}、</span>
            {{ item }}
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
export default defineComponent({
  name: 'Tip',
  props: {
    title: {
      type: String, default: ''
    },
    isShowNO: {
      type: Boolean, default: true,
    },
    data: {
      type: Array, default: () => ([])
    }
  },
  setup(props) {
    const { title, isShowNO, data } = props
    return {
      title,
      isShowNO,
      data
    }
  }
})
</script>
<style lang="stylus" scoped>
.tip-container {
  width: 100%;
  height: auto;
  background-color: #DBECF4;
  box-sizing: border-box;
  padding: 10px 20px;
  border-radius: 4px;
  .title {
    color: #0079FE;
    text-align: left;
  }
}


li {
  margin: 10px auto;
  list-style: none;
  display: flex;
  color: #867b7b;
  span {
    display: flex;
  }
}
</style>
