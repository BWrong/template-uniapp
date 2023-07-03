<template>
  <div>{{ title }}</div>
  <slot></slot>
  <slot name="test"></slot>
  <AForm :rules="rules" :model="formData" ref="formRef">
    <AFormItem name="name" label="名称">
      <AInput v-model:value="formData.name" />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import type { DialogExpose } from '@/composables/useDialog';
import type { FormInstance, FormProps } from 'ant-design-vue';

const { title = '' } = defineProps<{
  title?: string;
}>();
const formData = reactive({
  name: ''
});
const rules: FormProps['rules'] = {
  name: [
    {
      required: true,
      message: '请输入名称'
    }
  ]
};
const formRef = ref<FormInstance>();
defineExpose<DialogExpose>({
  async submit() {
    return formRef.value?.validate().then(() => Promise.resolve(formData));
  }
});
defineEmits(['cancel', 'confirm']);
</script>

<style scoped></style>
