import { defineStore } from 'pinia';

import type { MenuTheme } from 'ant-design-vue';

import config from '@/config';
import { getStorage, setStorage } from '@bwrong/storage';

interface IUserInfo {
  username: string;
}
export const useRootStore = defineStore('root', {
  state: () => ({
    theme: config.theme,
    userinfo: {} as IUserInfo
  }),
  getters: {
    userinfoGetter(state) {
      if (state.userinfo) return state.userinfo;
      const userInfo = getStorage<IUserInfo>('userinfo') || ({} as IUserInfo);
      state.userinfo = userInfo;
      return userInfo;
    }
  },
  actions: {
    setTheme(theme: MenuTheme) {
      this.theme = theme;
    },
    // 更新用户信息
    setUserinfo(data: IUserInfo) {
      this.userinfo = data;
      setStorage('userinfo', data);
    },
    getUserinfo() {
      const userInfo = getStorage<IUserInfo>('userinfo') || ({} as IUserInfo);
      this.setUserinfo(userInfo);
    }
  }
});
