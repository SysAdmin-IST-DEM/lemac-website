import { createApp } from 'vue';
import App from './App.vue';
import Notifications from './plugins/notifications';
import router from './plugins/router';
import store from './plugins/store';
import vuetify from './plugins/vuetify';
import 'vue-cal/style'
import './plugins/notifications';
import './assets/tailwind.css';
import { useLoadingStore } from '@/stores/loading';

const app = createApp(App);

app.use(Notifications);
app.use(router);
app.use(store);
app.use(vuetify);

const loadingStore = useLoadingStore();
app.config.globalProperties.$loading = {
  show: function () {
    loadingStore.showLoadingBar();
  },
  hide: function () {
    loadingStore.hideLoadingBar();
  },
};

app.mount('#app');
