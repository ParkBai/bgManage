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
      <el-row :gutter="20">
        <el-col :span='16'>
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserLists">
            <el-button slot="append" icon="el-icon-search" @click="getUserLists"></el-button>
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button type="primary" @click="addUserVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="userLists" stripe border>
        <!-- prop指定对应的数据属性 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
        <template slot-scope="scope">

          <!-- scope.row拿到这一行的数据 -->
           <el-switch
            v-model="scope.row.mg_state"
            active-color="#218c74"
            inactive-color="#b33939"
            @change="updateStatus(scope.row)"
            >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">     
          <el-button type="primary" icon="el-icon-edit" size="mini" 
                     @click="editUserDialog(scope.row.id)">
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" 
                     @click="deleteUserById(scope.row.id)">
          </el-button>
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button> 
          </el-tooltip>
        </template>
      </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户提示框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserVisible"
      width="40%"
      @close="clearForm">
      <el-form :model="addUser" :rules="addUserRules" ref="addUserRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUser.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserVisible = false" class="cancel">取 消</el-button>
        <el-button type="primary" @click="addUserValidate" class="right">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editdialogVisible"
      width="30%"
      @click="resetEditForm"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input type="text" v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input type="text" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false" class="cancel">取 消</el-button>
        <el-button type="primary" @click="editUserInfo" class="right">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="30%"
      @close="setRoleDialogClose"
    >
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="chooseRoleId" placeholder="请选择角色">
            <el-option
              v-for="item in rolesLists"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSelectedRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name:'Users',
  data() {
    var checkEmail = (rule, value, callback) => {
       const reg = /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z]{2,4}$/
       if (reg.test(value)) {
          callback()
        }else {
         callback(new Error('邮箱格式不正确'))
        }
      }

    var checkMobile = (rule, value, callback) => {
      const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (reg.test(value)) {
        callback()
      }else {
        callback(new Error('手机号码格式不正确'))
      }
    }
    return {
      queryInfo:{
        query:'',
        // 当前页数
        pagenum:1,
        // 每页显示几条数据
        pagesize:2
      },

      userLists:[],

      total:0,

      // 添加用户的显示和隐藏
      addUserVisible:false,

      // 添加用户表单及规则
      addUser:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },

      addUserRules:{
        username:[
          { required: true, message: 'please input your username', trigger: 'blur' },
          { min: 5, max: 10, message: 'between 5 and 10 words', trigger: 'blur' }
        ],
        password:[
          { required: true, message: 'please input your password', trigger: 'blur' },
          { min: 6, max: 15, message: 'between 6 and 15 words', trigger: 'blur' }
        ],
        email:[
          { required: true, message: 'please input your email', trigger: 'blur' },
          {validator:checkEmail,trigger:'blur'}
        ],
        mobile:[
          { required: true, message: 'please input your mobile', trigger: 'blur' },
          {validator:checkMobile,trigger:'blur'}
        ]
      },

      // 编辑对话框是否显示
      editdialogVisible:false,

      // 查询到用户信息对象
      editForm:{},

      editFormRules:{
        email:[
          { required: true, message: 'please edit your email', trigger: 'blur' },
          {validator:checkEmail,trigger:'blur'}
        ],
        mobile:[
          { required: true, message: 'please edit your mobile', trigger: 'blur' },
          {validator:checkMobile,trigger:['blur','change']}
        ]
      },

      // 分配角色对话框显示
      setRoleDialogVisible:false,

      // 分配角色的用户信息
      userInfo:{},

      rolesLists:[],

      // 选中的新角色id
      chooseRoleId:{}

    }
  },

  created(){
    this.getUserLists()
  },

  methods: {
    async getUserLists(){
      const {data:res} = await this.$http.get('users',{params:this.queryInfo})
       if(res.meta.status !== 200) return this.$message.error({message:'request failed',customClass: 'message-error'})
       this.userLists = res.data.users
       this.total = res.data.total
       //console.log(res)
    },

    //一页几条展示的改变
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getUserLists()
    },

    // 页码值改变
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getUserLists()
    },

    // 修改用户状态
    async updateStatus(userInfo){
      const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if(res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error({message:'update Failed',customClass: 'message-error'})
      }
      this.$message.success({message:'update Succeed',customClass: 'message-success'})
    },

    // 表单关闭清空(重置)表单
    clearForm(){
      this.$refs.addUserRef.resetFields()
    },

    // 添加新用户前整体校验
    addUserValidate(){
      this.$refs.addUserRef.validate(async valid =>{
        if(!valid) return
        // 校验成功重发添加用户的网络请求
        const {data:res} = await this.$http.post('users',this.addUser)
        if(res.meta.status !==201) return this.$message.error({message:'add user failed',customClass: 'message-error'})

        this.$message.success({message:'add user Succeed',customClass: 'message-success'})
        this.addUserVisible = false
        this.getUserLists()
      })
    },

    // 请求保存用户对话框数据
    async editUserDialog(id){
      const {data:res} = await this.$http.get('users/'+id)
      if(res.meta.status !==200) return this.$message.error({message:'get user information failed',customClass: 'message-error'})
      
      this.editForm = res.data
      this.editdialogVisible = true
    },

    // 重置编辑用户表单
    resetEditForm(){
      this.$refs.editFormRef.resetFields()
    },

    // 编辑用户校验及发送请求
    editUserInfo(){
      this.$refs.editFormRef.validate(async valid =>{
        if(!valid) return
        const {data:res} = await this.$http.put('users/' +this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile})
        if(res.meta.status !==200) return this.$message.error({message:'update user information failed',customClass: 'message-error'})      
        this.editdialogVisible = false
        this.getUserLists()
        this.$message.success({message:'update user Succeed',customClass: 'message-success'}) 
      })
    },

    // 删除用户
    async deleteUserById(id){
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).catch((err) => err);

        if(confirmResult!=='confirm') return this.$message({
            type: 'info',
            message: 'cancel delete user'
          }); 

        const {data:res} = await this.$http.delete('users/' +id)
        if(res.meta.status !==200) return this.$message.error({message:'delete user information failed',customClass: 'message-error'}) 
        this.$message.success({message:'delete user Succeed',customClass: 'message-success'}) 
        this.getUserLists()
    },

    // 分配角色
    async setRole(userInfo){
      this.userInfo = userInfo
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status !==200) return this.$message.error({message:'get roles list failed',customClass: 'message-error'})
      this.rolesLists = res.data
      this.setRoleDialogVisible = true
    },

    // 保存选择的分配角色
    async saveSelectedRoleInfo(){
      if(!this.chooseRoleId) return this.$message.error({message:'please choose role',customClass: 'message-error'})
      const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.chooseRoleId})
      if(res.meta.status !==200) return this.$message.error({message:'update role information failed',customClass: 'message-error'})
      this.$message.success({message:'update role information Succeed',customClass: 'message-success'}) 
      this.getUserLists()
      this.setRoleDialogVisible = false
    },

    // 监听分配角色对话框关闭后清空内容
    setRoleDialogClose(){
      this.chooseRoleId = '',
      this.userInfo = ''
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
  
  .el-pagination{
    margin-top: 15px;
  }
 
</style>
