<template>
    <div class="ListPage">
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row :gutter="30">
                <el-col :span="10">
                    <el-input placeholder="请输入内容" v-model="params.query" class="input-with-select" @blur="getList"
                        clearable>
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="toAdd">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table :data="goodList" stripe border>
                <el-table-column type="index" />
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格" prop="goods_price"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
                <el-table-column label="创建时间" prop="add_time">
                    <template slot-scope="scope">
                        <div>
                            {{ scope.row.add_time | dateFormat }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button link type="primary" size="small" @click="">编辑</el-button>
                        <el-button link type="danger" size="small" @click="deleteGoodCheck(scope.row.goods_id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="currentPage" :page-size="5" :page-sizes="[5, 8, 12]"
                layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'List',

    data() {
        return {
            goodList: [],
            currentPage: 1,
            total: 0,
            params: {
                query: '',
                pagenum: 1,
                pagesize: 10,
            },
        }
    },

    created() {
        this.getList()
    },

    methods: {
        async getList() {
            const { data: res } = await this.$http.get('goods', { params: this.params });
            if (res.meta.status != 200) {
                this.$message.error(res.meta.msg);
                return;
            }
            this.goodList = res.data.goods;
            this.total = res.data.total;
            this.$message.success(res.meta.msg);
            console.log(this.goodList);
        },

        handleSizeChange(val) {
            this.params.pagesize = val;
            this.params.pagenum = 1;
            this.getList();
        },

        handleCurrentChange(val) {
            this.params.pagenum = val;
            this.getList();
        },

        deleteGoodCheck(id) {
            this.$confirm('此操作将删除该商品及其所有信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteGood(id);
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

        async deleteGood(id) {
            const { data: res } = await this.$http.delete('goods/' + id);
            this.getList();
        },

        toAdd(){
            this.$router.push('/goods/add')
        }
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
</style>