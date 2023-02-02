<template>
    <div class="loginPage">
        <div class="loginBox">
            <div class="headBox">
                <img src="../assets/logo.png" alt="">
            </div>
            <el-form class="loginForm" :model="loginForm" :rules="loginRules" ref="loginFormRef">
                <el-form-item label="" prop="username">
                    <el-input v-model.trim="loginForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="" prop="password">
                    <el-input v-model.trim="loginForm.password" type="password" show-password
                        placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item class="loginBtn">
                    <el-button type="primary" @click="loginSubmit">登陆</el-button>
                    <el-button @click="formReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            loginForm: {
                username: '',
                password: ''
            },
            loginRules: {
                username: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' },
                    { min: 3, max: 25, message: '请输入3至25位字符', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                    { min: 6, max: 18, message: '请输入6位以上字符', trigger: 'blur' },
                ],
            },
        }
    },
    methods: {
        loginSubmit() {
            this.$refs.loginFormRef.validate(async result => {
                if (result) {
                    const { data: res } = await this.$http.post('login', this.loginForm)
                    if (res.meta.status === 200) {
                        this.$message.success(res.meta.msg)
                        sessionStorage.setItem('token', res.data.token)
                        this.$router.push('/home')
                    } else {
                        this.$message.error(res.meta.msg)
                    }
                } else {
                    return false
                }
            }
            );
        },
        
        formReset() {
            this.$refs.loginFormRef.resetFields();
        },
    },
    props: {

    }
}
</script>

<style scoped>
.loginPage {
    background-color: rgb(0, 153, 255);
    height: 100vh;
    width: 100vw;
}

.loginBox {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.headBox {
    height: 130px;
    width: 130px;
    background-color: #fff;
    border-radius: 50%;
    padding: 10px;
    position: absolute;
    top: -25%;
    left: 5%;
}

.headBox img {
    height: 100%;
    border: 1px solid rgb(207, 207, 207);
    border-radius: 50%;
}

.loginForm {
    box-sizing: border-box;
    width: 100%;
    padding: 0 15px;
    position: absolute;
    bottom: 5%;
}

.loginBtn {
    display: flex;
    justify-content: flex-end;
}
</style>