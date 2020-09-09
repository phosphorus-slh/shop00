<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" stripe border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom','vcenter',index1 === 0?'bdtop':'']" v-for="(item1,index1) in scope.row.children" :key="item1.id">
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="['bdbottom','vcenter',index2 === 0?'bdtop':'']" v-for="(item2,index2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag closable type="success" @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable type="warning" v-for="(item3,index3) in item2.children" :key="item3.id" @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button  size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showRightsDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--权限设置对话框 -->
    <el-dialog title="分配权限" :visible.sync="rightsDialogVisible" width="50%" @close="rightsDialogClosed">
      <el-tree ref="treeRef" :data="rightsList" :props="treeProps" node-key="id" :default-checked-keys="defKeys" default-expand-all show-checkbox></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="allotRights">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Roles",
    data(){
      return{
        rolesList:[],
        rightsList:[],
        //即将分配权限的角色id
        roleId:'',
        rightsDialogVisible:false,
        treeProps:{
          children:'children',
          label:'authName'
        },
        defKeys:[]
      }
    },
    created() {
      this.getRolesList();
    },
    methods: {
      async getRolesList() {
        const {data: res} = await this.$http.get('roles')
        if (res.meta.status !== 200) {
          return this.$message.error('获取角色列表失败')
        } else {
          this.rolesList = res.data;
        }
      },
      async removeRightById(role, rightId) {
        const confirmResult = await this.$confirm('此操作将永久删除该', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info('取消了删除')
        } else {
          const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除权限失败')
          } else {
            this.$message.success('删除权限成功')
            role.children = res.data
          }
        }
      },
      async showRightsDialog(role) {
        this.roleId =role.id
        const {data: res} = await this.$http.get('rights/tree')
        if (res.meta.status !== 200) {
          return this.$message.error('获取权限数据失败')
        } else {
          this.rightsList = res.data;
          //递归获取三级权限id
          this.getLeafKeys(role, this.defKeys)
          this.rightsDialogVisible = true
        }
      },
      getLeafKeys(node, arr) {
        //通过递归获取角色下三级权限id保存到defKeys数组中
        if (!node.children) {
          return arr.push(node.id)
        }
        node.children.forEach(item => {
          this.getLeafKeys(item, arr)
        })
      },
      //处理关闭对话框清空defKeys数组
      rightsDialogClosed() {
        this.defKeys = []
      },
      async allotRights(){
        const keys =[
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr =keys.join(',');
        const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
        if(res.meta.status!==200){
          return this.$message.error('分配权限失败')
        }else{
          this.$message.success('分配权限成功');
          this.getRolesList();
          this.rightsDialogVisible =false
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-tag{
    margin: 7px;
  }
  .bdtop{
    border-top: 1px solid #eee;
  }
  .bdbottom{
    border-bottom: 1px solid #eee;
  }
  .vcenter{
    display: flex;
    align-items: center;
  }
</style>
