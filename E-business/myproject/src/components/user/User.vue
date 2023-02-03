<template>
    <div class="userPage">
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input v-model="params.query" placeholder="请输入内容" class="input-with-select" @blur="getUserList"
                        clearable>
                        <el-button slot="append" @click="getUserList">搜索</el-button>
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <el-button type="primary" @click="addUserdialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <el-table :data="userList" style="width: 100%">
                <el-table-column type="index" width="50px" />
                <el-table-column prop="username" label="姓名" />
                <el-table-column prop="email" label="邮箱" />
                <el-table-column prop="mobile" label="电话" />
                <el-table-column prop="role_name" label="角色" />
                <el-table-column prop="mg_state" label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button link type="primary" size="small" @click="editFormBefore(scope.row.id)">编辑</el-button>
                        <el-button link type="danger" size="small" @click="deleteUserCheck(scope.row.id)">删除</el-button>
                        <el-button link type="success" size="small" @click="editRoleBefore(scope.row)">设置角色</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="currentPage" :page-size="5" :page-sizes="[5, 8, 12]"
                layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </el-card>

        <el-dialog :visible.sync="addUserdialogVisible" title="添加用户" width="75%" center :show-close="false"
            :close-on-click-modal="false">
            <div>
                <el-form ref="addUserForm" :model="addFormModel" :rules="addFormRules" label-width="100px"
                    class="demo-ruleForm" status-icon>
                    <el-form-item label="用户名：" prop="username">
                        <el-input v-model="addFormModel.username" />
                    </el-form-item>
                    <el-form-item label="密码：" prop="password">
                        <el-input v-model="addFormModel.password" type="password" show-password />
                    </el-form-item>
                    <el-form-item label="邮箱：" prop="email">
                        <el-input v-model="addFormModel.email" />
                    </el-form-item>
                    <el-form-item label="电话号码：" prop="mobile">
                        <el-input v-model="addFormModel.mobile" />
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addUserCancel">取消</el-button>
                    <el-button type="primary" @click="addUserForm">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog :visible.sync="editUserdialogVisible" title="编辑用户" width="40%" center :show-close="false"
            :close-on-click-modal="false">
            <div>
                <el-form ref="editUserForm" :model="editFormModel" :rules="editFormRules" label-width="100px"
                    class="demo-ruleForm" status-icon>
                    <el-form-item label="用户名：" prop="username">
                        <el-input v-model="editFormModel.username" disabled />
                    </el-form-item>
                    <el-form-item label="邮箱：" prop="email">
                        <el-input v-model="editFormModel.email" />
                    </el-form-item>
                    <el-form-item label="电话号码：" prop="mobile">
                        <el-input v-model="editFormModel.mobile" />
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editUserCancel">取消</el-button>
                    <el-button type="primary" @click="editUserForm">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog :visible.sync="editUserRoledialogVisible" title="分配角色" width="30%" center :show-close="false"
            :close-on-click-modal="false" class="role">
            <div>
                <div>当前用户：{{ editRoleModel.username }}</div>
                <div>当前角色：{{ editRoleModel.role_name }}</div>
                <div>角色分配：
                    <el-select v-model="roleId" placeholder="请选择新角色">
                        <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editUserRoleCancel">取消</el-button>
                    <el-button type="primary" @click="editUserRole">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>

export default {
    name: 'User',
    data() {
        const checkEmail = (rule, value, callback) => {
            if (!value) {
                callback()
            }
            if (value) {
                if (value.indexOf('@') === -1) {
                    return callback(new Error('请输入正确邮箱地址'))
                }
                callback()
            }
        };
        
        const checkMobile = (rule, value, callback) => {
            if (!value) {
                callback()
            }
            let reg = /^1[3456789]\d{9}$/
            if (reg.test(value)) {
                callback()
            } else
                return callback(new Error('请输入正确电话号码'))
        };

        return {
            userList: [],
            currentPage: 1,
            total: 0,
            addUserdialogVisible: false,
            editUserdialogVisible: false,
            editUserRoledialogVisible: false,
            params: {
                query: '',
                pagenum: 1,
                pagesize: 5,
            },
            addFormModel: {
                username: '',
                password: '',
                email: '',
                mobile: '',
            },
            editFormModel: {
                username: '',
                email: '',
                mobile: '',
            },
            editRoleModel: {},
            roleList: [],
            roleId: '',
            addFormRules: {
                username: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' },
                    { min: 3, max: 25, message: '请输入3至25位字符', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                    { min: 6, max: 18, message: '请输入6位以上字符', trigger: 'blur' },
                ],
                email: [
                    { validator: checkEmail, trigger: 'blur' },
                ],
                mobile: [
                    { validator: checkMobile, trigger: 'blur' },
                ],
            },
            editFormRules: {
                email: [
                    { validator: checkEmail, trigger: 'blur' },
                ],
                mobile: [
                    { validator: checkMobile, trigger: 'blur' },
                ],
            },
        }
    },

    created() {
        this.getUserList()
    },

    methods: {
        async getUserList() {
            const { data: res } = await this.$http.get('users', { params: this.params });
            if (res.meta.status != 200) {
                this.$message.error(res.meta.msg);
                return;
            }
            this.userList = res.data.users;
            this.total = res.data.total;
            this.$message.success(res.meta.msg);
        },

        handleSizeChange(val) {
            this.params.pagesize = val;
            this.params.pagenum = 1;
            this.getUserList();
        },

        handleCurrentChange(val) {
            this.params.pagenum = val;
            this.getUserList();
        },

        async changeState(item) {
            const { data: res } = await this.$http.put('users/' + item.id + '/state/' + item.mg_state)
            this.$message.success(res.meta.msg);
        },

        addUserForm() {
            this.$refs.addUserForm.validate(async (valid) => {
                if (!valid) {
                    this.$message.error(res.meta.msg);
                    return false;
                }
                const { data: res } = await this.$http.post('users', this.addFormModel);
                if (res.meta.status != 201) {
                    this.$message.error(res.meta.msg);
                    return;
                } else {
                    this.$message.success(res.meta.msg);
                    this.$refs.addUserForm.resetFields();
                    this.addUserdialogVisible = !this.addUserdialogVisible;
                    this.getUserList();
                }
            });
        },

        addUserCancel() {
            this.$refs.addUserForm.resetFields();
            this.addUserdialogVisible = !this.addUserdialogVisible;
        },

        async editFormBefore(id) {
            const { data: res } = await this.$http.get('users/' + id)
            this.editFormModel = res.data
            this.editUserdialogVisible = true;
        },

        editUserForm() {
            this.$refs.editUserForm.validate(async (valid) => {
                if (!valid) {
                    return false;
                }
                const { data: res } = await this.$http.put('users/' + this.editFormModel.id, this.editFormModel);
                if (res.meta.status != 200) {
                    this.$message.error(res.meta.msg);
                    return;
                } else {
                    this.$message.success(res.meta.msg);
                    this.getUserList();
                    this.$refs.editUserForm.resetFields();
                    this.editUserdialogVisible = !this.editUserdialogVisible;
                }
            });
        },
        editUserCancel() {
            this.$refs.editUserForm.resetFields();
            this.editUserdialogVisible = !this.editUserdialogVisible;
        },

        deleteUserCheck(id) {
            this.$confirm('此操作将删除该用户及其所有信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteUser(id);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        async deleteUser(id) {
            const { data: res } = await this.$http.delete('users/' + id);
            this.getUserList();
        },

        async editRoleBefore(role) {
            this.editRoleModel = role;
            const { data: res } = await this.$http.get('roles');
            if (res.meta.status != 200) {
                this.$message.error(res.meta.msg);
                return;
            } else {
                this.roleList = res.data;
            }
            this.editUserRoledialogVisible = !this.editUserRoledialogVisible;
        },

        async editUserRole() {
            if (this.roleId == '') {
                this.$message.error('角色不可为空');
                return
            }
            const { data: res } = await this.$http.put('users/' + this.editRoleModel.id + '/role', {
                rid: this.roleId
            });
            if (res.meta.status != 200) {
                this.$message.error(res.meta.msg);
                return;
            } else {
                this.$message.success(res.meta.msg);
            }
            this.editUserRoledialogVisible = !this.editUserRoledialogVisible;
            this.editRoleModel = {},
                this.roleList = [],
                this.roleId = '',
                this.getUserList();
        },

        editUserRoleCancel() {
            this.editRoleModel = {},
                this.roleList = [],
                this.roleId = '',
                this.editUserRoledialogVisible = !this.editUserRoledialogVisible;
            this.getUserList();
        },
    },
    props: {

    }
}

</script>

<style scoped>
.el-card {
    margin-top: 30px;
}

.demo-pagination-block {
    margin-top: 10px;
}

.role div div {
    margin: 10px 0;
}
</style>