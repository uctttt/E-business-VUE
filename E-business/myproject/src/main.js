import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/CSS/global.css';
import axios from 'axios'
import ZKTable from 'vue-table-with-tree-grid';

Vue.component('treeTable', ZKTable);
axios.defaults.headers.common['Authorization'] = window.sessionStorage.getItem('token')
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')