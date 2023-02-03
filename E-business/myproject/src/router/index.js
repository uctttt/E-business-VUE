import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import '../assets/CSS/global.css';
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Right from '../components/power/Right.vue'
import Role from '../components/power/Role.vue'
import Cate from '../components/goods/Cate.vue'
import Order from '../components/orders/Order.vue'
import Params from '../components/goods/Params.vue'
import List from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: 'login',
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
        redirect: '/welcome',
        children: [
            { path: '/welcome', name: 'welcome', component: Welcome },
            { path: '/users', name: 'user', component: User },
            { path: '/rights', name: 'right', component: Right },
            { path: '/roles', name: 'role', component: Role },
            { path: '/categories', name: 'cate', component: Cate },
            { path: '/params', name: 'params', component: Params },
            { path: '/orders', name: 'orders', component: Order },
            { path: '/goods', name: 'list', component: List },
            { path: '/goods/add', name: 'add', component: Add },
        ]
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    // }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        var token = window.sessionStorage.getItem('token')
        if (token) {
            return next('/home')
        }
        return next()
    }

    var token = window.sessionStorage.getItem('token')
    if (!token) {
        return next('/login')
    }
    return next()
})

export default router