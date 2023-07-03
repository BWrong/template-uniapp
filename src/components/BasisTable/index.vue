<template>
  <div class="basic-table">
    <a-table v-bind="props" bordered size="small" :row-key="rowKey" :columns="computedColumns" :pagination="pagination">
      <template v-for="(item, key) in slots" #[key]="data">
        <slot :name="key" v-bind="data"></slot>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts">
export default {
  name: 'BasisTable',
  inheritAttrs: false
};
</script>
<script lang="ts" setup>
import { computed, useSlots } from 'vue';

import type { ColumnGroupType, ColumnProps, ColumnType, TableProps } from 'ant-design-vue/es/table';

interface IPage {
  current?: number;
  pageSize?: number;
}

interface IProps extends TableProps {
  rowKey?: string;
  showIndex?: boolean;
  columns: ColumnProps[];
  pagination?: IPage | false;
}
const slots = useSlots();
const props = withDefaults(defineProps<IProps>(), {
  rowKey: 'id',
  showIndex: false,
  pagination: false
});
function ganerTableIndex(current = 1, pageSize = 10, index = 0) {
  return (current - 1) * pageSize + index + 1;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const computedColumns = computed<(ColumnGroupType<any> | ColumnType<any>)[]>(() => {
  // 判断是否需要显示序号
  if (!props.showIndex) return props.columns;
  const pagination = props.pagination || {
    current: 1,
    pageSize: 0
  };
  const { current = 1, pageSize = 10 } = pagination as IPage;
  return [
    {
      title: '序号',
      width: 80,
      customRender: ({ index }: { index: number }) => ganerTableIndex(current, pageSize, index),
      align: 'center'
    },
    ...props.columns
  ];
});
</script>
