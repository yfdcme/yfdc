<template>
  <div>
    <div>
      <el-button type="primary" @click="toaddhandl">添加</el-button>
      <el-button type="danger">批量删除</el-button>
    </div>
    <el-table :data="employees">
      <el-table-column label="编号" prop="id" />
      <el-table-column label="用户名" prop="username" />
      <el-table-column label="姓名" prop="realname" />
      <el-table-column label="性别" prop="gender" />
      <el-table-column label="联系方式" prop="telephone" />
      <el-table-column label="身份证号" prop="idCard" />
      <el-table-column label="银行卡号" prop="bankCard" />
      <el-table-column label="操作">
        <template v-slot="slot">
          <a href="#" @click.prevent="todeletehandler(slot.row.id)">删除</a>
          <a href="#" @click.prevent="toupdatehandler(slot.row)">修改</a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next" :total="50" />
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
        <el-form-item label="性别:">
          <el-radio-group v-model="form.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号:" type="telephone">
          <el-input v-model="form.telephone" />
        </el-form-item>
        <el-form-item label="身份证号:" type="telephone">
          <el-input v-model="form.idCard" />
        </el-form-item>
        <el-form-item label="银行卡号:" type="telephone">
          <el-input v-model="form.bankCard" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="tosubmithandler">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import querystring from 'querystring'
export default {
  data() {
    return {
      form: {
        type: 'waiter'
      },
      title: '录入员工信息',
      visible: false,
      employees: []
    }
  },
  created() {
    this.yfloadData()
  },
  methods: {
    yfloadData() {
      request.get('http://[::1]:6677/waiter/findAll').then(response => {
        this.employees = response.data
        console.log(this.employees)
      })
    },
    toaddhandl() {
      this.tile = '录入员工信息'
      this.visible = true
      this.form = { type: 'waiter' }
    },
    todeletehandler(ids) {
      // first check,than get,finaly de
      this.$confirm('此操作将永久删除该条目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const url = 'http://[::1]:6677/customer/deleteById?id='
          request.get(url + ids).then(resp => {
            this.$message({
              type: 'success',
              message: resp.message
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除:: id=' + ids
          })
        })
    },
    tosubmithandler() {
      const url = 'http://[::1]:6677/waiter/saveOrUpdate'
      request({
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: querystring.stringify(this.form)
      }).then(resp => {
        console.log(resp.message)
        this.visible = false
        this.yfloadData()
        this.$message({
          type: 'success',
          message: resp.message
        })
      })
    },
    toupdatehandler(ppp) {
      this.tile = '修改员工信息'
      this.visible = true
      this.form = ppp
    }
  }
}
</script>

<style scoped>
</style>
