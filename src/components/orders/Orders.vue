<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/'}">订单管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/'}">订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" @clear="getOrdersList" :clearable="true">
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" width="200px" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" width="80px" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay === '1'" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240px">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" type="primary" size="mini" @click="showEditAddressDialog">修改订单</el-button>
            <el-button icon="el-icon-position" type="success" size="mini" @click="showProgressBox">地址</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum" :page-sizes="[5,10,15,20]" :page-size="100"
      layout="total,sizes,prev,pager,next,jumper" :total="total"></el-pagination>
    </el-card>
    <el-dialog title="修改地址" :visible.sync="editAddressDialogVisible" width="50%">
      <el-form :model="addressForm" :rules="addressRules" ref="addressFormRef"
      label-width="100px" @close="addressDialogClosed">
        <el-form-item label="省市区/县" prop="address1">
          <!--级联选择器 -->
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressDialogVisible = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </span>
    </el-dialog>
    <!--物流进度 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
  import cityData from "./citydata";
  export default {
    name: "Orders",
    data(){
      return{
        queryInfo:{
          query:'',
          pagenum:1,
          pagesize:10,
        },
        ordersList:[],
        total:0,
        editAddressDialogVisible:false,
        addressForm:{
          address1:[],
          address2:''
        },
        addressRules:{
          address1:[{required:true,message:'请选择地址',trigger:'blur'}],
          address2:[{required:true,message:'请填写详细地址',trigger:'blur'}],
        },
        cityData,
        progressVisible:false,
        progressInfo:[]
      }
    },
    created() {
      this.getOrdersList();
    },
    methods:{
      async getOrdersList(){
        const {data:res} = await this.$http.get('orders',{params:this.queryInfo})
        if(res.meta.status !==200){
          return  this.$message.error('获取订单列表失败')
        }else{
          this.ordersList =res.data.goods
          this.total=res.data.total
        }
      },
      handleCurrentChange(newPage){
        this.queryInfo.pagenum =newPage
        this.getOrdersList()
      },
      handleSizeChange(newSize){
        this.queryInfo.pagesize =newSize
        this.getOrdersList()
      },
      showEditAddressDialog(){
        this.editAddressDialogVisible =true
      },
      addressDialogClosed(){
        this.$refs.addressFormRef.resetFields()
      },
      async showProgressBox(){
        const{data:res} = await this.$http.get(`kuaidi/804909574412544580`)
        if(res.meta.status !== 200){
          return this.$message.error('获取物流信息失败')
        }else{
          this.progressInfo =res.data
          console.log(this.progressInfo)
          this.progressVisible =true
        }
      }
    }
  }
</script>

<style scoped>
  .el-cascader{
    width: 100%;
  }
</style>
