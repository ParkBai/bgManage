<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods'}">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false">
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsFormRef" label-width="100px" label-position='top'>
      <!-- tab栏 -->
        <el-tabs v-model="activeIndex" 
                :tab-position="tabPosition='left'" 
                :before-leave="beforeLeave"
                @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name='0'>
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类(只允许选择三级分类)" prop="goods_cat">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="cateList"
                :props="goodsCateProps"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
            
          <el-tab-pane label="商品参数" name='1'>
            <!-- 渲染表单item项 -->
            <el-form-item :label="item.attr_name" v-for="item in activeParamsData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="name" v-for="(name,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name='2'>
            <el-form-item :label="item.attr_name" v-for="item in staticParamsData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品图片" name='3'>
            <!-- 因为element-ui发送网络请求并没有用自己的axios，所以无token,因此要加headers -->
            <el-upload
              class="upload-demo"
              :action="actionUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess">
              <el-button size="small" type="primary" class="right">点击上传</el-button>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="商品内容" name='4'>
            <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="right" size="small" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片展示对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="previewVisible"
      width="30%"
    >
      <img :src="pictureUrl" alt="picture">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name:'Add',
  data() {
    return {
      activeIndex:'0',

      // 添加商品的表单数据对象
      addGoodsForm:{
        goods_name:'',
        goods_price:0,
        goods_number:0,
        goods_weight:0,
        // 分类列表
        goods_cat:[],

        //图片数组
        pics:[],
        // 商品介绍
        goods_introduce:'',

        // 商品的参数（数组），包含 `动态参数` 和 `静态属性`
        attrs:[]

      },

      addGoodsFormRules:{
        goods_name:[
          { required: true, message: 'please input goods_name', trigger: 'blur' }
        ],
        goods_price:[
          { required: true, message: 'please input goods_price', trigger: 'blur' }
        ],
        goods_number:[
          { required: true, message: 'please input goods_number', trigger: 'blur' }
        ],
        goods_weight:[
          { required: true, message: 'please input goods_weight', trigger: 'blur' }
        ],
        goods_cat:[
          { required: true, message: 'please input goods_cat', trigger: 'blur' }
        ]
      },

      // 商品f分类列表
      cateList:[],
      goodsCateProps:
      { 
        expandTrigger: 'hover' ,
        label:'cat_name',
        value:'cat_id'
      },

      // 动态参数
      activeParamsData :[],

      // 静态属性
      staticParamsData:[],

      // 图片上传地址
      actionUrl:"http://127.0.0.1:8888/api/private/v1/upload",

      // 图片上传请求头
      headersObj:{
        Authorization:window.sessionStorage.getItem('token')
      },

      // 图片真实路径
      pictureUrl:'',

      // 图片展示对话框
      previewVisible:false
      
    }
  },

  created() {
    this.getCateList()
  },

  methods: {
    async getCateList(){
      const {data:res} = await this.$http.get('categories')
       if(res.meta.status !== 200) return this.$message.error({message:'get categories failed',customClass: 'message-error'})
       this.cateList = res.data
       //console.log(res.data)
    },

    // 切换tab时判断
    beforeLeave(activeTab,oldActiveTab){
      // 要求不满足不允许跳到下一个tab
      if(oldActiveTab === '0' && (this.addGoodsForm.goods_cat.length !==3 || this.addGoodsForm.goods_name =='')){
        this.$message.error({message:'please choose categories && input good_name',customClass: 'message-error'})
        return false
      }

      // tabClicked函数里的操作也可写在这，但因为发送请求async的原因会使阻止tab切换失效

    },

    // tab被点击判断是哪个activeIndex[不知道为什么拿不到activeIndex]
    async tabClicked(){
      if(this.activeIndex === '1'){
        const {data:res} = await this.$http.get(`categories/${this.addGoodsForm.goods_cat[2]}/attributes`,{params:{sel:'many'}})
        if(res.meta.status !== 200) return this.$message.error({message:'get activeParams failed',customClass: 'message-error'})
        
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length !==0 ? item.attr_vals.split(' ') : []
        });
        this.activeParamsData = res.data  
        //console.log(res.data)
      }else if(this.activeIndex === '2'){
        const {data:res} = await this.$http.get(`categories/${this.addGoodsForm.goods_cat[2]}/attributes`,{params:{sel:'only'}})
        if(res.meta.status !== 200) return this.$message.error({message:'get activeParams failed',customClass: 'message-error'})
        this.staticParamsData = res.data
        //console.log(res.data)
      }
      
    },

    // 图片预览
    handlePreview(file){
      //console.log(file);
      this.pictureUrl = file.response.data.url
      this.previewVisible = true
    },

    // 图片移除
    handleRemove(file){
      //console.log(file);
      //获取删除图片的临时路径
      const filePath = file.response.data.tmp_path
      //pics数组中找到该图片索引
      const index =this.addGoodsForm.pics.findIndex(p=>{
        p.pic === filePath
      })
      //删除图片
      this.addGoodsForm.pics.splice(index,1)
      //console.log(this.addGoodsForm)
    },

    // 监听图片上传成功
    handleSuccess(response){
      //console.log(response)
      //拼接图片对象
      const picInfo = {pics:response.data.tmp_path}
      //push到pics数组
      this.addGoodsForm.pics.push(picInfo)
      //console.log(this.addGoodsForm)
    },

    // 校验添加商品表单
    addGoods(){
      this.$refs.addGoodsFormRef.validate(async valid=>{
        if(!valid) return this.$message.error({message:'please input required item',customClass: 'message-error'})
        
        // 数据库中要求是以逗号分隔的字符串，但跟改完之后与级联选择器的数组冲突，所以很拷贝一个新数组在操作
        const newAddGoodsForm = _.cloneDeep(this.addGoodsForm)
        newAddGoodsForm.goods_cat = newAddGoodsForm.goods_cat.join(',')

        // 处理属性
        this.staticParamsData.forEach(item=>{
          const newInfo = 
            {
              attr_id:item.attr_id,
              attr_value:item.attr_vals
            }
          this.addGoodsForm.attrs.push(newInfo)
        })
         this.activeParamsData.forEach(item=>{
          const newInfo = 
            {
              attr_id:item.attr_id,
              attr_value:item.attr_vals.join(' ')
            }
          this.addGoodsForm.attrs.push(newInfo)
        })
        newAddGoodsForm.attrs = this.addGoodsForm.attrs
        //console.log(newAddGoodsForm)
        // 发起请求添加商品，商品名称必须唯一
        const {data:res} = await this.$http.post('goods',newAddGoodsForm)
        if(res.meta.status !== 201) return this.$message.error({message:'add goods failed',customClass: 'message-error'})
        this.$message.success({message:'add goods succeed',customClass: 'message-success'})
        this.$router.push('/goods')
      })
      
    }
  },

    

    
  }
 
</script>

<style scoped>

  img{
    width: 100%;
  }

</style>
