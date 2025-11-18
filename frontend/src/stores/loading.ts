import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    loadingBar: false,
  }),
  getters: {
    isLoading: (state) => state.loadingBar,
  },
  actions: {
    showLoadingBar() {
      this.loadingBar = true;
    },
    hideLoadingBar() {
      this.loadingBar = false;
    },
  }
});