<template>
    <div class="ParamsPage">
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-alert title="注意：只允许为第三级分类设置参数" type="warning" show-icon />
            <el-row>
                <el-col :span="2">请选择商品分类：</el-col>
                <el-col :span="6">
                    <el-cascader v-model="selectKeys" :options="typeList" :props="paramsProps"
                        @change="handleChange"></el-cascader>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="changeActive">
                <el-tab-pane label="动态参数" name="many">
                    <el-row>
                        <el-button type="primary" @click="addParamsBefore()"
                            :disabled="selectKeys.length < 3">添加参数</el-button>
                    </el-row>
                    <el-row>
                        <el-table :data="manyList" border style="width: 100%">
                            <el-table-column type="expand" width="50">
                                <template slot-scope="scope">
                                    <el-tag v-for="item, index in scope.row.attr_vals"
                                        @close="handleClose(scope.row, index)" class="tags" closable>
                                        {{ item }}</el-tag>
                                    <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)">
                                    </el-input>
                                    <el-button v-else class="button-new-tag tags" size="small"
                                        @click="showInput(scope.row)">+ New
                                        Tag</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column type="index" width="50" />
                            <el-table-column prop="attr_name" label="参数名称">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button link type="primary" size="small"
                                        @click="editParamsBefore(scope.row)">编辑</el-button>
                                    <el-button link type="danger" size="small"
                                        @click="deleteParamsCheck(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-row>
                        <el-button type="primary" @click="addParamsBefore()"
                            :disabled="selectKeys.length < 3">添加参数</el-button>
                    </el-row>
                    <el-row>
                        <el-table :data="onlyList" border style="width: 100%">
                            <el-table-column type="expand" width="50">
                                <template slot-scope="scope">
                                    <el-tag v-for="item, index in scope.row.attr_vals"
                                        @close="handleClose(scope.row, index)" class="tags" closable>
                                        {{ item }}</el-tag>
                                    <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)">
                                    </el-input>
                                    <el-button v-else class="button-new-tag tags" size="small"
                                        @click="showInput(scope.row)">+ New
                                        Tag</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column type="index" width="50" />
                            <el-table-column prop="attr_name" label="参数名称">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button link type="primary" size="small"
                                        @click="editParamsBefore(scope.row)">编辑</el-button>
                                    <el-button link type="danger" size="small"
                                        @click="deleteParamsCheck(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <el-dialog :visible.sync="addParamsdialogVisible" :title="activeName=='many'?'添加动态参数':'添加静态属性'" width="60%" center :show-close="false"
            :close-on-click-modal="false">
            <div>
                <el-form ref="addParamsRef" :model="addParamsModel" :rules="addParamsRules" label-width="100px"
                    class="demo-ruleForm" status-icon>
                    <el-form-item label="参数名称：" prop="attr_name">
                        <el-input v-model="addParamsModel.attr_name" />
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addParamsCancel">取消</el-button>
                    <el-button type="primary" @click="addParams">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog :visible.sync="editParamsdialogVisible" ::title="activeName=='many'?'编辑动态参数':'编辑静态属性'" width="60%" center :show-close="false"
            :close-on-click-modal="false">
            <div>
                <el-form ref="editParamsRef" :model="editParamsModel" :rules="editParamsRules" label-width="100px"
                    class="demo-ruleForm" status-icon>
                    <el-form-item label="参数名称：" prop="attr_name">
                        <el-input v-model="editParamsModel.attr_name" />
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editParamsCancel">取消</el-button>
                    <el-button type="primary" @click="editParams">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'Params',

    data() {
        return {
            activeName: 'many',
            paramsProps: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children',
            },
            selectKeys: [],
            typeList: [],
            manyList: [],
            onlyList: [],
            catID: '',
            addParamsdialogVisible: false,
            editParamsdialogVisible: false,
            addParamsModel: {
                attr_name: '',
                attr_sel: '',
            },
            editParamsModel: {
                attr_id: '',
                cat_id: '',
                attr_name: '',
                attr_sel: '',
                attr_vals: '',
            },
            addParamsRules: {
                attr_name: [
                    { required: true, message: '参数名不能为空', trigger: 'blur' },
                    { max: 50, message: '至多输入50位字符', trigger: 'blur' },
                ],
            },
            editParamsRules: {
                attr_name: [
                    { required: true, message: '参数名不能为空', trigger: 'blur' },
                    { max: 50, message: '至多输入50位字符', trigger: 'blur' },
                ],
            },
        }
    },

    created() {
        this.getType()
    },

    methods: {
        changeActive(){
            this.handleChange();
        },
        
        async handleClose(item, index) {
            item.attr_vals.splice(index, 1);
            this.editCateParams(item);
        },

        showInput(item) {
            item.inputVisible = true;
        },

        handleInputConfirm(item) {
            let inputValue = item.inputValue;
            if (inputValue) {
                item.attr_vals.push(inputValue);
            }
            item.inputVisible = false;
            item.inputValue = '';
            this.editCateParams(item);
        },

        async editCateParams(item) {
            const { data: res } = await this.$http.put('categories/' + item.cat_id + '/attributes/' + item.attr_id, {
                "attr_name": item.attr_name,
                "attr_sel": item.attr_sel,
                "attr_vals": item.attr_vals.join(' ')
            })
            if (res.meta.status != 200) {
                this.$message.error(res.meta.msg);
                return;
            }
            this.$message.success(res.meta.msg);
        },

        async handleChange() {
            if (this.selectKeys.length < 3) {
                this.selectKeys = []
                this.manyList = []
                this.onlyList = []
                return
            }
            let key = this.selectKeys[this.selectKeys.length - 1];
            this.catID = key;
            const { data: res } = await this.$http.get('categories/' + key + '/attributes', {
                params: { sel: this.activeName }
            });
            if (res.meta.status != 200) {
                this.$message.error(res.meta.msg);
                return;
            }
            res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
                item.inputVisible = false;
                item.inputValue = '';
            })
            if (this.activeName == 'many') {
                this.manyList = res.data;
            } else {
                this.onlyList = res.data;
            }
            this.$message.success(res.meta.msg);
        },

        async getType() {
            const { data: res } = await this.$http.get('categories');
            if (res.meta.status != 200) {
                this.$message.error(res.meta.msg);
                return;
            }
            this.typeList = res.data;
            this.$message.success(res.meta.msg);
        },

        async addParamsBefore() {
            this.addParamsdialogVisible = !this.addParamsdialogVisible;
        },

        addParams() {
            this.$refs.addParamsRef.validate(async (valid) => {
                if (!valid) {
                    this.$message.error(res.meta.msg);
                    return false;
                }
                this.addParamsModel.attr_sel = this.activeName;
                const { data: res } = await this.$http.post('categories/' + this.catID + '/attributes', this.addParamsModel);
                if (res.meta.status != 201) {
                    this.$message.error(res.meta.msg);
                    return;
                } else {
                    this.$message.success(res.meta.msg);
                    this.$refs.addParamsRef.resetFields();
                    this.addParamsdialogVisible = !this.addParamsdialogVisible;
                }
                this.handleChange()
            });
        },

        addParamsCancel() {
            this.$refs.addParamsRef.resetFields();
            this.addParamsdialogVisible = !this.addParamsdialogVisible;
        },

        editParamsBefore(item) {
            this.editParamsModel = item;
            this.editParamsdialogVisible = !this.editParamsdialogVisible;
        },

        editParams() {
            this.$refs.editParamsRef.validate(async (valid) => {
                if (!valid) {
                    this.$message.error(res.meta.msg);
                    return false;
                }
                const { data: res } = await this.$http.put('categories/' + this.editParamsModel.cat_id + '/attributes/' + this.editParamsModel.attr_id, {
                "attr_name": this.editParamsModel.attr_name,
                "attr_sel": this.editParamsModel.attr_sel,
                "attr_vals": this.editParamsModel.attr_vals.join(' ')
            })
                if (res.meta.status != 200) {
                    this.$message.error(res.meta.msg);
                    return;
                } else {
                    this.$message.success(res.meta.msg);
                    this.$refs.editParamsRef.resetFields();
                    this.editParamsdialogVisible = !this.editParamsdialogVisible;
                }
                this.handleChange()
            });
        },

        editParamsCancel() {
            this.$refs.editParamsRef.resetFields();
            this.editParamsdialogVisible = !this.editParamsdialogVisible;
        },

        deleteParamsCheck(item) {
            console.log(item);
            this.$confirm('此操作将删除该参数及其下所有标签数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteParams(item.cat_id, item.attr_id);
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

        async deleteParams(catID, attrID) {
            const { data: res } = await this.$http.delete('categories/' + catID + '/attributes/ ' + attrID);
            if (res.meta.status != 200) {
                this.$message.error(res.meta.msg);
                return;
            } else {
                this.$message.success(res.meta.msg);
            }
            this.handleChange()
        },
    },
}
</script>
<style scoped>
.tags {
    margin: 0 10px;
}

.el-card {
    margin-top: 30px;
}

.el-row {
    margin: 15px 0;
    display: flex;
    align-items: center;
}

.el-cascader {
    width: 100%;
}

.addBtn {
    margin-bottom: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>