<template>
    <div class="homeContain">
        <el-container>
            <el-header>
                <div class="headerBox">
                    <img src="../assets/logo.png" alt="">
                    <div>电商后台管理系统</div>
                </div>
                <el-button @click="loginOut">退出</el-button>
            </el-header>
            <el-container>
                <el-aside :width="isCollapse ? '64px' : '200px'">
                    <div class="toggle-button" @click="toggleCollapse" :width="isCollapse ? '64px' : '200px'">|||</div>
                    <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
                        default-active="2" text-color="#fff" :collapse="isCollapse" :collapse-transition="false" router>
                        <el-submenu :index="item.id + ''" v-for="item in menusList">
                            <template #title>
                                <span>{{ item.authName }}</span>
                            </template>
                            <el-menu-item :index="'/' + child.path" v-for="child in item.children" :key="child.id">{{
                                child.authName
                            }}</el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>

export default {
    name: 'Login',
    data() {
        return {
            time: '',
            timer: null,
            menusList: [],
            isCollapse: false
        }
    },

    created() {
        this.getMenus()
    },

    mounted() {
        this.time = +new Date()
        document.querySelector('body').onmousemove = () => {
            this.time = +new Date()
        }
        clearInterval(this.timer)
        this.timer = setInterval(() => {
            var now = +new Date()
            if ((now - this.time) / 1000 > 3600) {
                this.loginOut()
                clearInterval(this.timer)
            }
        }, 1000);
    },

    methods: {
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        },
        loginOut() {
            window.sessionStorage.removeItem('token')
            this.$router.push('/login')
        },
        async getMenus() {
            const { data: res } = await this.$http.get('menus')
            if (res.meta.status != 200) {
                this.$message.error(res.meta.msg)
                return
            }
            this.$message.success(res.meta.msg)
            this.menusList = res.data
        }
    },
    props: {

    }
}
</script>

<style scoped>
.homeContain {
    height: 100vh;
}

.headerBox div {
    margin-left: 40px;
}

.el-container {
    height: 100%;
}

.el-header {
    display: flex;
    justify-content: space-between;
    color: #ffff;
    background-color: rgb(55, 61, 65);
    line-height: 60px;
    font-size: 25px;
    align-items: center;
}

.headerBox {
    display: flex;
    justify-content: center;
}

.el-header img {
    height: 70px;
    width: 60px;

}

.el-aside {
    background-color: rgb(51, 55, 68);

}

.el-main {
    background-color: #e3edef;
}

.el-menu {
    border-right: none;
}

.toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 34px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.4em;
    cursor: pointer;
}
</style>