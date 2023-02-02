<template>
    <div class="orderPage">
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input v-model="params.query" placeholder="请输入内容" class="input-with-select" @blur="getOrderList"
                        clearable>
                        <el-button slot="append" @click="getOrderList">搜索</el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table :data="orderList" style="width: 100%">
                <el-table-column type="index" width="50px" />
                <el-table-column prop="user_id" label="用户ID" />
                <el-table-column prop="order_fapiao_title" label="用户类型" />
                <el-table-column prop="pay_status" label="支付状态" :formatter="payStatus" />
                <el-table-column prop="is_send" label="发货状态" />
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button link type="primary" size="small"
                            @click="editFormBefore(scope.row.order_id)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="demo-pagination-block">
                <el-pagination v-model:current-page="currentPage" :page-size="5" :page-sizes="[5, 8, 12]"
                    layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>
        </el-card>

        <el-dialog :visible.sync="editOrderdialogVisible" title="编辑订单" width="60%" center :show-close="false"
            :close-on-click-modal="false">
            <div>
                <el-form ref="editOrderRef" :model="editFormModel" :rules="editFormRules" label-width="100px"
                    class="demo-ruleForm" status-icon>
                    <el-form-item label="创建时间:" prop="create_time">
                        {{ editFormModel.create_time }}
                    </el-form-item>
                    <el-form-item label="更新时间:" prop="update_time">
                        {{ editFormModel.update_time }}
                    </el-form-item>
                    <el-table :data="editFormModel.goods" border style="width: 100%">
                        <el-table-column class="index" type="index" width="50" />
                        <el-table-column prop="goods_id" label="货物ID">
                        </el-table-column>
                        <el-table-column prop="goods_price" label="货物单价">
                        </el-table-column>
                        <el-table-column prop="goods_number" label="订购数量">
                        </el-table-column>
                        <el-table-column prop="goods_total_price" label="货物总价">
                        </el-table-column>
                    </el-table>
                    <el-form-item label="订单价格：" prop="order_price">
                        <el-input placeholder="请输入内容" v-model="editFormModel.order_price" clearable />
                    </el-form-item>
                    <el-form-item label="订单数量：" prop="order_number">
                        <el-input placeholder="请输入内容" v-model="editFormModel.order_number" clearable />
                    </el-form-item>
                    <el-form-item label="支付状态：" prop="pay_status">
                        <el-switch v-model="editFormModel.pay_status" active-text="已支付" inactive-text="未支付" active-value="1" inactive-value="0"
                            @change="clearPayType" />
                    </el-form-item>
                    <el-form-item label="发货状态：" prop="is_send">
                        <el-switch v-model="editFormModel.is_send" active-text="已发货" inactive-text="未发货" active-value="是" inactive-value="否"/>
                    </el-form-item>
                    <el-form-item label="支付方式：" prop="order_pay">
                        <el-select v-model="payType" placeholder="请选择支付方式"
                            :disabled="editFormModel.pay_status == '0' ? true : false">
                            <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editOrderCancel">取消</el-button>
                    <el-button type="primary" @click="editOrderForm">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>


    </div>
</template>

<script>

export default {
    name: 'Order',
    data() {
        return {
            orderList: [],
            currentPage: 1,
            total: 0,
            editOrderdialogVisible: false,
            params: {
                query: '',
                pagenum: 1,
                pagesize: 5,
            },
            editFormModel: {
                order_id: '',
                user_id: '',
                order_pay: '',
                order_price: '',
                is_send: '',
                pay_status: '',
                create_time: '',
                update_time: '',
                goods: []
            },
            options: [
                { id: 1, label: '支付宝' },
                { id: 2, label: '微信' },
                { id: 3, label: '银行卡' },
            ],
            payType: '',
            editFormRules: {
                goods: {
                    goods_price: [{
                        required: true,
                        message:
                            "此处不可为空",
                        trigger: "blur",
                    },
                    {
                        pattern: /^[1-9]\d*$/,
                        message:
                            "请输入正整数",
                    },],
                    goods_number: [{
                        required: true,
                        message:
                            "此处不可为空",
                        trigger: "blur",
                    },
                    {
                        pattern: /^[1-9]\d*$/,
                        message:
                            "请输入正整数",
                    },],
                }

            },
        }
    },

    created() {
        this.getOrderList()
    },

    methods: {
        clearPayType() {
            if (this.editFormModel.pay_status == 0) {
                this.payType = ''
            }
            console.log(this.editFormModel.is_send,this.editFormModel.pay_status);
        },

        getDate(date) {
            const inputDate = new Date(date);
            const year = inputDate.getFullYear();
            const month = inputDate.getMonth() + 1;
            const day = inputDate.getDate();
            const hour = inputDate.getHours();
            const min = inputDate.getMinutes();
            return `${year}/${month}/${day} ${hour}:${min}`;
        },

        payStatus(item) {
            return item.pay_status == '0' ? '未支付' : '已支付'
        },

        async getOrderList() {
            const { data: res } = await this.$http.get('orders', { params: this.params });
            if (res.meta.status != 200) {
                this.$message.error(res.meta.msg);
                return;
            }
            this.orderList = res.data.goods;
            this.total = res.data.total;
            this.$message.success(res.meta.msg);
        },

        handleSizeChange(val) {
            this.params.pagesize = val;
            this.params.pagenum = 1;
            this.getOrderList();
        },

        handleCurrentChange(val) {
            this.params.pagenum = val;
            this.getOrderList();
        },

        async editFormBefore(id) {
            const { data: res } = await this.$http.get('orders/' + id)
            this.editFormModel = res.data;
            console.log(this.editFormModel.order_id,this.editFormModel.is_send,this.editFormModel.order_pay,this.editFormModel.order_price,this.editFormModel.order_number,this.editFormModel.pay_status);
            this.editFormModel.create_time = this.getDate(this.editFormModel.create_time);
            this.editFormModel.update_time = this.getDate(this.editFormModel.update_time);
            this.editOrderdialogVisible = !this.editOrderdialogVisible;
        },

        editOrderForm() {
            console.log(this.editFormModel.order_id,this.editFormModel.is_send,this.payType+'',this.editFormModel.order_price,this.editFormModel.order_number,this.editFormModel.pay_status);
            this.$refs.editOrderRef.validate(async (valid) => {
                if (!valid) {
                    return false;
                }
                const { data: res } = await this.$http.put('orders/' + this.editFormModel.order_id, {
                    "is_send": this.editFormModel.is_send,
                    "order_pay": this.payType+'',
                    "order_price": this.editFormModel.order_price,
                    "order_number": this.editFormModel.order_number,
                    "pay_status": this.editFormModel.pay_status
                });
                if (res.meta.status != 200) {
                    this.$message.error(res.meta.msg);
                    return;
                } else {
                    this.$message.success(res.meta.msg);
                    this.$refs.editOrderRef.resetFields();
                    this.editOrderdialogVisible = !this.editOrderdialogVisible;
                    this.getOrderList();
                }
            });
        },

        editOrderCancel() {
            this.$refs.editOrderRef.resetFields();
            this.editOrderdialogVisible = !this.editOrderdialogVisible;
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