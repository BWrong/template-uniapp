<script setup lang="ts">
import type { ModalProps } from 'ant-design-vue';
import type { Component, Slot } from 'vue';
export interface IProps extends Omit<ModalProps, 'open' | 'visible' | 'onCancel'> {
  title?: string | Slot;
  footer?: boolean;
  component?: Component;
  visible?: boolean | Ref<boolean>;
}
const props = withDefaults(defineProps<IProps>(), {
  title: '标题',
  footer: undefined,
  component: undefined,
  visible: false
});
/* eslint-disable @typescript-eslint/no-explicit-any */
const componentRef = ref<any>();
const emit = defineEmits(['cancel', 'confirm']);
const localProps = computed(() => {
  return {
    ...props,
    visible: unref(props.visible)
  };
});
function handleCancel() {
  emit('cancel');
}
function handleConfirm() {
  const submit: () => Promise<any> = componentRef.value?.submit || (() => Promise.resolve(true));
  submit().then((data) => emit('confirm', data));
}
</script>

<template>
  <AModal v-bind="localProps" @cancel="handleCancel">
    <template #title>
      <slot name="title">{{ title }} </slot>
    </template>
    <template #default>
      <slot>
        <component :is="component" ref="componentRef" @confirm="handleConfirm" @cancel="handleCancel"></component>
      </slot>
    </template>
    <template #footer>
      <slot name="footer">
        <div class="modal-footer">
          <a-button @click="handleCancel">取消</a-button>
          <a-button type="primary" @click="handleConfirm">确认</a-button>
        </div>
      </slot>
    </template>
  </AModal>
</template>
<style scoped>
.modal-footer {
  display: flex;
  justify-content: center;
}
</style>
