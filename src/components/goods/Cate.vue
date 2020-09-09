<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/'}">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/'}">分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片试图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table class="treeTable" :data="cateList" :columns="columns" :selection-type="false"
      :expand-type="false" show-index index-text="#" border :show-row-hover="false">
        <template slot="isok" slot-scope="scope">
          <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color: green;font-size: 20px"></i>
          <i v-else class="el-icon-error" style="color: red;font-size: 20px"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level ===1" type="success" size="mini">二级</el-tag>
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
          <el-button size="mini"  type="danger" icon="el-icon-delete" @click="removeCateById(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum" :page-sizes="[1,2,5,10]" :page-size="queryInfo.pagesize"
                     layout="total,sizes,prev,pager,next,jumper" :total="total">
      </el-pagination>
    </el-card>

    <!--添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @closed="addCateDialogClosed">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
      <el-form-item label="分类名称：" prop="cat_name">
        <el-input v-model="addCateForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类：">
        <!-- options指定数据源-->
        <el-cascader expend-trigger="hover" :options="parentCateList" :props="cascaderProps"
                     v-model="selectedKeys" @change="parentCateChange" clearable change-on-select>
        </el-cascader>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addCate">确定</el-button>
      </span>
    </el-dialog>
    <!--修改分类 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="50%" @close="editCateDialogClosed">
      <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editCateName">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Cate",
    data(){
      return{
        cateList:[],
        total:0,
        queryInfo:{
          type:3,
          pagenum:1,
          pagesize:5
        },
        columns:[{
          label:'分类名称',
          prop:'cat_name'
        },{
          label:'是否有效',
          type:'template',
          template:'isok'
        },
          {
            label:'排序',
            type: 'template',
            template: 'order'
          },
          {
            label:'操作',
            type:'template',
            template:'opt'
          }],
        addCateDialogVisible:false,
        editCateDialogVisible:false,
        addCateForm:{
          cat_name:'',
          cat_id:0,
          cat_level:0
        },
        editCateForm:{
          cat_name:'',
          cat_id:0
        },
        editCateFormRules:{
          cat_name:[
            {required:true,message:'请输入分类名称',trigger:'blur'}
          ]
        },
        addCateFormRules:{
          cat_name:[
            {required:true,message:'请输入分类名称',trigger:'blur'}
          ]
        },
        parentCateList:[],
        cascaderProps:{
          value:'cat_id',
          label:'cat_name',
          children:'children'
        },
        //选中的父级分类的ID数组
        selectedKeys:[]
      }
    },
    created() {
      this.getCateList()
    },
    methods:{
      handleSizeChange(newSize){
        this.queryInfo.pagesize =newSize
        this.getCateList()
      },
      handleCurrentChange(newPage){
        this.queryInfo.pagenum =newPage
        this.getCateList()

      },
      async getCateList(){
        const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
        if(res.meta.status !==200){
          return this.$message.error('获取商品分类失败')
        }else{
          this.cateList =res.data.result;
          this.total =res.data.total;
          //console.log(this.cateList)
        }
      },
      showAddCateDialog(){
        //先获取父级分类列表
        this.getParentCateList()
        this.addCateDialogVisible =true;
      },
      //获取父级分类的数据列表
      async getParentCateList(){
        const{data:res} =await this.$http.get('categories',{params:{type:2}})
        if(res.meta.status!==200){
          return this.$message.error('获取父级分类失败')
        }else{
          this.parentCateList =res.data;
          console.log(this.parentCateList)
        }
      },
      //选择项变化触发函数
      parentCateChange(){
        //如果selectKeys数据中length大于0，证明选择了父级分类
        if(this.selectedKeys.length>0){
          this.addCateForm.cat_pid =this.selectedKeys[this.selectedKeys.length-1]
          //为当前分类等级赋值
          this.addCateForm.cat_level =this.selectedKeys.length
          return
        }else{
          //父级分类
          this.addCateForm.cat_pid = 0
          //为当前分类等级赋值
          this.addCateForm.cat_level =this.selectedKeys.length
        }
      },
      //点击确定添加分类
      addCate(){
        console.log(this.addCateForm)
        this.$refs.addCateFormRef.validate(async valid =>{
          if(!valid) return
          const {data:res} = await this.$http.post('categories',this.addCateForm)
          if(res.meta.status !==201){
            return this.$message.error('添加分类失败')
          }else{
            this.$message.success('添加分类成功')
            this.getCateList()
            this.addCateDialogVisible =false
          }
        })
      },
      addCateDialogClosed(){
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys =[];
        this.addCateForm.cat_level=0;
        this.addCateForm.cat_pid=0;
      },
      async showEditDialog(id){
        const {data:res} = await this.$http.get(`categories/${id}`)
        if(res.meta.status !==200){
          return this.$message.error('获取分类名称失败')
        }else{
          //this.$message.success('获取分类名称成功');
          this.editCateForm =res.data
        }
        this.editCateDialogVisible =true
      },
      editCateName(){
        this.$refs.editCateFormRef.validate(async valid => {
          if(!valid) return
          const {data:res} = await this.$http.put(`categories/${this.editCateForm.cat_id}`
            ,{cat_name:this.editCateForm.cat_name})
          console.log(res)
          console.log(this.editCateForm.cat_name)
          if(res.meta.status !==200){
            return this.$message.error('编辑分类失败')
          }else{
            this.$message.success('编辑分类成功')
            this.getCateList();
            this.editCateDialogVisible =false
          }
        })
      },
      editCateDialogClosed(){
        this.$refs.editCateFormRef.resetFields()
      },
      async removeCateById(id){
        const confirmResult = await this.$confirm('此操作将永久删除该分类，是否继续?','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).catch(err => err)
        console.log(confirmResult)
        if(confirmResult !=='confirm'){
          return this.$message.info('已取消删除分类')
        }
        const {data:res} = await this.$http.delete('categories/'+id)
        if(res.meta.status !==200){
          return this.$message.error('删除分类失败')
        }else{
          this.$message.success('删除分类成功')
          this.getCateList()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .treeTable{
    margin-top: 15px;
  }
  .el-cascader{
    width: 100%;
  }
</style>
