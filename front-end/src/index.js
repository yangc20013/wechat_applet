import "minireset.css";
import axios from "axios";
import ElementUI from "element-ui";
import Vue from "vue";
import 'element-ui/lib/theme-default/index.css'
import Index from "./components/index.vue";
import router from "./routes/router";
import store from "./store/vuex-store";
import "./assets/css/admin.scss";
import func from "./utils/func";
import api from "./utils/api";

Vue.use(ElementUI);
Vue.prototype.$http = axios;
Vue.prototype.api = api;
Vue.prototype.func = func;

let vm = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(Index),
});

