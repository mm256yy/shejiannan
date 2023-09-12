import Vue from 'vue';
import App from './App';
import uView from "uview-ui";
import { diaplayTime } from 'static/utils/utils.js'; 
import dayjs from 'dayjs'
Vue.prototype.dayjs = dayjs;
Vue.use(uView);
Vue.config.productionTip = false;
Vue.prototype.diaplayTime = diaplayTime;

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
