<template>
  <div class="container">
    <el-row>
      <el-col :span="24" class="top">
        <el-row>
          <el-col :span="24">
            <slot name="breadCrumb" />
          </el-col>
          <el-col :span="20">
            <slot name="title" />
          </el-col>
          <el-col :span="4">
            <slot name="topExtra" />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="24">
        <el-row class="main">
          <el-col :span="24">
            <slot name="tab" />
          </el-col>
          <el-col :span="24">
            <slot name="content" />
            <slot name="dialog" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">

export default defineComponent({
  name: 'Container',
  setup() {
    return {}
  }
})
</script>
<style lang="stylus" scoped>
.container {
  width: 100%;
  min-height: calc(100vh - 80px);
  background-color: #F0F2F5;
}

.top {
  background-color: #fff;
  min-height 60px;
  margin: 10px auto;
}

.main {
  background-color: #fff;
  margin: 10px;
  border-radius: 4px;
  padding: 10px;
}

</style>
