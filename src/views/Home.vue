<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <span style="color: white;font-size: 35px">Logo</span>
        <span>后台电商管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ?'64px':'200px'">
        <!--侧边栏菜单 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          :default-active="activePath"
          :router="true"
          style="border-right: none"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EEF">
          <!-- 1及菜单-->
          <el-submenu v-for="item in menuList" :key="item.id" :index="item.id+''">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 2及菜单-->
            <el-menu-item @click="saveNavState('/'+subItem.path)" v-for="subItem in item.children" :key="subItem.id" :index="'/'+subItem.path">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Home",
    data(){
      return{
        menuList:[],
        iconObj:{
          '125':'el-icon-s-custom',
          '103':'el-icon-s-comment',
          '101':'el-icon-goods',
          '102':'el-icon-s-order',
          '145':'el-icon-s-data'
        },
        isCollapse:false,
        activePath:''
      }
    },
    created() {
      this.getMenuList();
      this.activePath =window.sessionStorage.getItem('activePath')
    },
    methods:{
      logout(){
        window.sessionStorage.clear();
        this.$router.push('/login')
      },
      //实现菜单的折叠展开
      toggleCollapse(){
        this.isCollapse =!this.isCollapse
      },
      saveNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath =activePath
      },
      //获取所有的菜单
      async getMenuList(){
        const {data:res} = await this.$http.get('menus');
        //console.log(res)
        if(res.meta.status !==200) return this.$message.error(res.meta.msg)
        this.menuList =res.data;
        //console.log(this.menuList)
      }
    }
  }
</script>

<style lang="less" scoped>
  .home-container{
    height: 100%;
  }
  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: white;
    font-size: 20px;
    >div{
      display: flex;
      align-items: center;
      span{
        margin-left: 15px;
      }
    }
  }
  .el-aside{
    background-color: #333744;
    transition: all 0.2s linear;
  }
  .el-main{
    background-color: rgba(221,221,221,1);
  }
  .toggle-button{
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: white;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;

  }
</style>
