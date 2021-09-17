<template>
  <div class="login-container">
    <div class="login-box">
      <el-form ref="loginFormRef"
               label-width="0px"
               class="login-form"
               :model="loginForm"
               :rules="LoginRules">
        <el-form-item>
          <el-input v-model="loginForm.username" prefix-icon="el-icon-s-custom"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="loginForm.password" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <div class="loginBtn" @click="handleLogin">Sign In</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data(){
    return{
      loginForm:{
        username:'admin',
        password:'123456'
      },
      LoginRules:{
        username:[
          {required:true,message:'请输入用户名',trigger:'blur'},
          {min:6,max:10,message:'用户名长度在6-10之间',trigger:'blur'}
        ],
        password:[
          {required:true,message:'请输入密码',trigger:'blur'},
          {min:6,max:10,message:'密码长度在6-10之间',trigger:'blur'}
        ]
      }
    }
  },
  methods:{
    handleLogin(){
      this.$refs.loginFormRef.validate(async valid => {
        if(!valid) return;
        const {data:res} =await this.$http.post('login',this.loginForm);
        // console.log(res)
        if(res.meta.status !== 200){
          return this.$message.error(res.meta.msg)
        }else{
          this.$message.success(res.meta.msg)
          window.sessionStorage.setItem('token',res.data.token);
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container{
  background-image: linear-gradient(to top, #99acbe 5%, #a8b3bf 20%,#cfd7dd);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  .login-box{
    min-width: 450px;
    min-height: 300px;
    background-color: rgba(0,0,0,0.05);
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    .el-form{
      margin: 30px;
      padding: 20px;
      .el-form-item{
        margin: 20px 50px 20px;
      }
    }
  }
}
.loginBtn{
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.05);
  border-radius: 8px;
  text-align: center;
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  font-size: 16px;
  cursor: pointer;
  &:hover{
    background-color: rgba(0,0,0,0.08);
  }
}
.btn{
  box-shadow: 1px 2px 4px rgba(0,0,0,0.3);
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  &:hover{
    transform: translateY(-2px);
  }
  &:active{
    transform: translateY(2px);
  }
  &::before,&::after
  {
    content: " ";
    width: 40px;
    height: 40px;
    position: absolute;
    top:0;
    left: 0;
    opacity: 0.5;
    background-color: rgba(255,255,255,0.1);
    filter: blur(30px);
    overflow: hidden;
    transform: skewX(-15deg) translateX(-100px);
  }
  &::after{
    width: 40px;
    left: -40px;
    background: rgba(255,255,255,0.3);
    filter: blur(5px);
  }
  &:hover{
    &::before{
      transition: 1s;
      transform: translateX(320px);
      opacity: 0.7;
    }
    &::after{
      transition: 1s;
      transform: translateX(320px);
      opacity: 1;
    }
  }
}

</style>
