<template>
  <el-container>
    <!-- 头部 -->
  <el-header>
    <div>
      <img src="../assets/logo.jpg" alt="logo">
      <span>后台管理系统</span>
    </div>
    <el-button type="info" @click="logout">Exit</el-button></el-header>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="collapseMenu">|||</div>
        <el-menu
        background-color="rgb(52, 53, 53)"
        text-color='#eee'
        active-text-color="#ffd04b"
        unique-opened
        :collapse='isCollapse'
        :collapse-transition='false'
        router
        :default-active="activePath">
        <!-- 一级菜单 -->
        <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
          <template slot="title">
            <i :class="icons[item.id]"></i>
            <span>{{item.authName}}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item 
          :index="'/' + subItem.path + ''" 
          v-for="subItem in item.children" 
          :key='subItem.id'
          @click="saveActivePath('/' + subItem.path + '')"
          >
            <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{subItem.authName}}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <!-- 主体 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  name:'Home',
  data() {
    return {
      menuList:[],
      icons:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
      },
      isCollapse:false,
      activePath:''
    }
  },
  created(){
    this.getMenuList(),
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList(){
      const {data:res} = await this.$http.get('menus')
      if(res.meta.status !== 200) return this.$message.error({message:res.meta.msg,customClass: 'message-error'})
      this.menuList = res.data
      //console.log(res)
    },
    collapseMenu(){
      this.isCollapse = !this.isCollapse
    },
    saveActivePath(activePath){
      window.sessionStorage.setItem('activePath',activePath)
    }
  },
  
}
</script>

<style scoped>
  .el-container{
    height: 100%;
  }

  .el-header{
    background-color: rgb(18, 15, 26);
    padding-left: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .el-header>div{
    display: flex;
    align-items: center;
  }

  .el-header img {
    width: 56px;
    height: 56px;
    border:1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    margin-top: 1px;
  }

  .el-header span{
    font-size: 20px;
    color: rgb(146, 5, 5);
    margin-left: 12px;
    
  }

  .el-aside{
    background-color: rgb(52, 53, 53);
  }

  .el-aside .el-menu{
    border-right: 0;
  }

  .el-aside .toggle-button{
    background-color: rgb(78, 77, 77);
    color: #eee;
    line-height: 24px;
    font-size: 12px;
    letter-spacing: 2px;
    cursor: pointer;
    text-align: center;
    font-weight: bold;
  }

  .el-main{
    background-color: rgb(141, 143, 145);
  }

  .iconfont {
    margin-right: 5px;
  }
</style>

<style>
  .el-message.message-error .el-icon-success {
    color: #7e2013;
  }

  .el-message.el-message--error .el-message__content{
    color: #e9c1b5;
  }
  
</style>