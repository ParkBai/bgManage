<template>
  <div>
   <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span='16'>
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button type="primary" @click="addGoodsPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="goodsList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="110px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160px">
          <template slot-scope="scope">
            <div>
              {{scope.row.add_time | dateFormat}}
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">     
            <el-button type="primary" icon="el-icon-edit" size="mini" 
                      @click="editGoodsDialog(scope.row.goods_id)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" 
                      @click="deleteGoodsById(scope.row.goods_id)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name:'Lists',
  data() {
    return {
      queryInfo:{
        query:'',
        // 当前页数
        pagenum:1,
        // 每页显示几条数据
        pagesize:10
      },

      goodsList:[],

      total:0,
    }
  },

  created() {
    this.getGoodsList()
  },

  methods: {
    async getGoodsList(){
      const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
       if(res.meta.status !== 200) return this.$message.error({message:'get goodslist failed',customClass: 'message-error'})
       this.goodsList = res.data.goods
       this.total = res.data.total
    },

    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },

    handleCurrentChange(newNum){
      this.queryInfo.pagenum = newNum
      this.getGoodsList()
    },

    // 删除商品
    async deleteGoodsById(id){
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).catch((err) => err);

        if(confirmResult!=='confirm') return this.$message({
            type: 'info',
            message: 'cancel delete goods'
          }); 

        const {data:res} = await this.$http.delete('goods/' +id)
        if(res.meta.status !==200) return this.$message.error({message:'delete goods information failed',customClass: 'message-error'}) 
        this.$message.success({message:'delete goods Succeed',customClass: 'message-success'}) 
        this.getGoodsList()
    },

    //点击跳转到添加商品页面
    addGoodsPage(){
      this.$router.push('/goods/add')
    }
  },
}
</script>

<style scoped>
  .el-input{
    background-color: rgb(202, 204, 203);
  }
  .box-card /deep/.el-input__inner:focus{
    border-color:rgb(156, 156, 156);
  }
  .el-col .el-button{
    border-color: rgb(71, 70, 70);
    background-color: rgb(114, 113, 113);
  }
  .el-col .el-button:hover{
    background-color: rgb(63, 62, 62);
    border-color: rgb(71, 70, 70);
  }



</style>