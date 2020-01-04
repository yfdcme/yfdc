<template>
<div>
    <h2>地址管理</h2>
    <!-- 按钮 -->
    <el-button type="primary" size="small" @click="toAddHandler">添加</el-button>
    <el-button type="danger" size="small">批量删除</el-button>
    <!-- /按钮 -->
    <!-- 表格 -->
    <el-table :data="addresses">
        <el-table-column prop="id" label="编号" />
        <el-table-column prop="province" label="省" />
        <el-table-column prop="city" label="市" />
        <el-table-column prop="area" label="区" />
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="telephone" label="电话" />
        <el-table-column prop="customerId" label="客户编号" />
        <el-table-column label="操作">
            <template v-slot="slot">
                <a href @click.prevent="toDeleteHandler(slot.row.id)">
                    <i class="el-icon-delete"></i>
                </a>
                <a href @click.prevent="toUpdateHandler(slot.row)">
                    <i class="el-icon-edit"></i>
                </a>
            </template>
        </el-table-column>
    </el-table>
    <!-- /表格结束 -->
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" width="60%">
        ---{{form}}---
        <el-form :model="form" label-width="80px">
            <el-form-item label="省">
                <el-input v-model="form.province"></el-input>
            </el-form-item>
            <el-form-item label="市">
                <el-input v-model="form.city"></el-input>
            </el-form-item>
            <el-form-item label="区">
                <el-input v-model="form.area"></el-input>
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="form.telephone"></el-input>
            </el-form-item>
            <el-form-item label="客户">
                <el-input v-model="form.customerId"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="closeModalHandler">取 消</el-button>
            <el-button size="small" type="primary" @click="submitHandler">确 定</el-button>
        </span>
    </el-dialog>
    <!-- /模态框 -->
</div>
</template>

<script>
import request from "@/utils/request";
import querystring from "querystring";
export default {
    // 用于存放网页中需要调用的方法
    methods: {
        loadData() {
            let url = "http://[::1]:6677/address/findAll";
            request.get(url).then(response => {
                // 将查询结果设置到customers中，this指向外部函数的this
                this.addresses = response.data;
            });
        },
        submitHandler() {
            //this.form 对象 ---字符串--> 后台 {type:'customer',age:12}
            // json字符串 '{"type":"customer","age":12}'
            // request.post(url,this.form)
            // 查询字符串 type=customer&age=12
            // 通过request与后台进行交互，并且要携带参数
            let url = "http://[::1]:6677/address/saveOrUpdate";
            request({
                url,
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: querystring.stringify(this.form)
            }).then(response => {
                // 模态框关闭
                this.closeModalHandler();
                // 刷新
                this.loadData();
                // 提示消息
                this.$message({
                    type: "success",
                    message: response.message
                });
            });
        },
        toDeleteHandler(idc) {
            this.$confirm("此操作将永久删除该条目, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(() => {
                    let url = "http://[::1]:6677/address/deleteById?id=";
                    request.get(url + idc).then(resp => {
                        this.$message({
                            type: "success",
                            message: resp.message
                        });
                        this.loadData();
                        alert("loaddata");
                    });
                })
                .catch(e => {
                    this.$message({
                        type: "info",
                        message: e + "取消删除"
                    });
                })
                .finally(() => {});
        },
        toUpdateHandler(upd) {
            this.title = "更新地址";
            this.form = upd;
            this.visible = true;
        },
        closeModalHandler() {
            this.visible = false;
        },
        toAddHandler() {
            this.visible = true;
            this.form = {};
        }
    },
    // 用于存放要向网页中显示的数据
    data() {
        return {
            title: "添加地址",
            addresses: [],
            visible: false,
            categories: [],
            form: {}
        };
    },
    created() {
        // this为当前vue实例对象
        // vue实例创建完毕
        this.loadData();
    }
};
</script>

<style scoped>
</style>
