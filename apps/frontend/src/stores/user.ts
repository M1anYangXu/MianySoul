import { defineStore } from "pinia";
import type { UserInfo } from "@miany-soul/shared";

interface UserState {
  token: string | null;
  refreshToken: string | null;
  userInfo: UserInfo | null;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    token: null,
    refreshToken: null,
    userInfo: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token && !!state.userInfo,
    isAdmin: (state) => state.userInfo?.role === "admin",
  },

  actions: {
    setToken(token: string, refreshToken?: string) {
      this.token = token;
      if (refreshToken) {
        this.refreshToken = refreshToken;
      }
    },

    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
    },

    login(data: { accessToken: string; refreshToken: string; user: UserInfo }) {
      this.token = data.accessToken;
      this.refreshToken = data.refreshToken;
      this.userInfo = data.user;
    },

    logout() {
      this.token = null;
      this.refreshToken = null;
      this.userInfo = null;
    },

    updateUserInfo(userInfo: Partial<UserInfo>) {
      if (this.userInfo) {
        this.userInfo = { ...this.userInfo, ...userInfo };
      }
    },
  },

  persist: {
    key: "user-store",
    paths: ["token", "refreshToken", "userInfo"],
  },
});
