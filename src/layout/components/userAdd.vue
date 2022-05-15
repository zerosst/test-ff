<template>
  <div v-loading="loading">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="120px">
      <el-form-item label="企业名称" prop="financeName">
        <el-input v-model.trim="form.financeName" placeholder="请输入企业名称"></el-input>
      </el-form-item>
      <el-form-item label="统一社会信用代码" prop="financeBranchCode">
        <el-input v-model.trim="form.financeBranchCode" placeholder="请输入统一社会信用代码"></el-input>
      </el-form-item>
      <el-form-item label="用户姓名" prop="personName">
        <el-input v-model.trim="form.personName" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="证件类型" prop="idType">
        <el-select style="width: 100%" v-model="form.idType" placeholder="请选择证件类型">
          <el-option v-for="dict in dictDatas['IDCARD_TYPERQ']" :key="dict.itemCode" :label="dict.itemValue"
            :value="dict.itemCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证件号码" prop="idCode">
        <el-input v-model.trim="form.idCode" placeholder="请输入证件号码"></el-input>
      </el-form-item>
      <el-row class="btn-container" justify="center">
        <el-button size="small" type="primary" @click="submitForm()">确认</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script lang="ts">
import Service from '../api'
import { useStore } from '@/store'
import { validator } from '@/utils/validator'

export default defineComponent({
  name: 'Edits',
  emits: ['success'],
  setup(props, { emit }) {
    const rules = {
      financeName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
      financeBranchCode: [{ required: true, message: '请输入统一社会信用代码', trigger: 'blur' }],
      personName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
      idType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
      idCode: [
        { required: true, message: '请输入证件号码', trigger: 'blur' },
        { pattern: validator.cardNo, message: '请填写正确的证件号码' }
      ]
    }
    const formRef = ref()
    const state = reactive({
      form: {
        financeName: '',
        financeBranchCode: '',
        personName: '',
        idType: '',
        idCode: ''
      },
      loading: false
    })
    const store = useStore()
    const dictDatas = computed(() => store.getters['dictModule/getDict'])
    onMounted(() => {
      store.dispatch('dictModule/getDicData', ['IDCARD_TYPERQ'])
    })
    /**
     * @description 此处通过接口进行异步修改路由对象；校验通过即进行提交
     */
    const submitForm = () => {
      formRef.value.validate((valid: any): boolean => {
        if (valid) {
          Service.userAdd({ ...state.form }).then((res) => {
            if (res) {
              ElMessage.success('设置成功')
              store.dispatch('permissionModule/getPermissonRoutes')
              // store.dispatch('permissionModule/getRoutes')
              emit('success')
            } else {
              ElMessage.error('设置失败')
            }
          })
          return true
        }
        return false
      })
    }
    return {
      ...toRefs(state),
      formRef,
      rules,
      submitForm,
      dictDatas
    }
  }
})
</script>
<style lang="stylus" scoped></style>
