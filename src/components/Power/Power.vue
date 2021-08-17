<template>
  <div>
   <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="powerLists" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="等级">
          <!-- 因为是自定义要渲染成什么样子,所以用作用域插槽 -->
          <template slot-scope="scope">
            <div>
              <el-tag type="success" v-if="scope.row.level == '0'">level 1</el-tag>
              <el-tag type="warning" v-else-if="scope.row.level == '1'">level 2</el-tag>
              <el-tag type="danger" v-else>level 3</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name:'Power',
  data() {
    return {
      powerLists:[]
    }
  },

  created(){
    this.getPowerLists()
  },

  methods: {
    // 获取权限列表
    async getPowerLists(){
      const {data:res} = await this.$http.get('rights/list')
      if(res.meta.status !==200) return this.$message.error({message:'get power list failed',customClass: 'message-error'})
      this.powerLists = res.data
    }
  },
}
</script>

<style scoped>
  .el-card{
    margin-top: 15px;
    background-color: rgb(202, 204, 203);
    box-shadow: 0 1px 1px rgb(228, 226, 245) !important;
  }
  
  

  .el-tag.el-tag--warning{
    background-color: #fce4a9;
    color:#ffae3d;
    border-color:#fdd889;
  }
   .el-tag.el-tag--danger{
     background-color: #f5a1a5;
     color:#f04867;
     border-color:#fa8288;
   }
</style>