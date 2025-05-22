// src/store/userStore.ts
import { create } from "zustand";
import { User } from "../api/types/user";
import { UserService } from "../api/services/userService";

type UserState = {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null }),

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const user = await UserService.getCurrentUser();
      set({ user });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
