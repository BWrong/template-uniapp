<template>
  <div class="page-wrap">
    <ACard title="首页">
      <h3>请求取消</h3>
      <div>
        <ASpace>
          <AButton @click="handleRun">自动取消重复请求（快速点击测试）</AButton>
          <AButton @click="handleCancelAllRequest">取消全部请求</AButton>
        </ASpace>
      </div>
      <h3>文件下载</h3>
      <div>
        <AButton @click="handleDownloadFile">文件下载</AButton>
        <p>文件大小：{{ bytesToSize(progress.total) }}</p>
        <p>已下载：{{ bytesToSize(progress.loaded) }}</p>
        <p>
          进度：
          <AProgress style="width: 400px" :percent="progress.progress" />
        </p>
      </div>
      <h3>vueRequest</h3>
      <p><a href="https://next.cn.attojs.org/" target="_blank" rel="noopener noreferrer">vueRequest</a>测试</p>
      <AButton :loading="loading" @click="handleRun">请求 </AButton>
      <p>测试结果</p>
      <p>data:{{ data }}</p>
      <p>err:{{ error }}</p>
      <h3>表格</h3>
      <p>组件位置：/src/components/BasisTable</p>
      <BasisTable show-index :columns="columns" :loading="loading" :data-source="data" :pagination="pagination">
        <template #bodyCell="{ column, record }">
          <ASpace v-if="column.dataIndex === 'action'" class="table-action">
            <span class="text-primary"><IconFont type="icon-edit" /></span>
            <DeleteButton :title="record.title" @confirm="handleDelete">
              <IconFont type="icon-delete" style="color: red"></IconFont>
            </DeleteButton>
          </ASpace>
          <ASpace v-if="column.dataIndex === 'icon'">
            <IconFont :type="record.icon"></IconFont>
          </ASpace>
          <ASpace v-if="column.dataIndex === 'type'">
            {{ record.type === 0 ? '菜单' : '操作' }}
          </ASpace>
        </template>
      </BasisTable>
      <h3>图标</h3>
      <p>组件位置：/src/components/IconFont</p>
      使用<a href="https://www.iconfont.cn/" class="text-link" target="_blank">iconfont</a>图标，请将<span
        class="text-primary"
        >ENV</span
      >文件中的<span class="text-primary">VITE_ICONFONT_URL</span
      >变量设置为自己iconfont项目对应的地址。当然，如果你不喜欢这种使用方式，可以试试
      <a href="https://unocss.dev/presets/icons" target="_blank" rel="noopener noreferrer">unocss Icons</a>或者其他方式
      <p class="text-6 text-primary">
        <IconFont type="icon-pic-right" :style="{ color: 'blue' }" />
        <IconFont type="icon-CodeSandbox" />
      </p>
      <h3>图标选择器</h3>
      <p>组件位置：/src/components/IconPicker</p>
      <a-input v-model:value="iconSelect" readonly style="width: 200px">
        <template #addonAfter>
          <a-popover placement="right" :auto-adjust-overflow="false" title="选择图标">
            <template #content>
              <div class="icon-picker-wrap">
                <IconPicker v-model:value="iconSelect" />
              </div>
            </template>
            <icon-font v-if="iconSelect" :type="iconSelect" />
            <span v-else>选择</span>
          </a-popover>
        </template>
      </a-input>
      <h3>操作确认按钮</h3>
      <p>组件位置：/src/components/ConfirmButton</p>
      <ConfirmButton @confirm="handleDelete"></ConfirmButton>
      <h3>删除按钮</h3>
      <p>组件位置：/src/components/ConfirmButton/DeleteButton</p>
      <ASpace>
        <DeleteButton @confirm="handleDelete"></DeleteButton>
        <DeleteButton @confirm="handleDelete" action-title="删除项一"></DeleteButton>
      </ASpace>
      <h3>模态框函数式调用</h3>
      <p>组件位置：/src/composables/useDialog</p>
      <ASpace>
        <AButton @click="handleOpenModal">打开（默认）</AButton>
        <AButton @click="handleOpenModal1">打开（手动）</AButton>
        <AButton @click="handleOpenModal2">打开（带插槽）</AButton>
      </ASpace>
      <h3>UnoCss</h3>
      <p>
        默认可以使用<a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer">tailwindcss</a
        >语法,建议安装对应编辑器插件<a
          href="https://marketplace.visualstudio.com/items?itemName=antfu.unocss"
          target="_blank"
          rel="noopener noreferrer"
          >unocss</a
        >以获得更好的体验。
      </p>
      <p>
        默认所有单位使用rem，如果需要使用px，可以安装<a href="https://unocss.dev/presets/rem-to-px">rem-to-px插件</a>
      </p>
      <div
        class="m-1 inline-block h-30 max-w-lg bg-primary p-5 text-center text-white duration-1000 hover:(rounded-10 bg-green text-red)"
      >
        这是使用unocss默认预设写出的样式，class如下：
        <div>
          m-1 inline-block h-30 max-w-lg bg-primary p-5 text-center text-white duration-1000 hover:(rounded-10 bg-green
          text-red)
        </div>
      </div>
      <h3>颜色</h3>
      <p class="text-primary">主色</p>
      <p class="text-success">成功</p>
      <p class="text-warning">警告</p>
      <p class="text-error">错误</p>
      <h3>字体</h3>
      <p class="text-mini">辅助文本 12px</p>
      <p class="text-default">内容文本 14px</p>
      <p class="text-medium">标题文本 16px</p>
      <p class="text-large">大标题文本 18px</p>
      <p class="text-xlarge">大标题文本 20px</p>
    </ACard>
  </div>
</template>
<script lang="tsx" setup>
import { reactive } from 'vue';
import type { ColumnProps } from 'ant-design-vue/es/table';
import type { AxiosProgressEvent } from 'axios';
import { downloadRequest } from '@/api/file';
import { getMenusRequest } from '@/api/auth';
import { bytesToSize } from '@/utils';
import request from '@/utils/request';
import { message } from 'ant-design-vue';
import TestModal from '@/components/TestModal.vue';
const columns: ColumnProps[] = [
  {
    title: '名称',
    dataIndex: 'title'
  },
  {
    title: '图标',
    dataIndex: 'icon'
  },
  {
    title: '权限码',
    dataIndex: 'permission'
  },
  {
    title: '地址',
    dataIndex: 'url'
  },
  {
    title: '类型',
    dataIndex: 'type'
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'action'
  }
];
const { loading, data, error, run, pagination, params } = usePaginationList(getMenusRequest, {
  manual: true,
  defaultParams: [
    {
      pageSize: 1
    }
  ]
});
function handleRun() {
  run(params.value?.[0]);
}

function handleCancelAllRequest() {
  request.cancelAllRequest();
}
const progress = reactive<Partial<AxiosProgressEvent>>({
  total: 0,
  loaded: 0,
  progress: 0
});
function handleDownloadFile() {
  downloadRequest('文件下载测试', {}, progress);
}
function handleDelete() {
  message.success('删除成功');
}
function handleOpenModal() {
  // 这里需要手动添加一下泛型，就可推断onConfirm中参数的类型
  useDialog<typeof TestModal>({
    width: '500px',
    component: <TestModal title="测试模态窗" />,
    // ...支持AModal的所有配置
    onConfirm(data) {
      // 可以拿到内部数据，在表单类弹窗中很有用
      console.log('拿到组件内部数据：', data);
    }
  });
}
function handleOpenModal1() {
  const { open, close } = useDialog<typeof TestModal>({
    width: '500px',
    component: <TestModal title="测试模态窗" />,
    defaultOpen: false,
    onConfirm(data) {
      console.log('拿到组件内部数据：', data);
    }
  });
  open();
  setTimeout(() => {
    close();
  }, 3000);
}
function handleOpenModal2() {
  useDialog<typeof TestModal>({
    width: '500px',
    component: (
      <TestModal title="测试模态窗">
        {{
          default: () => <div>默认插槽</div>,
          test: () => <div>test插槽</div>
        }}
      </TestModal>
    ),
    onConfirm(data) {
      console.log('拿到组件内部数据：', data);
    }
  });
}
const iconSelect = ref<Iconfont | undefined>();
</script>
<style scoped lang="scss">
h3 {
  margin: 20px 0;
}
</style>
