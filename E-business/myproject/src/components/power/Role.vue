<template>
    <div class="rolePage">
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-button link type="primary" size="small" @click="addRole" class="addBtn">添加角色</el-button>
            <el-table :data="roleData" border style="width: 100%">
                <el-table-column type="expand" width="50">
                    <template slot-scope="scope">
                        <el-row v-for="itemL in scope.row.children" class="topBorder">
                            <el-col :span="3">
                                <el-tag type="success" closable @close="removeRightCheck(scope.row, itemL.id)">{{
                                    itemL.authName
                                }}</el-tag>
                            </el-col>
                            <el-col :span="20">
                                <el-row v-for="itemM in itemL.children">
                                    <el-col :span="4">
                                        <el-tag closable @close="removeRightCheck(scope.row, itemM.id)">{{
                                            itemM.authName
                                        }}</el-tag>
                                    </el-col>
                                    <el-col :span="3" v-for="itemS in itemM.children">
                                        <el-tag type="warning" @close="removeRightCheck(scope.row, itemS.id)"
                                            closable>{{
                                                itemS.authName
                                            }}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" width="50" />
                <el-table-column prop="roleName" label="角色名称">
                </el-table-column>
                <el-table-column prop="roleDesc" label="角色描述">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button link type="primary" size="small" @click="editRoleBefore(scope.row.id)">编辑</el-button>
                        <el-button link type="danger" size="small" @click="deleteRoleCheck(scope.row.id)">删除</el-button>
                        <el-button link type="success" size="small"
                            @click="rightChangeCheck(scope.row)">权限分配</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog :visible.sync="addRoledialogVisible" title="添加角色" width="60%" center :show-close="false"
            :close-on-click-modal="false">
            <div>
                <el-form ref="addRoleRef" :model="addRoleModel" :rules="addRoleFormRules" label-width="100px"
                    class="demo-ruleForm" status-icon>
                    <el-form-item label="角色名称：" prop="roleName">
                        <el-input v-model="addRoleModel.roleName" />
                    </el-form-item>
                    <el-form-item label="角色描述：" prop="roleDesc">
                        <el-input v-model="addRoleModel.roleDesc" />
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addRoleCancel">取消</el-button>
                    <el-button type="primary" @click="addRoleCheck">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog :visible.sync="editRoledialogVisible" title="编辑角色" width="60%" center :show-close="false"
            :close-on-click-modal="false">
            <div>
                <el-form ref="editRoleForm" :model="editRoleModel" :rules="editRoleRules" label-width="100px"
                    class="demo-ruleForm" status-icon>
                    <el-form-item label="角色名：" prop="roleName">
                        <el-input v-model="editRoleModel.roleName" />
                    </el-form-item>
                    <el-form-item label="角色描述：" prop="roleDesc">
                        <el-input v-model="editRoleModel.roleDesc" />
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editRoleCancel">取消</el-button>
                    <el-button type="primary" @click="editRoleForm">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog :visible.sync="rightChangedialogVisible" title="分配权限" width="60%" center :show-close="false"
            :close-on-click-modal="false">
            <div>
                <el-tree ref="rightTreeRef" :data="rightData" :props="props" :load="loadNode" :default-checked-keys="roleRight"
                    node-key="id" show-checkbox default-expand-all>
                </el-tree>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="rightChangeCancel">取消</el-button>
                    <el-button type="primary" @click="rightChange">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>

export default {
    name: 'Right',
    data() {
        return {
            addRoledialogVisible: false,
            editRoledialogVisible: false,
            rightChangedialogVisible: false,
            addRoleModel: {
                roleName: '',
                roleDesc: '',
            },
            editRoleModel: {
                roleId: 0,
                roleName: '',
                roleDesc: '',
            },
            roleData: [],
            rightData: [],
            roleRight: [],
            roleID:0,
            addRoleFormRules: {
                roleName: [{ required: true, message: '角色名不能为空', trigger: 'blur' },
                { max: 10, message: '至多输入10位字符', trigger: 'blur' },
                ],
                roleDesc: [
                    { max: 25, message: '至多输入25位字符', trigger: 'blur' },
                ],
            },
            editRoleRules: {
                roleName: [{ required: true, message: '角色名不能为空', trigger: 'blur' },
                { max: 10, message: '至多输入10位字符', trigger: 'blur' },
                ],
                roleDesc: [
                    { max: 25, message: '至多输入25位字符', trigger: 'blur' },
                ],
            },
            props: {
                label: 'authName',
                children: 'children'
            },
        }
    },
    created() {
        this.getRoleList()
    },

    methods: {
        async getRoleList() {
            const { data: res } = await this.$http.get('roles');
            if (res.meta.status != 200) {
                this.$message.error(res.meta.msg);
                return;
            }
            this.roleData = res.data
            this.$message.success(res.meta.msg);
        },

        addRole() {
            this.addRoledialogVisible = !this.addRoledialogVisible
        },

        addRoleCheck() {
            this.$refs.addRoleRef.validate(async (valid) => {
                if (!valid) {
                    this.$message.error(res.meta.msg);
                    return false;
                }
                const { data: res } = await this.$http.post('roles', this.addRoleModel);
                if (res.meta.status != 201) {
                    this.$message.error(res.meta.msg);
                    return;
                } else {
                    this.$message.success(res.meta.msg);
                    this.$refs.addRoleRef.resetFields();
                    this.addRoledialogVisible = !this.addRoledialogVisible;
                    this.getRoleList()
                }
            });
        },

        addRoleCancel() {
            this.$refs.addRoleRef.resetFields();
            this.addRoledialogVisible = !this.addRoledialogVisible;
        },

        async editRoleBefore(id) {
            const { data: res } = await this.$http.get('roles/' + id)
            this.editRoleModel = res.data
            this.editRoledialogVisible = true;
        },

        editRoleForm() {
            this.$refs.editRoleForm.validate(async (valid) => {
                if (!valid) {
                    return false;
                }
                const { data: res } = await this.$http.put('roles/' + this.editRoleModel.roleId, this.editRoleModel);
                if (res.meta.status != 200) {
                    this.$message.error(res.meta.msg);
                    return;
                } else {
                    this.$message.success(res.meta.msg);
                    this.getRoleList();
                    this.$refs.editRoleForm.resetFields();
                    this.editRoledialogVisible = !this.editRoledialogVisible;
                }
            });
        },

        editRoleCancel() {
            this.$refs.editRoleForm.resetFields();
            this.editRoledialogVisible = !this.editRoledialogVisible;
        },

        deleteRoleCheck(id) {
            this.$confirm('此操作将删除该角色及其下所有权限信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRole(id);
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

        async deleteRole(id) {
            const { data: res } = await this.$http.delete('roles/' + id);
            this.getRoleList();
        },

        removeRightCheck(role, rightID) {
            this.$confirm('此操作将删除该权限信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.removeRigth(role, rightID);
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

        async removeRigth(role, rightID) {
            const { data: res } = await this.$http.delete('roles/' + role.id + '/rights/' + rightID);
            role.children = res.data
        },

        async rightChangeCheck(role) {
            this.roleRight=[];
            this.rightChangedialogVisible = !this.rightChangedialogVisible;
            const { data: res } = await this.$http.get('rights/tree');
            this.getRoleRight(role, this.roleRight);
            this.rightData = res.data;
            this.roleID=role.id;
            if (res.meta.status != 200) {
                this.$message.error(res.meta.msg);
                return;
            }
            this.$message.success(res.meta.msg);
        },

        getRoleRight(item, arr) {
            if (!item.children) {
                arr.push(item.id);
                return;
            }
            item.children.forEach(ele => {
                this.getRoleRight(ele, arr);
            })
        },

        async rightChange(){
            let all=this.$refs.rightTreeRef.getCheckedKeys();
            let half=this.$refs.rightTreeRef.getHalfCheckedKeys();
            let keys=[...all,...half];
            let keyStr=keys.join(',');
            const { data: res } = await this.$http.post('roles/'+this.roleID+'/rights',{
                rids:keyStr
            });
            if (res.meta.status != 200) {
                this.$message.error(res.meta.msg);
                return;
            }
            this.roleRight=[];
            this.$message.success(res.meta.msg);
            this.getRoleList();
            this.rightChangedialogVisible = !this.rightChangedialogVisible;
        },

        rightChangeCancel() {
            this.roleRight=[];
            this.rightChangedialogVisible = !this.rightChangedialogVisible;
        },
    },
}

</script>

<style scoped>

.el-tag {
    margin: 10px;
}

.el-row {
    display: flex;
    align-items: center;
}
.el-card {
    margin-top: 30px;
}
.addBtn {
    margin-bottom: 10px;
}

.demo-pagination-block {
    margin-top: 10px;
}

.topBorder {
    border-top: 1px solid rgb(235, 235, 235);
}
</style>