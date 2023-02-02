<template>
    <div class="rightPage">
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-table :data="rightData" border style="width: 100%">
                <el-table-column class="index" type="index" width="50" />
                <el-table-column prop="authName" label="权限名称">
                </el-table-column>
                <el-table-column prop="path" label="路径">
                </el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level == 0" type="success">一级权限</el-tag>
                        <el-tag v-else-if="scope.row.level == 1" >二级权限</el-tag>
                        <el-tag v-else-if="scope.row.level == 2" type="warning">三级权限</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>

export default {
    name: 'Right',
    data() {
        return {
            rightData: {
                authName: '',
                path: '',
                level: '',
            }
        }
    },

    created() {
        this.getRightList()
    },

    methods: {
        async getRightList() {
            const { data: res } = await this.$http.get('rights/list');
            if (res.meta.status != 200) {
                this.$message.error(res.meta.msg);
                return;
            }
            this.rightData = res.data
            this.$message.success(res.meta.msg);
        }
    },
    props: {

    }
}

</script>

<style scoped>

.el-card {
    margin-top: 30px;
    padding: 0 80px;
}

.demo-pagination-block {
    margin-top: 10px;
}
</style>