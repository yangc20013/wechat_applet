<template>
  <el-form ref="form" :model="form" label-width="80px" class="form-contain">

    <el-form-item label="商品名称">
      <el-input v-model="form.goods_name"></el-input>
    </el-form-item>

    <el-form-item label="商品价格">
      <el-input placeholder="请输入内容" v-model="form.goods_price" type='number'>
        <template slot="append">元</template>
      </el-input>
    </el-form-item>

    <el-form-item label="商品库存">
      <el-input-number v-model="form.inventory" :min="0"></el-input-number>
    </el-form-item>

    <el-form-item label="商品类型">
      <el-select v-model="form.goods_type" placeholder="请选择商品类型">
        <el-option v-for="item in goodsTpyeList" :key="item.goods_type" :label="item.goods_typename" :value="item.goods_type">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="商品状态">
      <el-radio-group v-model="form.onsale">
        <el-radio :label="0">下架</el-radio>
        <el-radio :label="1">上架</el-radio>

      </el-radio-group>
    </el-form-item>

    <el-form-item label="商品详情">
      <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="form.goods_details">
      </el-input>

    </el-form-item>

    <el-form-item label="上传图片">
      <el-upload ref="upload" action="https://jsonplaceholder.typicode.com/posts/" 
      list-type="picture-card" 
      :auto-upload="true" 
      :before-upload="onBeforeUpload" 
      :on-preview="handlePictureCardPreview" 
      :on-remove="handleRemove" :file-list="imgList">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog v-model="dialogVisible" size="tiny">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>

    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">{{isNew ? '添加商品' : '修改商品'}}</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
export default {
  name: "form",

  data() {
    return {
      isNew: 1, // 是否是添加
      form: {
        goods_id: undefined,
        goods_name: "",
        goods_price: 0,
        onsale: "",
        inventory: 0,
        imgs: "",
        goods_type: "",
        goods_typename: ""
      },
      goodsTpyeList: "",
      dialogImageUrl: "",
      imgList: [],
      
      dialogVisible: false
    };
  },

  methods: {
    onSubmit() {
      if (!this.form.goods_name || !this.form.goods_type) {
        this.$message.warning("请填写完整信息");
        return;
      }
      this.form.goods_typename = this.getGoodsTypeName(this.form.goods_type);
      this.form.imgs = JSON.stringify(this.imgList);

      this.func.ajaxPost(this.api.goodsAdd, this.form, res => {
        this.$message.success("操作成功");
        this.$router.push("/admin/goods-list");
      });
    },
    getGoodsTypeName(id) {
      for (var t in this.goodsTpyeList) {
        if (this.goodsTpyeList[t].goods_type == id)
          return this.goodsTpyeList[t].goods_typename;
      }
      return "";
    },
    goodsType() {
      this.func.ajaxPost(this.api.goodsType, this.form, res => {
        this.goodsTpyeList = res.data;
      });
    },

    onCancel() {
      this.$router.push("/admin/goods-list");
    },
    uploadFile(file) {
      let fd = new FormData();
      fd.append("avatar", file);
      let _this = this;
      this.func.ajaxPost(this.api.uploadFile, fd, res => {
        _this.imgList.push({ name: file.name, url: res.data });
        //console.log(JSON.stringify(res));
      });
    },
    removeFile(fileName, fn) {
      this.func.ajaxPost(
        this.api.removeFile,
        { fileName: fileName },
        res => {
          fn(res);
        },
        err => {
          console.error(JSON.stringify(err));
        }
      );
    },

    onBeforeUpload(file) {
      const isIMAGE = file.type === "image/jpeg" || "image/gif" || "image/png";
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!");
        return false;
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 1MB!");
        return false;
      }
      this.uploadFile(file);
      return false; //isIMAGE && isLt1M;;
    },
    handleRemove(file, fileList) {
      let _this = this;
      if (file && file.url){
        this.removeFile(file.url, res => {
          _this.imgList = fileList;
        });
      }
    },
    //图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  },

  created() {
    let goods_id = this.$route.query.goods_id;

    if (goods_id) {
      this.isNew = 0;

      this.func.ajaxPost(
        this.api.goodsDetail,
        {
          goods_id
        },
        res => {
          this.form = res.data;
          this.form.goods_id = res.data.goods_id;
          if(res.data.imgs){
            this.imgList = JSON.parse(res.data.imgs);
          }else{
            this.imgList = [];
          }
        }
      );
    }

    this.goodsType();
  }
};
</script>
