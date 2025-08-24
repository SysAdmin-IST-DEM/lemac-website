import { createApp } from 'vue';
import App from './App.vue';
import Notifications from './plugins/notifications';
import router from './plugins/router';
import store from './plugins/store';
import vuetify from './plugins/vuetify';
import 'vue-cal/style'
import './plugins/notifications';
import './assets/tailwind.css';
import moment from 'moment'

const app = createApp(App);

// TODO: Vue.config.productionTip = false;

app.config.globalProperties.$loading = {
  show: function () {
    store.dispatch('showLoadingBar');
  },
  hide: function () {
    store.dispatch('hideLoadingBar');
  },
};
app.config.globalProperties.$moment = moment;

app.use(Notifications);
app.use(router);
app.use(store);
app.use(vuetify);

app.mount('#app');
