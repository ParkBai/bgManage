<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-button  icon="el-icon" size="normal" @click="showAddCateDialog">添加分类</el-button>
      <tree-table class="treetable"
        :data="cateList" 
        :columns="columns" 
        :selection-type="false"
        :expand-type="false"
        border
        show-index
        index-text="#">
        <!-- 是否有效 -->
        <template slot-scope="scope" slot="isok">
          <div>
            <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:#e55039"></i>
            <i class="el-icon-error" v-else></i>
          </div>
        </template>
        <!-- 排序 -->
        <template slot-scope="scope" slot="order">
          <div>
              <el-tag type="success" v-if="scope.row.cat_level == '0'">level 1</el-tag>
              <el-tag type="warning" v-else-if="scope.row.cat_level == '1'">level 2</el-tag>
              <el-tag type="danger" v-else>level 3</el-tag>
            </div>
        </template>

        <!-- 操作 -->
        <template slot-scope="scope" slot="operate">  
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="medium" @click="editCate(scope.row.cat_id)">
              </el-button>
            </el-tooltip>  

            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="medium" @click="deleteCate(scope.row.cat_id)"
                    >
            </el-button>
            </el-tooltip> 
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="this.queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total">
    </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCategoriesDialogVisible"
      width="40%"
      @close="resetAddCateDialog"
      >
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
         <el-cascader
         ref="cascaderHandleRef"
          v-model="selectedKeys"
          :options="ParentCateList"
          :props="cascaderProps"
          @change="parentCateChange"
          clearable
          >
        </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoriesDialogVisible = false" class="cancel">取 消</el-button>
        <el-button type="primary" @click="addCate" class="right">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog
      title="修改分类信息"
      :visible.sync="editCatedialogVisible"
      width="30%"
      @click="resetEditCateForm"
    >
      <el-form :model="editCateForm" :rules="addCateFormRules" ref="editCateFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input type="text" v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCatedialogVisible = false" class="cancel">取 消</el-button>
        <el-button type="primary" @click="editCateInfo" class="right">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'Categories',
  data() {
    return {
      // 请求参数
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      // 商品列表
      cateList:[],
      total:0,

      columns:[
        {
          label:'分类名称',
          prop:'cat_name'
        },
        {
          label:'是否有效',
          // 将该列定义为模板列
          type:'template',
          template:'isok'
        },
        {
          label:'排序',
          // 将该列定义为模板列
          type:'template',
          template:'order'
        },
        {
          label:'操作',
          // 将该列定义为模板列
          type:'template',
          template:'operate'
        }
      ],

      // 添加分类对话框显示与否
      addCategoriesDialogVisible:false,

      // 添加分类的对象数据
      addCateForm:{
        cat_pid: 0,
        cat_name: "",
        // 默认添加一级
        cat_level: 0
      },

      addCateFormRules:{
        cat_name:[
          { required: true, message: 'please input your cat_name', trigger: 'blur' }
        ]
      },

      ParentCateList:[],

      // 级联选择器的配置对象，必须有
      cascaderProps:{
        expandTrigger:'hover',
        label:"cat_name",
        value:"cat_id",
        children:'children',
        checkStrictly:'true'
        
      },

      // 选择的父级id
      selectedKeys:[],

      // 编辑分类对象数据
      editCateForm:{},

      // 编辑分类对话框显示与否
      editCatedialogVisible:false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList(){
      const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
       if(res.meta.status !== 200) return this.$message.error({message:'get categories failed',customClass: 'message-error'})
       this.cateList = res.data.result
       this.total = res.data.total
      // console.log(this.cateList)
    },

    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },

    handleCurrentChange(newNum){
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },

    // 展示添加分类对话框
    showAddCateDialog(){
      this.getParentCateList()
      this.addCategoriesDialogVisible=true
    },

    // 获取父级列表
    async getParentCateList(){
      const {data:res} = await this.$http.get('categories',{params:{type:2}})
       if(res.meta.status !== 200) return this.$message.error({message:'get Parentcategories failed',customClass: 'message-error'})
       this.ParentCateList = res.data
       //console.log(res.data)
       
    },

    // 当父级id发生改变时
    parentCateChange(){
      this.$refs.cascaderHandleRef.dropDownVisible = false
      if(this.selectedKeys.length>0){
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }else{
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },

    // 添加分类
    addCate(){
      this.$refs.addCateFormRef.validate(async valid =>{
        if(!valid) return
        const {data:res} = await this.$http.post('categories',this.addCateForm)
        if(res.meta.status !==201) return this.$message.error({message:'add categories failed',customClass: 'message-error'})
        this.$message.success({message:'add categories succeed',customClass: 'message-success'})
        this.getCateList()
        this.addCategoriesDialogVisible = false
      })
    },

    // 清空添加分类对话框
    resetAddCateDialog(){
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },

    // 编辑分类清空
    resetEditCateForm(){
      this.$refs.editCateFormRef.resetFields()
    },

    //请求保存编辑分类对话框数据
    async editCate(id){
      const {data:res} = await this.$http.get('categories/'+id)
      if(res.meta.status !==200) return this.$message.error({message:'get categories information failed',customClass: 'message-error'})
      
      //console.log(res)
      this.editCateForm = res.data
      this.editCatedialogVisible = true
    },

    // 编辑分类校验及发送请求
    editCateInfo(){
      this.$refs.editCateFormRef.validate(async valid =>{
        if(!valid) return
        const {data:res} = await this.$http.put('categories/' +this.editCateForm.cat_id,{cat_name:this.editCateForm.cat_name})
        if(res.meta.status !==200) return this.$message.error({message:'update categories information failed',customClass: 'message-error'})      
        this.editCatedialogVisible = false
        this.getCateList()
        this.$message.success({message:'update categories Succeed',customClass: 'message-success'}) 
      })
    },

    // 删除分类
    async deleteCate(id){
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).catch((err) => err);

        if(confirmResult!=='confirm') return this.$message({
            type: 'info',
            message: 'cancel delete categories'
          }); 

        const {data:res} = await this.$http.delete('categories/' +id)
        if(res.meta.status !==200) return this.$message.error({message:'delete categories information failed',customClass: 'message-error'}) 
        this.getCateList()
        this.$message.success({message:'delete categories Succeed',customClass: 'message-success'}) 
        
    },

    
  },
}
</script>

<style scoped>
  .treetable{
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .el-card{
    margin-top: 15px;
    background-color: rgb(202, 204, 203);
    box-shadow: 0 1px 1px rgb(228, 226, 245) !important;
  }

  .el-cascader{
    width: 100%;
  }
</style>