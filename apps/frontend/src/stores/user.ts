import { defineStore } from "pinia";
import type { UserInfo } from "@miany-soul/shared";
import { setAccessToken } from "@/utils/auth-token";
import { http } from "@/utils/request";

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
      setAccessToken(token);
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
      setAccessToken(data.accessToken);
    },

    logout() {
      this.token = null;
      this.refreshToken = null;
      this.userInfo = null;
      setAccessToken(null);
    },

    updateUserInfo(userInfo: Partial<UserInfo>) {
      if (this.userInfo) {
        this.userInfo = { ...this.userInfo, ...userInfo };
      }
    },

    async changePassword(oldPassword: string, newPassword: string): Promise<void> {
      await http.put("/auth/change-password", { oldPassword, newPassword });
    },

    async updateProfile(data: {
      username?: string;
      email?: string;
      avatar?: string;
    }): Promise<UserInfo> {
      const result = await http.put<UserInfo>("/auth/me", data);
      if (this.userInfo) {
        this.userInfo = { ...this.userInfo, ...result };
      }
      // 手动更新 localStorage，确保刷新后头像不丢失
      try {
        localStorage.setItem(
          "user-store",
          JSON.stringify({
            token: this.token,
            refreshToken: this.refreshToken,
            userInfo: this.userInfo,
          })
        );
      } catch (e) {
        // ignore
      }
      return result;
    },
  },

  persist: {
    key: "user-store",
    paths: ["token", "refreshToken", "userInfo"],
  },
});
