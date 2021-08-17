<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row>
        <el-col :span='12'>
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
          <!-- 表格 -->
      <el-table :data="orderList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_id" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <div>
              <el-tag type="warning" v-if="scope.row.pay_status == '0'">未付款</el-tag>
              <el-tag type="success" v-else>已付款</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            <div>
              {{scope.row.create_time | dateFormat}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">     
            <el-button type="primary" icon="el-icon-edit" size="mini" 
                      @click="editAddress">
            </el-button>
            <el-button type="success" icon="el-icon-location" size="mini" 
                      @click="showProgress">
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 7, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

      <!-- 编辑地址对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="editAddressDialogVisible"
        width="40%"
        @close="dialogClosed"
        >
        <el-form :model="editAddressForm" :rules="editAddressFormRules" ref="editAddressFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              v-model="editAddressForm.address1"
              :options="cityData"
              :props="{ expandTrigger: 'hover' }"
              style="width:100%"
             >
            </el-cascader>
          </el-form-item>
          <el-form-item label="具体地址" prop="address2">
            <el-input v-model="editAddressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editAddressDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editAddressDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 物流对话框 -->
      <el-dialog
        title="物流进度"
        :visible.sync="progressDialogVisible"
        width="40%"
      >
        <!-- 时间线 -->
         <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in goodsProgress"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'

export default {
  name:'Orders',
  data() {
    return {
      queryInfo:{
      query:'',
      // 当前页数
      pagenum:1,
      // 每页显示几条数据
      pagesize:5
    },

      orderList:[],

      total:0,

      editAddressDialogVisible:false,

      editAddressForm:{
        address1:[],
        address2:''
      },

      editAddressFormRules:{
       address1:[
          { required: true, message: 'please choose your address', trigger: 'blur' },
    
        ],
        address2:[
          { required: true, message: 'please choose your address', trigger: 'blur' },
          
        ],
      },
      cityData,

      progressDialogVisible:false,
      goodsProgress:[
        {
          "time": "2018-05-10 09:39:00",
          "ftime": "2018-05-10 09:39:00",
          "context": "已签收,感谢使用顺丰,期待再次为您服务",
          "location": ""
        },
        {
          "time": "2018-05-10 08:23:00",
          "ftime": "2018-05-10 08:23:00",
          "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          "location": ""
        },
        {
          "time": "2018-05-10 07:32:00",
          "ftime": "2018-05-10 07:32:00",
          "context": "快件到达 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-10 02:03:00",
          "ftime": "2018-05-10 02:03:00",
          "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-09 23:05:00",
          "ftime": "2018-05-09 23:05:00",
          "context": "快件到达 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 21:21:00",
          "ftime": "2018-05-09 21:21:00",
          "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 13:07:00",
          "ftime": "2018-05-09 13:07:00",
          "context": "顺丰速运 已收取快件",
          "location": ""
        },
        {
          "time": "2018-05-09 12:25:03",
          "ftime": "2018-05-09 12:25:03",
          "context": "卖家发货",
          "location": ""
        },
        {
          "time": "2018-05-09 12:22:24",
          "ftime": "2018-05-09 12:22:24",
          "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          "location": ""
        },
        {
          "time": "2018-05-08 21:36:04",
          "ftime": "2018-05-08 21:36:04",
          "context": "商品已经下单",
          "location": ""
        }
      ]
    }
  },

  created() {
    this.getOrdersList()
  },

  methods: {
    async getOrdersList(){
      const {data:res} = await this.$http.get('orders',{params:this.queryInfo})
      if(res.meta.status !== 200) return this.$message.error({message:'get orderslist failed',customClass: 'message-error'})
      this.orderList = res.data.goods
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

    editAddress(){
      this.editAddressDialogVisible = true
    },

    dialogClosed(){
      this.$refs.editAddressFormRef.resetFields()
    },

    async showProgress(){ //接口崩了
      // const {data:res} = await this.$http.get('/kuaidi/1106975712662')
      // if(res.meta.status !==200) return this.$message.error({message:'get goods progress failed',customClass: 'message-error'})
      // this.goodsProgress = res.data
      this.progressDialogVisible = true
      //console.log(this.goodsProgress)
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