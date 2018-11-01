<template>
  <div class="admin-list">
    <div style="margin-bottom:30px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>

      </el-breadcrumb>

    </div>

    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="goods_name" placeholder="筛选商品名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>

      <router-link to="/admin/goods-form">
        <el-button type="success">新增商品</el-button>
      </router-link>

    </el-form>

    <el-table v-loading='load' ref="multipleTable" @selection-change="handleSelectionChange" :data="tableData" border tooltip-effect="dark" style="width: 100%">
      <el-table-column type="selection">
      </el-table-column>

      <el-table-column prop="goods_name" label="商品名">
      </el-table-column>

      <el-table-column label="价格">
        <template scope="scope">
          {{ scope.row.goods_price }}元
        </template>
      </el-table-column>

      <el-table-column prop="goods_typename" label="商品类型">
      </el-table-column>

      <el-table-column prop="goods_details" label="商品详情">
      </el-table-column>

      <el-table-column width="160" label="添加日期">
        <template scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300">
        <template scope="scope">
          <el-button size="small" @click="editGoods(scope.row)">修改商品
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除商品
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page_num"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="page_size"
 　　　　　　layout="total, sizes, prev, pager, next, jumper" 
　　　　　　:total="total"> 
　　　　</el-pagination>
<!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[100, 200, 300, 400]"//这事下拉框可以选择的，选择一夜显示几条数据
      :page-size="100"  //这是当前煤业显示的条数
      layout="total, sizes, prev, pager, next, jumper"
      :total="400" //这个是总共有多少条数据，把后台获取到的数据总数复制给total就可以了
>
    </el-pagination> -->
      <!-- <el-pagination 
      @current-change="handleCurrentChange" 
      layout="prev, pager, next" 
      :total="500">
      </el-pagination> -->
    </div>

  </div>
</template>

<script>
export default {
  name: "list",
  data() {
    return {
      tableData: [],
      total:0,
      page_num: 1,
      page_size: 5,
      goods_name: "",

      multipleSelection: [],

      load: false // loading
    };
  },

  methods: {
    fetchList() {
      this.load = true;

      var reqParams = {
        goods_name: this.goods_name,
        page_size: this.page_size,
        page_num: this.page_num
      };

      this.func.ajaxPost(this.api.goodsList, reqParams, res => {
        this.tableData = res.data.content;
        this.total = res.data.total;
        this.load = false;
      });
    },
    handleSizeChange(val) {
      this.page_size = val;
      this.fetchList();
    },

    //分页
    handleCurrentChange(val) {
      this.page_num = val;
      this.fetchList();
    },

    //搜索
    search() {
      this.fetchList();
    },
    // 删除
    handleDelete(row) {
      this.$confirm(
        "此操作将删除[ " + row.goods_name + " ], 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.func.ajaxPost(
            this.api.goodsDelete,
            {
              goods_id: row.goods_id
            },
            res => {
              let index = this.tableData.indexOf(row);
              this.tableData.splice(index, 1);
            }
          );
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "取消"
          });
        });
    },

    // 修改
    editGoods(row) {
      this.$router.push({
        path: "/admin/goods-form",
        query: {
          goods_id: row.goods_id
        }
      });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },

  created() {
    this.fetchList();
  }
};
</script>
