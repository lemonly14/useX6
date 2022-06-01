<!--  -->
<template>
  <div ref="select-node">
    <a-modal
      title="请选择需要关联的节点"
      :visible="visible"
      @ok="handleOk(selectNode)"
      @cancel="handleCancel"
      :after-close="handleCancel"
    >
      <a-radio-group v-model:value="selectNode">
        <a-radio :value="option.id" v-for="option in props.options" :key="option.id">{{ flowType[option.type as keyof typeof flowType] }}{{ option.id }}</a-radio>
      </a-radio-group>
    </a-modal>
  </div>
</template>

<script lang='ts' setup>
import { ref, defineProps, PropType } from 'vue'
const props = defineProps({
  options: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  relateId: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['onRelate'])
enum flowType{
  'startTask' = '开始',
  'userTask' = '用户任务',
  'pipelineTask' = '设置任务',
  'endTask' = '结束',
  'exclusiveGateway' = '互斥网关',
  'conditionGateway' = '条件网关',
  'aggregateGateway' = '汇聚网关',
}
const visible = ref(false)
const selectNode = ref<string>('')

const handleOk = (value:any) => {
  emit('onRelate', value, props.relateId)
  visible.value = false
}
const handleCancel = () => {
  visible.value = false
  selectNode.value = ''
}
const showModal = () => {
  visible.value = true
}

defineExpose({
  showModal
})

</script>
<style lang='scss' scoped>
.select-node{
  width: 200px;
  height: 100px;
  background: #fff;
}
</style>
