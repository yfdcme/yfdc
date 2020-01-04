<template>
<div>
    <h2>订单管理</h2>
    <!-- 按钮 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="所有订单" name="first"></el-tab-pane>
        <el-tab-pane label="待支付" name="second"></el-tab-pane>
        <el-tab-pane label="待派单" name="third"></el-tab-pane>
        <el-tab-pane label="待接单" name="fourth"></el-tab-pane>
        <el-tab-pane label="待服务" name="fifth"></el-tab-pane>
        <el-tab-pane label="待确认" name="sixth"></el-tab-pane>
        <el-tab-pane label="已完成" name="seventh"></el-tab-pane>
    </el-tabs>
    <!-- /按钮 -->
    <!-- 表格 -->
    <el-table :data="orders">
        <el-table-column prop="id" label="订单编号"></el-table-column>
        <el-table-column prop="orderTime" label="下单时间"></el-table-column>
        <el-table-column prop="total" label="总价"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="customerId" label="顾客id"></el-table-column>
        <el-table-column prop="waiterId" label="员工id"></el-table-column>
        <el-table-column prop="addressId" label="服务地址"></el-table-column>
        <el-table-column label="操作">
            <template v-slot="slot">
                <a href="" @click.prevent="toDeleteHandler(slot.row.id)"><i class="el-icon-delete"></i></a>
                <a href="" @click.prevent="toUpdateHandler"><i class="el-icon-edit"></i></a>
            </template>
        </el-table-column>
    </el-table>
</div>
</template>

<script>
import request from '@/utils/request'
import querystring from 'querystring'
export default {
    // 用于存放网页中需要调用的方法
    methods: {
        loadData() {
            let url = "http://[::1]:6677/order/findAll"
            request.get(url).then((response) => {
                // 将查询结果设置到order中，this指向外部函数的this
                this.categories = response.data;
            })
        },
        submitHandler() {
            //this.form 对象 ---字符串--> 后台 {type:'customer',age:12}
            // json字符串 '{"type":"customer","age":12}'
            // request.post(url,this.form)
            // 查询字符串 type=customer&age=12
            // 通过request与后台进行交互，并且要携带参数
            let url = "http://[::1]:6677/order/saveOrUpdate";
            request({
                url,
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: querystring.stringify(this.form)
            }).then((response) => {
                // 模态框关闭
                this.closeModalHandler();
                // 刷新
                this.loadData();
                // 提示消息
                this.$message({
                    type: "success",
                    message: response.message
                })
            })

        },
        toDeleteHandler(id) {
            this.$confirm('此操作将永久删除该条目, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            })

        },
        toUpdateHandler() {
            this.visible = true;
        },
        closeModalHandler() {
            this.visible = false;
        },
        toAddHandler() {
            this.visible = true;
        }
    },
    // 用于存放要向网页中显示的数据
    data() {
        return {
            visible: false,
            orders: [],
            form: {}
        }
    },
    created() {
        // this为当前vue实例对象
        // vue实例创建完毕 
        this.loadData();
    }
}
</script>

<style scoped>

</style>
