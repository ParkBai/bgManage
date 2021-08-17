<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="注意: 只允许第三级分类设置相关参数!"
        type="warning"
        :closable="false"
        show-icon>
      </el-alert>

      <el-row>
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            ref="cascaderHandleRef"
            v-model="selectedCartKeys"
            :options="cateList"
            :props="cascaderProps"
            @change="CateChange"
          >
        </el-cascader>
        </el-col>
      </el-row>
      <!-- tab选项卡 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick" class="tab">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" class="right" size="small" :disabled="isBtnDisabled" @click="addParamsDialogVisible=true">添加参数</el-button>
          <!-- 动态数据表格 -->
          <el-table :data="activeTabData" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div>
                  <el-tag v-for="(item,ix) in scope.row.attr_vals" 
                          :key="ix" closable 
                          @close="removeTag(ix,scope.row)">
                          {{item}}
                  </el-tag>

                  <!-- 添加tag标签 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="tagInputRef"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else 
                             class="button-new-tag" 
                             size="small" 
                             @click="showInput(scope.row)">
                    + New Tag
                  </el-button>
                </div>
              </template>
            </el-table-column>

            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <!-- 因为是自定义要渲染成什么样子,所以用作用域插槽 -->
              <template slot-scope="scope">
                <div>
                  <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                    <el-button type="primary" icon="el-icon-edit" size="medium" 
                            @click="editParam(scope.row.attr_id)">
                    </el-button>
                  </el-tooltip>  

                  <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                    <el-button type="danger" icon="el-icon-delete" size="medium" 
                          @click="deleteParams(scope.row.attr_id)">
                    </el-button>
                  </el-tooltip> 
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" class="right" size="small" :disabled="isBtnDisabled" @click="addParamsDialogVisible=true">添加属性</el-button>
          <!-- 静态数据表格 -->
          <el-table :data="staticTabData" stripe border>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div>
                  <el-tag v-for="(item,ix) in scope.row.attr_vals" 
                          :key="ix" closable 
                          @close="removeTag(ix,scope.row)">
                          {{item}}
                  </el-tag>

                  <!-- 添加tag标签 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="tagInputRef"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else 
                             class="button-new-tag" 
                             size="small" 
                             @click="showInput(scope.row)">
                    + New Tag
                  </el-button>
                </div>
              </template>
            </el-table-column>

            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <!-- 因为是自定义要渲染成什么样子,所以用作用域插槽 -->
              <template slot-scope="scope">
                <div>
                  <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                    <el-button type="primary" icon="el-icon-edit" size="medium" 
                            @click="editParam(scope.row.attr_id)">
                    </el-button>
                  </el-tooltip>  

                  <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                    <el-button type="danger" icon="el-icon-delete" size="medium" 
                          @click="deleteParams(scope.row.attr_id)">
                    </el-button>
                  </el-tooltip> 
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addParamsDialogVisible"
      width="30%"
      @close="resetAddParamsDialog"
    >
      <!-- 添加参数表单 -->
      <el-form :model="addParamForm" :rules="addParamFormRules" ref="addParamFormRef" label-width="90px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false" class="cancel">取 消</el-button>
        <el-button type="primary" @click="addParamsDialog" class="right">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数对话框[与添加相似,一些功能复用] -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editParamsDialogVisible"
      width="30%"
      @close="resetEditParamsDialog"
    >
      <!-- 编辑参数表单 -->
      <el-form :model="editParamForm" :rules="addParamFormRules" ref="editParamFormRef" label-width="90px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false" class="cancel">取 消</el-button>
        <el-button type="primary" @click="editParams" class="right">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'Params',
  data() {
    return {
      cateList:[],

      //级联选择器双向绑定到数组
      selectedCartKeys:[],

       // 级联选择器的配置对象，必须有
      cascaderProps:{
        expandTrigger:'hover',
        label:"cat_name",
        value:"cat_id",
        children:'children',
        checkStrictly:'true'
      },

      // 当前活跃选项卡
      activeName:'many',

      // 动态参数数据
      activeTabData:[],

      //静态参数数据
      staticTabData:[],

      // 添加参数/属性对话框
      addParamsDialogVisible:false,

      // 添加参数表单对象数据
      addParamForm:{
        attr_name:''
      },

      // 添加参数表单对象规则
      addParamFormRules:{
        attr_name:[
          { required: true, message: 'please input params', trigger: 'blur' }
        ]
      },

      //修改参数对话框显示与否
      editParamsDialogVisible:false,

      // 编辑参数数据
      editParamForm:{},

      
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList(){
      const {data:res} = await this.$http.get('categories')
       if(res.meta.status !== 200) return this.$message.error({message:'get categories failed',customClass: 'message-error'})
       this.cateList = res.data
    },

    //级联选择器发生改变 
    CateChange(){
      // 选完之后自动关闭选择器
      this.$refs.cascaderHandleRef.dropDownVisible = false
      this.getParamsList()
      
    },

    async getParamsList(){
      // 选择的不是三级分类
      if(this.selectedCartKeys.length !== 3){
        this.selectedCartKeys = []
        this.staticTabData = []
        this.activeTabData = []
        return
      }

      // 发送请求获取参数列表
      const {data:res} = await this.$http.get(`categories/${this.CartId}/attributes`,{params:{sel:this.activeName}})
      if(res.meta.status !== 200) return this.$message.error({message:'get params failed',customClass: 'message-error'})
      
      // 遍历数据拿到attr_vals数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []

        // 解决点击添加tag联动其他想都显示文本框和数据的问题
        item.inputVisible = false
        item.inputValue = ''
      });
      //console.log(res.data)
      // 判断是静态参数还是动态参数
      if(this.activeName === 'many'){
        this.activeTabData = res.data
        
      }else{
        this.staticTabData = res.data
      }
    },

    // 选项卡点击后
    handleTabClick(){
      this.getParamsList()
    },

    // 关闭对话框重置
    resetAddParamsDialog(){
      this.$refs.addParamFormRef.resetFields()
    },

    // 添加属性并发送请求
    async addParamsDialog(){
      const {data:res} = await this.$http.post(`categories/${this.CartId}/attributes`,{attr_name:this.addParamForm.attr_name, attr_sel:this.activeName})
      if(res.meta.status !== 201) return this.$message.error({message:'add params failed',customClass: 'message-error'})
      this.$message.success({message:'add params succeed',customClass: 'message-success'})
      this.addParamsDialogVisible = false
      this.getParamsList()
    },

    // 清空编辑对话框
    resetEditParamsDialog(){
      this.$refs.editParamFormRef.resetFields()
    },

    // 显示编辑参数对话框并保存数据
    async editParam(id){
      const {data:res} = await this.$http.get(`categories/${this.CartId}/attributes/${id}`,{params:{attr_sel:this.activeName}})
      if(res.meta.status !== 200) return this.$message.error({message:'get params failed',customClass: 'message-error'})
      this.editParamForm = res.data
      this.editParamsDialogVisible = true
    },

    // 编辑参数并发送提交
    editParams(){
      this.$refs.editParamFormRef.validate(async valid=>{
        if(!valid) return
        const {data:res} = await this.$http.put(`categories/${this.CartId}/attributes/${this.editParamForm.attr_id}`,{attr_name:this.editParamForm.attr_name,attr_sel:this.editParamForm.attr_sel})
        if(res.meta.status !== 200) return this.$message.error({message:'update params failed',customClass: 'message-error'})
        this.$message.success({message:'update params succeed',customClass: 'message-success'})
        this.editParamsDialogVisible = false
        this.getParamsList()      
        
      })
    },

     // 删除参数
    async deleteParams(id){
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).catch((err) => err);

        if(confirmResult!=='confirm') return this.$message({
            type: 'info',
            message: 'cancel delete params'
          }); 

        const {data:res} = await this.$http.delete(`categories/${this.CartId}/attributes/${id}`)
        if(res.meta.status !==200) return this.$message.error({message:'delete params information failed',customClass: 'message-error'}) 
        this.getParamsList()
        this.$message.success({message:'delete params Succeed',customClass: 'message-success'}) 
    },

    // 控制iput触发时事件
    async handleInputConfirm(row){
      // 不合法则清空内容
      if(row.inputValue.trim().length === 0){
        row.inputValue = ''
        row.inputVisible = false
        return
      }

      // 内容合法
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false

      // 提交编辑tag参数
      this.saveTagValue(row)
    },

    // 保存tag到数据库
    async saveTagValue(row){
      const {data:res} = await this.$http.put(`categories/${this.CartId}/attributes/${row.attr_id}`,
        {
          attr_name:row.attr_name,
          attr_sel:row.attr_sel,
          attr_vals:row.attr_vals.join(' ')
        }
      )
      if(res.meta.status !== 200) return this.$message.error({message:'update tag failed',customClass: 'message-error'})
      this.$message.success({message:'update tag succeed',customClass: 'message-success'})
    },

    // 点击按钮展示输入框
    showInput(row){
      row.inputVisible = true
      this.$nextTick(_ => {
          this.$refs.tagInputRef.$refs.input.focus();
        });
    },

    // 删除tag
    removeTag(ix,row){
      row.attr_vals.splice(ix,1)
       this.saveTagValue(row)
    }
  },
  computed:{
    // 按钮及tab是否可用
    isBtnDisabled(){
      if(this.selectedCartKeys.length!==3) return true
      return false
    },

    // 获取三级Id
    CartId(){
      if(this.selectedCartKeys.length === 3) return this.selectedCartKeys[2]
      return null
    },

    // 标题是参数还是属性
    titleText(){
      if(this.activeName === 'many'){
        return '动态参数'
      }else{
        return '静态属性'
      }
    }
  }
}
</script>

<style scoped>
  .el-card{
    margin-top: 15px;
    background-color: rgb(202, 204, 203);
    box-shadow: 0 1px 1px rgb(228, 226, 245) !important;
  }

  .el-row{
    margin: 15px -10px;
  }

  span{
    margin:0 10px
  }


  .el-tag{
    margin-bottom:10px;
  }

  .input-new-tag{
    width: 120px;
  }
  
</style>
<style>
  .el-tabs__item.is-active{
    color: rgb(228, 112, 91) !important;
  }

  .el-tabs__item:hover{
    color: rgb(231, 73, 62) !important;
  }

  .el-tabs__active-bar{
    background-color: rgb(243, 124, 124) !important;
  }
</style>