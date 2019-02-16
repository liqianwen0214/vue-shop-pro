<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="queryParams.query"
            :clearable="true"
            @clear="getUserInfos"
            @keyup.enter.native="getUserInfos"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 数据列表展示 -->
      <el-table :data="userInfos" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="140"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="130"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="120"></el-table-column>
        <el-table-column label="状态" width="70">
          <el-switch
            slot-scope="scope"
            v-model="scope.row.mg_state"
            @change="changeState(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="230">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          <el-tooltip content="分配角色" placement="top">
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
      <!-- 数据分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryParams.total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserInfos()
  },
  methods: {
    // 修改用户状态
    async changeState(id, state) {
      const { data: res } = await this.$http.put(`users/${id}/state/${state}`)
      if (res.meta.status !== 200) {
        return this.$message.error('修改用户状态失败')
      }
      this.$message({
        message: '修改状态成功',
        type: 'success',
        duration: 1500
      })
    },
    // 数据分页相关1
    // 每页信息条数变化回调函数处理
    handleSizeChange(val) {
      this.queryParams.pagesize = val
      this.getUserInfos()
    },
    handleCurrentChange(val) {
      this.queryParams.pagenum = val
      this.getUserInfos()
    },
    // 获得首屏用户数据
    async getUserInfos() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryParams
      })
      // 获取数据失败
      if (res.meta.status !== 200) {
        return this.$message.console.error(res.meta.msg)
      }
      // 丰富记录总条数变量
      this.queryParams.total = res.data.total
      // 把获得的用户数据赋予给userInfos成员
      this.userInfos = res.data.users
    }
  },
  data() {
    return {
      // 搜索关键字
      keywords: '',
      // 接受用户数据
      userInfos: [],
      // 定义获取用户数据用到的查询条件参数
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 3,
        total: 0
      }
    }
  },
  components: {}
}
</script>

<style scoped lang="less">
</style>
