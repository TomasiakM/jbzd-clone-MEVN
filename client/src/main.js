import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const options = {
  position: "top-right",
  timeout: 2500,
  closeOnClick: true,
  containerClassName: "custom-toast-container",
  toastClassName: "custom-toast",
};

createApp(App)
  .use(store)
  .use(router)
  .use(Toast, options)
  .mount("#app");
