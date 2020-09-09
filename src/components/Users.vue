<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/'}">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/'}">用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片试图区域 -->
    <el-card>
      <!--搜索添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query"
                    @clear="getUserList" :clearable="true">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户列表区 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
<!--            {{ scope.row.mg_state}}-->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false" >
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRoleDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[1,2,5,10]"
                     :page-size="queryInfo.pagesize"
                     layout="total,sizes,prev,pager,next,jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"
      label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addUser">确定</el-button>
      </span>
    </el-dialog>
    <!--更新用户信息对话框 -->
    <el-dialog title="提示" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef"
               label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editUserInfo">确定</el-button>
      </span>
    </el-dialog>
    <!--分配角色对话框 -->
    <el-dialog title="提示" :visible.sync="setRoleVisible" width="50%" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="分配角色名称">
            <el-option v-for="item in rolesList" :key="item.id"
                       :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Users",
    data(){
      var checkEmail =(rule,value,cb) =>{
        const regEmail =/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if(regEmail.test(value)){
          return cb()
        }else{
          cb(new Error('请输入合法的邮箱'))
        }
      }
      var checkMobile =(rule,value,cb) =>{
        const regMobile =/^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if(regMobile.test(value)){
          return cb()
        }else{
          cb(new Error('请输入正确的手机号'))
        }
      }
      return{
        queryInfo:{
          query:'',
          pagenum:1,
          pagesize:5
        },
        userList:[],
        rolesList:[],
        total:0,
        //控制添加对话框的显示与隐藏
        addDialogVisible:false,
        editDialogVisible:false,
        addForm:{
          username:'',
          password:'',
          email:'',
          mobile:''
        },
        addFormRules:{
          username:[
            {required:true,message:'请输入用户名',trigger:'blur'},
            {min:3,max:10,message:'用户名长度在3~10之间',trigger:'blur'}
          ],
          password:[
            {required:true,message:'请输入密码',trigger:'blur'},
            {min:6,max:15,message:'密码长度在6~15之间',trigger:'blur'}
          ],
          email:[
            {required:true,message:'请输入邮箱',trigger:'blur'},
            {validator:checkEmail,trigger: 'blur'}
          ],
          mobile:[
            {required:true,message:'请输入手机号',trigger:'blur'},
            {validator:checkMobile,trigger:'blur'}
          ]

        },
        editForm:{},
        editFormRules:{
          email:[
            {required:true,message:'请输入邮箱',trigger:'blur'},
            {validator:checkEmail,trigger: 'blur'}
          ],
          mobile:[
            {required:true,message:'请输入手机号',trigger:'blur'},
            {validator:checkMobile,trigger:'blur'}
          ]
        },
        setRoleVisible:false,
        //需要被分配角色的用户信息
        userInfo:{},
        selectedRoleId:''
      }
    },
    created() {
      this.getUserList()
    },
    methods:{
      async getUserList(){
        const {data:res} = await this.$http({
          url:'users',
          method:'get',
          params:this.queryInfo
        })
        if (res.meta.status !==200){
          return this.$message.error('获取用户列表失败')
        }
        this.userList =res.data.users;
        this.total =res.data.total;
      },
      handleSizeChange(newSize){
        this.queryInfo.pagesize =newSize
        this.getUserList();
      },
      //监听页码
      handleCurrentChange(newPage){
        this.queryInfo.pagenum =newPage
        this.getUserList();
      },
       async userStateChanged(userInfo){
        const {data:res} = await this.$http({
          method:'put',
          url:`users/${userInfo.id}/state/${userInfo.mg_state}`
        })
         if(res.meta.status !==200){
           return this.$message.error('更新用户状态失败')
           userInfo.mg_state =!userInfo.mg_state;
         }else{
           this.$message.success('更新用户状态成功')
         }
      },
      addDialogClosed(){
        this.$refs.addFormRef.resetFields();
      },
      editDialogClosed(){
        this.$refs.editFormRef.resetFields();
      },
      addUser(){
        this.$refs.addFormRef.validate( async valid =>{
          if(!valid) return
          const {data:res} =await this.$http.post('users',this.addForm)
          //console.log(res)
          if(res.meta.status !==201){
             return this.$message.error('添加用户失败')
          }
          this.$message.success('添加用户成功')
          this.addDialogVisible =false
          this.getUserList()
        })
      },
      async showEditDialog(id){
        this.editDialogVisible =true
        const {data:res} =await this.$http.get('users/'+id)
        if(res.meta.status !==200){
          return this.$message.error('查询用户信息失败')
        }else{
          this.editForm =res.data
          console.log(this.editForm)
        }
      },
      editUserInfo(){
        this.$refs.editFormRef.validate( async valid =>{
          if(!valid) return
          //发起修改用户请求
          const {data:res} = await this.$http.put('users/'+this.editForm.id,{
            email:this.editForm.email,
            mobile:this.editForm.mobile
          })
          if(res.meta.status !==200){
            return this.$message.error('更新用户信息失败')
          }else{
            this.editDialogVisible = false;
            this.getUserList();
            this.$message.success('更新用户信息成功')
          }
        })
      },
      async removeUserById(id){
        const confirmResult = await this.$confirm('此操作将永久删除该用户，是否继续?','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).catch(err => err)
         console.log(confirmResult)
        if(confirmResult !=='confirm'){
          return this.$message.info('已取消删除用户')
        }
        const {data:res} = await this.$http.delete('users/'+id)
        if(res.meta.status !==200){
          return this.$message.error('删除用户失败')
        }else{
          this.$message.success('删除用户成功')
          this.getUserList()
        }
      },
      async setRoleDialog(userInfo){
        this.userInfo = userInfo
        //在展示对话框之前获取所有的角色列表
        const {data:res} = await this.$http.get('roles')
        if(res.meta.status!==200){
          return this.$message.error('获取角色列表失败')
        }
        this.rolesList =res.data
        this.setRoleVisible =true;
      },
      //确定分配角色
      async saveRoleInfo(){
        if(!this.selectedRoleId){
          return this.$message.error('请选择分配角色名称')
        }
        const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
          rid:this.selectedRoleId
        })
        if(res.meta.status!==200){
          return  this.$message.error('分配角色失败')
        }else{
          this.$message.success('分配角色成功')
          this.getUserList();
          this.setRoleVisible =false
        }
      },
      //监听分配角色框的关闭事件
      setRoleDialogClosed(){
        this.selectedRoleId ='';
        this.userInfo ={}
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
