<template>
    <div class="AddPage">
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-alert title="添加商品信息" type="info" center show-icon>
            </el-alert>
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form ref="addRef" :model="addForm" :rules="addRule" label-position="top">
                <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeLeave">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader v-model="addForm.goods_cat" :options="typeList" :props="paramsProps"
                                @change="handleChange" />
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
                    <el-tab-pane label="完成" name="5">完成</el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
    </div>
</template>
<script>
export default {
    name: 'Add',

    data() {
        return {
            addForm: {
                goods_name: '',
                goods_price: '',
                goods_number: '',
                goods_weight: '',
                goods_cat: '',
            },
            addRule: {
                goods_name: [
                    { required: true, message: '商品名称不能为空', trigger: 'blur' },
                    { max: 50, message: '至多输入50位字符', trigger: 'blur' },
                ],
                goods_price: [
                    { required: true, message: '商品价格不能为空', trigger: 'blur' },
                ],
                goods_number: [
                    { required: true, message: '商品数量不能为空', trigger: 'blur' },
                ],
                goods_weight: [
                    { required: true, message: '商品重量不能为空', trigger: 'blur' },
                ],
                goods_cat: [
                    { required: true, message: '商品分类不能为空', trigger: 'blur' },
                ],
            },
            activeIndex: '0',
            selectKeys: [],
            typeList: [],
            paramsProps: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children',
            },
        }
    },

    created() {
        this.getType();
    },

    methods: {
        async getType() {
            const { data: res } = await this.$http.get('categories');
            if (res.meta.status != 200) {
                this.$message.error(res.meta.msg);
                return;
            }
            this.typeList = res.data;
            this.$message.success(res.meta.msg);
        },

        async handleChange() {
            if (this.addForm.goods_cat.length < 3) {
                this.addForm.goods_cat = '';
                this.typeList= '';
                return;
            }
        },

        beforeLeave(activeName, oldName) {
            // if (oldName === '0') {
            //     console.log(oldName);
            //     for (const key in this.addForm) {
            //         if (this.addForm[key] == '') {
            //             this.$message.error('存在空项');
            //             return false;
            //         }
            //     }
            // }
        },


    },
}
</script>

<style scoped>
.el-card {
    margin-top: 30px;
}

.el-table {
    margin-top: 20px;
}

.el-steps {
    margin: 25px 0;
}
</style>