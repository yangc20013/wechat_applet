<template>
    <div class="admin-list">

        <div style="margin-bottom:30px">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>类型管理</el-breadcrumb-item>
                <el-breadcrumb-item>类型列表</el-breadcrumb-item>

            </el-breadcrumb>

        </div>

        <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
                <el-input v-model="goods_typename" placeholder="筛选类型名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>

            <router-link to="/admin/goodstype-form">
                <el-button type="success">新增类型</el-button>
            </router-link>

        </el-form>

        <el-table v-loading='load' ref="multipleTable" @selection-change="handleSelectionChange" :data="tableData" border tooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection">
            </el-table-column>

            <el-table-column prop="goods_typename" label="类型名称">
            </el-table-column>

            <el-table-column prop="goods_type" label="类型编号">
            </el-table-column>

            <el-table-column width="160" label="添加日期">
                <template scope="scope">
                    <el-icon name="time"></el-icon>
                    <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="remarks" label="备注">
            </el-table-column>

            <el-table-column label="操作">
                <template scope="scope">

                    <el-button size="small" @click="editGoods(scope.row)">修改类型
                    </el-button>

                    <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除类型
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
      goods_typename: "",

      multipleSelection: [],

      load: false // loading
    };
  },

  methods: {
    fetchList() {
      this.load = true;
      var reqParams = {
        goods_typename: this.goods_typename,
        page_size: this.page_size,
        page_num: this.page_num
      };

      this.func.ajaxPost(this.api.goodstypeList, reqParams, res => {
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
        "此操作将删除[ " + row.goods_typename + " ], 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.func.ajaxPost(
            this.api.goodstypeDelete,
            { goods_type: row.goods_type },
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
        path: "/admin/goodstype-form",
        query: { id: row.goods_type }
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