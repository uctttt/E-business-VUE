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

Vue.filter('dateFormat', function(date) {
    const inputDate = new Date(date);
    const year = (inputDate.getFullYear());
    const month = (inputDate.getMonth() + 1 + '').padStart(2, '0');
    const day = (inputDate.getDate() + '').padStart(2, '0');

    const hour = (inputDate.getHours() + '').padStart(2, '0');
    const min = (inputDate.getMinutes() + '').padStart(2, '0');

    return `${year}/${month}/${day} ${hour}:${min}`;
})