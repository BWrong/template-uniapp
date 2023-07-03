/* eslint-disable @typescript-eslint/no-explicit-any */
import Dialog, { type IProps } from '@/components/Dialog/index.vue';
import type { Component } from 'vue';

interface ICreateOptions<T, K> extends Omit<IProps, 'component'> {
  onConfirm?: (data: T) => void;
  onClosed?: () => void;
  onCancel?: () => void;
  defaultOpen?: boolean;
  component: Component;
  componentProps?: K;
}
// @ts-ignore
export default <T = Element, U = Awaited<ReturnType<InstanceType<T>['submit']>>, K = InstanceType<T>['$props']>(
  options?: ICreateOptions<U, K>
) => {
  const wrapper = document.createElement('div');
  document.body.appendChild(wrapper);
  const openValue = ref(options?.defaultOpen ?? true);
  const instance = createApp(Dialog, {
    ...options,
    visible: openValue,
    onConfirm(data: any) {
      options?.onConfirm?.(data);
      openValue.value = false;
    },
    onCancel() {
      options?.onCancel?.();
      openValue.value = false;
    },
    afterClose() {
      options?.onClosed?.();
      unmount();
    }
  });
  function unmount() {
    openValue.value = false;
    document.body.removeChild(wrapper);
    instance?.unmount();
  }
  options?.defaultOpen !== false && open();
  function open() {
    openValue.value = true;
    instance.mount(wrapper);
  }
  function close() {
    openValue.value = false;
  }
  return {
    open,
    close
  };
};

export interface DialogExpose<T = any> {
  submit?(): Promise<T>;
}
