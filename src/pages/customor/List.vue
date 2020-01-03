<template>
  <div>
    <el-button @click="toaddhdl" type="success">添加</el-button>
    <el-button type="danger">批量删除</el-button>
    <el-table :data="costomers">
      <el-table-column label="编号" prop="id"></el-table-column>
      <el-table-column label="姓名" prop="realname"></el-table-column>
      <el-table-column label="联系方式" prop="telephone"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="slot">
          <a href="#" @click.prevent="todeletehandler(slot.row.id)">删除</a>
          <a href="#" @click.prevent="toupdatehandler(slot.row)">修改</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination layout="prev, pager, next" :total="50"></el-pagination> -->
    <el-dialog :title="title" :visible.sync="visible" width="60%">
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名:">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码:">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <el-form-item label="真实姓名:">
          <el-input v-model="form.realname" />
        </el-form-item>
        <el-form-item label="手机号:" type="telephone">
          <el-input v-model="form.telephone" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="onSubmitHandler">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import querystring from "querystring";
export default {
  methods: {
    loaddata() {
      request.get("http://[::1]:6677/customer/findAll").then(response => {
        this.costomers = response.data;
      });
    },
    toaddhdl() {
      this.title = "录入顾客信息";
      this.form = {
        type: "customer"
      };
      this.visible = true;
    },
    onSubmitHandler() {
      let url = "http://[::1]:6677/customer/saveOrUpdate";
      request({
        url,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: querystring.stringify(this.form)
      }).then(response => {
        this.visible = false;
        this.loaddata();
        this.$message({
          type: "success",
          message: response.message
        });
      });
    },
    todeletehandler(ids) {
      //first check,than get,finaly de
      this.$confirm("此操作将永久删除该条目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let url = "http://[::1]:6677/customer/deleteById?id=";
          request.get(url + ids).then(resp => {
            this.loaddata();
            this.$message({
              type: "success",
              message: resp.message
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除:: id=" + ids
          });
        });
    },
    toupdatehandler(roa) {
      this.title = "更新顾客信息";
      this.visible = true;
      this.form = roa;
    }
  },
  data() {
    return {
      title: "录入顾客信息",
      form: {
        type: "customer"
      },
      visible: false,
      costomers: []
    };
  },
  created() {
    this.loaddata();
  }
};
</script>
<style scoped>
</style>
