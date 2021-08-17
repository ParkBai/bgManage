<template>
  <div>
   <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-button  icon="el-icon" size="normal" @click="addRolesVisible=true">添加角色</el-button>
      <el-table :data="rolesLists" stripe border >
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 栅格布局 -->
            <el-row v-for="(item1,l1) in scope.row.children" :key='item1.id'
                    :class="['bbottom',l1===0 ? 'btop' :'','vcenter']">
              <!-- 渲染一级权限 -->
              <el-col :span="4">
                <el-tag type="success" closable
                            @close="removeItemById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二三级权限 -->
              <el-col :span="20">
                <el-row v-for="(item2,l2) in item1.children" :key='item2.id'
                        :class="[l2===0 ? '' :'btop','vcenter']">
                  <el-col :span="6">
                    <el-tag type="warning" closable
                            @close="removeItemById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="danger" 
                            v-for="(item3,l3) in item2.children" 
                            :key='item3.id'
                            closable
                            @close="removeItemById(scope.row,item3.id)"
                            >
                            {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="240px">
          <!-- 因为是自定义要渲染成什么样子,所以用作用域插槽 -->
          <template slot-scope="scope">  
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="medium" 
                      @click="editRoles(scope.row.id)">
            </el-button>
            </el-tooltip>  

            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="medium" 
                     @click="DeleteRoles(scope.row.id)">
            </el-button>
            </el-tooltip> 
            
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="medium" @click="showPowerDialog(scope.row)"></el-button> 
            </el-tooltip>
        </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色信息 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesVisible"
      width="40%"
      @close="clearForm">
      <el-form :model="addRoles" :rules="addRolesRules" ref="addRolesRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input type="text" v-model="addRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesVisible = false" class="cancel">取 消</el-button>
        <el-button type="primary" @click="addRoleValidate" class="right">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="editdialogVisible"
      width="30%"
      @click="resetEditForm"
    >
      <el-form :model="editForm" :rules="addRolesRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色信息" prop="roleName">
          <el-input type="text" v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input type="text" v-model="editForm.roleDesc"></el-input>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false" class="cancel">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo" class="right">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="editPowerdialogVisible"
      width="30%"
      @close="setPowerDialog"
    >
    <!-- 树形控件 -->
      <el-tree :data="powerLists" 
               :props="treeProps" 
               show-checkbox
               node-key='id'
               default-expand-all
               :default-checked-keys="dckPower"	
               ref="treePower"
      >
      </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editPowerdialogVisible = false" class="cancel">取 消</el-button>
        <el-button type="primary" @click="assignPower" class="right">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:"Roles",
  data() {
    return {
      rolesLists:[],

      // 用户表单是否显示
      addRolesVisible:false,

      addRoles:{
        roleName:'',
        roleDesc:''
      },
      addRolesRules:{
        roleName:[
          { required: true, message: 'please input your rolename', trigger: 'blur' },
          { min: 2, max: 6, message: 'between 2 and 6 words', trigger: 'blur' }
        ],
        roleDesc:[
          { required: true, message: 'please input your roledesc', trigger: 'blur' },
          { min: 2, max: 8, message: 'between 2 and 8 words', trigger: 'blur' }
        ]
      },

      // 编辑角色对话框显示与否
      editdialogVisible:false,

      editForm:{},

      // 设置权限对话框显示
      editPowerdialogVisible:false,
      // 所以权限数据的对象
      powerLists:{},

      // 树形控件的属性绑定对象
      treeProps: {
          // 以什么来嵌套的
          children: 'children',
          // 展示的名字
          label: 'authName'
        },

      // 默认选择权限
      dckPower:[],

      // 分配权限的角色id
      roleId:''
    }
  },
  created(){
    this.getRolesLists()
  },
  methods: {
    async getRolesLists(){
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status !==200) return this.$message.error({message:'get roles list failed',customClass: 'message-error'})
      this.rolesLists = res.data
    },

    // 表单关闭清空(重置)表单
    clearForm(){
      this.$refs.addRolesRef.resetFields()
    },

    // 添加角色表单验证
    addRoleValidate(){
      this.$refs.addRolesRef.validate(async valid=>{
        if(!valid) return
         // 校验成功重发添加角色的网络请求
        const {data:res} = await this.$http.post('roles',this.addRoles)
        if(res.meta.status !==201) return this.$message.error({message:'add role failed',customClass: 'message-error'})

        this.$message.success({message:'add role Succeed',customClass: 'message-success'})
        this.addRolesVisible = false
        this.getRolesLists()
      })
    },

    //请求保存角色对话框数据
    async editRoles(id){
      const {data:res} = await this.$http.get('roles/'+id)
      if(res.meta.status !==200) return this.$message.error({message:'get role information failed',customClass: 'message-error'})
      
      //console.log(res)
      this.editForm = res.data
      this.editdialogVisible = true
    },

    // 打开输入后不该则清空
    resetEditForm(){
      this.$refs.editFormRef.resetFields()
    },

    // 编辑角色校验及发送请求
    editRoleInfo(){
      this.$refs.editFormRef.validate(async valid =>{
        if(!valid) return
        const {data:res} = await this.$http.put('roles/' +this.editForm.roleId,{roleName:this.editForm.roleName,roleDesc:this.editForm.roleDesc})
        if(res.meta.status !==200) return this.$message.error({message:'update role information failed',customClass: 'message-error'})      
        this.editdialogVisible = false
        this.getRolesLists()
        this.$message.success({message:'update role Succeed',customClass: 'message-success'}) 
      })
    },

    // 删除角色
    async DeleteRoles(id){
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).catch((err) => err);

        if(confirmResult!=='confirm') return this.$message({
            type: 'info',
            message: 'cancel delete role'
          }); 

        const {data:res} = await this.$http.delete('roles/' +id)
        if(res.meta.status !==200) return this.$message.error({message:'delete role information failed',customClass: 'message-error'}) 
        this.$message.success({message:'delete role Succeed',customClass: 'message-success'}) 
        this.getRolesLists()
    },

    // 删除权限项
    async removeItemById(role,itemId){
      const confirmResult = await this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).catch((err) => err);

        if(confirmResult!=='confirm') return this.$message({
            type: 'info',
            message: 'cancel delete powerItem'
          }); 
        const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${itemId}`)
        if(res.meta.status !==200) return this.$message.error({message:'delete item information failed',customClass: 'message-error'}) 

        this.$message.success({message:'delete item Succeed',customClass: 'message-success'}) 
        // 避免页面重新渲染感官不好
        role.children = res.data
    },

    // 展示权限对话框
    async showPowerDialog(role){
      this.roleId = role.id

      const {data:res} = await this.$http.get('rights/tree')
      if(res.meta.status !==200) return this.$message.error({message:'delete power information failed',customClass: 'message-error'}) 
      // 获取到的数据保存在data中
      this.powerLists = res.data
      this.getRootKeys(role,this.dckPower)
      this.editPowerdialogVisible = true
    },

    // 递归拿到三级项目id
    getRootKeys(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }

      node.children.forEach(node => {
        this.getRootKeys(node,arr)
      });
    },

    // 清空dckPower，要不然之后的分配权限id会越来越多，把之前的id也算上了
    setPowerDialog(){
      this.dckPower = []
    },

    // 分配权限
    async assignPower(){
      const keys = [
        ...this.$refs.treePower.getCheckedKeys(),
        ...this.$refs.treePower.getHalfCheckedKeys()
      ]

      const keyStr = keys.join(',')

      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:keyStr})
      if(res.meta.status !==200) 
        return this.$message.error({message:'assign power failed',customClass: 'message-error'}) 
      
      this.$message.success({message:'assign power Succeed',customClass: 'message-success'}) 
      this.getRolesLists()
      this.editPowerdialogVisible = false
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
 
  .el-tag{
    margin: 10px;
  }

  .btop{
    border-top: 1px solid rgb(224, 224, 224);
  }

  .bbottom{
    border-bottom: 1px solid rgb(224, 224, 224);
  }

  .vcenter{
    display: flex;
    align-items: center;
  }
  
</style>
