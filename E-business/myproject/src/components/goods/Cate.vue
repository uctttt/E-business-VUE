<template>
    <div class="CatePage">
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-button link type="primary" size="small" @click="addCateBefore" class="addBtn">添加分类</el-button>
            <treeTable :data="catePageList" :columns="columns" show-index :index-text="''" border :expand-type="false"
                :selection-type="false">
                <template slot="awake" scope="scope">
                    <div>
                        <el-tag v-if="scope.row.cat_deleted === false" type="success">√</el-tag>
                        <el-tag v-else-if="scope.row.cat_deleted === true" type="warning">×</el-tag>
                    </div>
                </template>
                <template slot="sort" scope="scope">
                    <div>
                        <el-tag v-if="scope.row.cat_level == 0" type="success">一级权限</el-tag>
                        <el-tag v-else-if="scope.row.cat_level == 1">二级权限</el-tag>
                        <el-tag v-else-if="scope.row.cat_level == 2" type="warning">三级权限</el-tag>
                    </div>
                </template>
                <template slot="control" scope="scope">
                    <div>
                        <el-button link type="primary" size="small"
                            @click="editCateBefore(scope.row.cat_id)">编辑</el-button>
                        <el-button link type="danger" size="small"
                            @click="deleteCateCheck(scope.row.cat_id)">删除</el-button>
                    </div>
                </template>
            </treeTable>
            <div class="demo-pagination-block">
                <el-pagination v-model:current-page="currentPage" :page-size="10" :page-sizes="[10, 15, 20]"
                    layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>
        </el-card>

        <el-dialog :visible.sync="addCatedialogVisible" title="新增分类" width="45%" center :show-close="false"
            :close-on-click-modal="false">
            <div>
                <el-form ref="addCateRef" :model="addCateModel" :rules="addCateRules" label-width="100px"
                    class="demo-ruleForm" status-icon>
                    <el-form-item label="分类名：" prop="cat_name">
                        <el-input v-model="addCateModel.cat_name" />
                    </el-form-item>
                    <el-form-item label="父级分类：">
                        <div class="block">
                            <span class="demonstration" clearable></span>
                            <el-cascader v-model="selectKeys" :options="parentList" :props="cateProps"
                                clearable></el-cascader>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addCateCancel">取消</el-button>
                    <el-button type="primary" @click="addCate">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog :visible.sync="editCatedialogVisible" title="编辑分类" width="40%" center :show-close="false"
            :close-on-click-modal="false">
            <div>
                <el-form ref="editCateRef" :model="editCateModel" :rules="editCateRules" label-width="100px"
                    class="demo-ruleForm" status-icon>
                    <el-form-item label="分类名：" prop="cat_name">
                        <el-input v-model="editCateModel.cat_name" />
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editCateCancel">取消</el-button>
                    <el-button type="primary" @click="editCate">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'Cate',

    data() {
        return {
            addCatedialogVisible: false,
            editCatedialogVisible: false,
            currentPage: 1,
            catePageList: [],
            total: 0,
            params: {
                type: 3,
                pagenum: 1,
                pagesize: 10,
            },
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name',
                },
                {
                    label: '是否有效',
                    type: 'template',
                    template: 'awake'
                },
                {
                    label: '排序',
                    type: 'template',
                    template: 'sort'
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'control'
                },
            ],
            cateProps: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children',
                checkStrictly: true
            },
            addCateModel: {
                cat_name: '',
                cat_pid: '',
                cat_level: '',
            },
            selectKeys: [],
            parentList: [],
            editCateModel: {
                cat_id: '',
                cat_name: '',
            },
            addCateRules: {
                cat_name: [
                    { required: true, message: '分类名不能为空', trigger: 'blur' },
                    { max: 25, message: '至多输入25位字符', trigger: 'blur' },
                ],
            },
            editCateRules: {
                cat_name: [
                    { required: true, message: '分类名不能为空', trigger: 'blur' },
                    { max: 25, message: '至多输入25位字符', trigger: 'blur' },
                ],
            },
        }
    },

    created() {
        this.getCatePageList()
    },

    methods: {
        handleSizeChange(val) {
            this.params.pagesize = val;
            this.params.pagenum = 1;
            this.getCatePageList();
        },

        handleCurrentChange(val) {
            this.params.pagenum = val;
            this.getCatePageList();
        },

        async getCatePageList() {
            const { data: res } = await this.$http.get('categories', { params: this.params });
            if (res.meta.status != 200) {
                this.$message.error(res.meta.msg);
                return;
            }
            this.catePageList = res.data.result;
            this.total = res.data.total;
            this.$message.success(res.meta.msg);
        },

        async addCateBefore() {
            const { data: res } = await this.$http.get('categories', { params: { type: 2 } });
            if (res.meta.status != 200) {
                this.$message.error(res.meta.msg);
                return;
            }
            this.parentList = res.data;
            this.$message.success(res.meta.msg);
            this.addCatedialogVisible = !this.addCatedialogVisible;
        },

        addCate() {
            this.$refs.addCateRef.validate(async (valid) => {
                if (!valid) {
                    this.$message.error(res.meta.msg);
                    return false;
                }
                if (this.selectKeys.length > 0) {
                    this.addCateModel.cat_pid = this.selectKeys[this.selectKeys.length - 1];
                    this.addCateModel.cat_level = this.selectKeys.length;
                } else {
                    this.addCateModel.cat_pid = 0;
                    this.addCateModel.cat_level = 0;
                }
                const { data: res } = await this.$http.post('categories', this.addCateModel);
                if (res.meta.status != 201) {
                    this.$message.error(res.meta.msg);
                    return;
                } else {
                    this.$message.success(res.meta.msg);
                    this.$refs.addCateRef.resetFields();
                    this.selectKeys = [];
                    this.addCatedialogVisible = !this.addCatedialogVisible;
                    this.getCatePageList();
                }
            });
        },

        addCateCancel() {
            this.$refs.addCateRef.resetFields();
            this.addCatedialogVisible = !this.addCatedialogVisible;
        },

        async editCateBefore(id) {
            const { data: res } = await this.$http.get('categories/' + id)
            this.editCateModel = res.data
            this.editCatedialogVisible = true;
        },

        editCate() {
            this.$refs.editCateRef.validate(async (valid) => {
                if (!valid) {
                    return false;
                }
                const { data: res } = await this.$http.put('categories/' + this.editCateModel.cat_id, this.editCateModel);
                if (res.meta.status != 200) {
                    this.$message.error(res.meta.msg);
                    return;
                } else {
                    this.$message.success(res.meta.msg);
                    this.getCatePageList();
                    this.$refs.editCateRef.resetFields();
                    this.editCatedialogVisible = !this.editCatedialogVisible;
                }
            });
        },

        editCateCancel() {
            this.$refs.editCateRef.resetFields();
            this.editCatedialogVisible = !this.editCatedialogVisible;
        },

        deleteCateCheck(id) {
            this.$confirm('此操作将删除该用户及其所有信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteCate(id);
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

        async deleteCate(id) {
            const { data: res } = await this.$http.delete('categories/' + id);
            this.getCatePageList();
        },
    },
}
</script>

<style scoped>
.el-card {
    margin-top: 30px;
}

.el-cascader {
    width: 100%;
}

.addBtn {
    margin-bottom: 10px;
}
</style>