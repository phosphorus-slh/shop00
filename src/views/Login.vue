<template>
    <div class="login-container">
      <div class="login-box">
        <el-form ref="loginFormRef" label-width="0px" class="login-form" :model="loginForm" :rules="LoginRules">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="el-icon-s-custom"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="el-icon-user-solid" type="password"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
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
            {min:4,max:6,message: '长度在4~6之间',trigger:'blur'}
          ],
          password:[
            {required:true,message:'请输入密码',trigger:'blur'},
            {min:6,max:15,message:'长度在6~15之间',trigger: 'blur'}
          ]
        }
      }
    },
    methods:{
      resetLoginForm(){
        //通过ref获取el-form组件的实例对象，调用实例里面的方法
        this.$refs.loginFormRef.resetFields();
      },
      login(){
        this.$refs.loginFormRef.validate( async valid =>{
          if(!valid) return;
          const {data:res} = await this.$http.post('login',this.loginForm);
          //console.log(res);
          if(res.meta.status !==200){
            return this.$message.error('登录失败')
          }else{
            //console.log(res.data.token)
            this.$message.success('登录成功')
            window.sessionStorage.setItem('token',res.data.token);
            this.$router.push('/home');
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .login-container{
    background-color: #2b4b6b;
    height: 100%;
    .login-box{
      width: 450px;
      height: 300px;
      position: absolute;
      top:50%;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: white;
    }
  }
  .login-form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 40px;
    box-sizing: border-box;
  }
  .btns{
    display: flex;
    justify-content: center;
  }
</style>
