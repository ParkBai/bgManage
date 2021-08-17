<template>
  <div class="login-container">
    <div class="login">
      <!-- 头像 -->
      <div class="avatar">
        <img src="../assets/logo.jpg" alt="logo">
      </div>
      <!-- 表单 -->
      <el-form ref='loginFormRef' :model="loginForm" :rules="loginFormRules" class="login-form" label-width="0px">
        <el-form-item prop='username'>
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop='password'>
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="login">Login</el-button>
          <el-button type="info" @click="resetLoginForm">Reset</el-button>
        </el-form-item>
      </el-form>
      
    </div>
  </div>
</template>

<script>
export default {
  name:'Login',
  data() {
    return {
      loginForm:{
        username:'admin',
        password:'123456'
      },
      loginFormRules:{
        username:[
          { required: true, message: 'please input your username', trigger: 'blur' },
          { min: 5, max: 10, message: 'between 5 and 10 words', trigger: 'blur' }
        ],
        password:[
          { required: true, message: 'please input your password', trigger: 'blur' },
          { min: 6, max: 15, message: 'between 6 and 15 words', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //表单项进行重置
    resetLoginForm(){
      this.$refs.loginFormRef.resetFields()
    },
    //登录校验
    login(){
      this.$refs.loginFormRef.validate(async valid=>{
        if(!valid) return
        const {data:res} = await this.$http.post('login',this.loginForm)
        if(res.meta.status !== 200) return this.$message.error({message:'Login failed',customClass: 'message-error'})
        this.$message.success({message:"login successful",duration:300,customClass: 'message-success'})
        
        window.sessionStorage.setItem('token',res.data.token)
        //编程式导航跳转到后台主页
        this.$router.push('/home')
      })
    }
  },
}
</script>

<style scoped>
  .login-container{
    position: relative;
    background-color: #662323;
    height: 100%;
  }

  .login-container .login{
    width:450px;
    height:300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }

  .login-container .login .avatar{
    width: 130px;
    height: 130px;
    border:1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    
  }

  .login-container .login .avatar img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .login-container .login .login-form{
    position: absolute;
    bottom:-25px;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }

  .login-container .login .login-form .btn{
    display: flex;
    justify-content: space-around;
    margin-top: 30px;
  }

    /* /deep/深穿透 */
  .login-container .login-form /deep/.el-input__inner:focus {
    border-color:rgb(59, 59, 59);
    box-shadow: 0 0 5px rgb(59, 59, 59);
  }

  .login-container .login-form  .el-button--primary{
    background-color: rgb(155, 62, 62);
    border-color:rgb(151, 49, 49);
    box-shadow: 0 0 2px rgb(122, 2, 2); 
    margin-right: 40px;
  }

  .login-container .login-form  .el-button--info{
    background-color: rgb(59, 59, 59);
    border-color:rgb(8, 8, 8);
    box-shadow: 0 0 2px rgb(8, 8, 8);
  }

  .login-container .login-form  .el-button--primary:hover{
    background-color: rgb(122, 2, 2);
  }

  .login-container .login-form  .el-button--info:hover{
    background-color: rgb(8, 8, 8);
  }

  
</style>>

<style>
  .el-message.message-success{
    background-color: rgb(42, 75, 117);
    border-color: darkblue;
  }
  
  .el-message.message-error{
    background-color: rgb(155, 62, 62);
    border-color: darkred;
  }

  .el-message.message-success .el-icon-success {
    color: #092d4b;
  }

  .el-message.el-message--success .el-message__content{
    color: #a8c2d8;
  }

  .el-message.message-error .el-icon-success {
    color: #7e2013;
  }

  .el-message.el-message--error .el-message__content{
    color: #e9c1b5;
  }
</style>