import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

Vue.config.productionTip = false

Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 5,
  newestOnTop: true
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')