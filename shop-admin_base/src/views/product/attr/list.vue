<template>
  <div>
    <!--三个级别的分类-->
    <el-card>
      <CategorySelector @categoryChange="categoryChange" />
    </el-card>
    <!--表格列表数据展示-->
    <el-card style="margin-top:20px">
      <!--显示数据的界面-->
      <div v-if="isShowList">
        <!--按钮-->
        <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
        <!--表格-->
        <el-table :data="attrList" style="margin-top:20px" border>
          <!--第一列-->
          <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
          <!--第二列-->
          <el-table-column label="名称" prop="attrName" width="200px"></el-table-column>
          <!--第三列-->
          <el-table-column label="属性值列表">
            <template slot-scope="{row,$index}">
              <el-tag
                type="info"
                v-for="value in row.attrValueList"
                :key="value.id">
                {{ value.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <!--第四列-->
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="{row,$index}">
              <HintButton
                title="修改"
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="toUpdateAttr(row)"
              ></HintButton>
              <HintButton
                title="删除"
                type="danger"
                icon="el-icon-delete"
                size="mini">
              </HintButton>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--修改的界面-->
      <div v-else>
        <!--修改界面中的文本框-->
        <el-form inline :model="formAttr">
          <el-form-item label="属性名称">
            <el-input type="text" v-model="formAttr.attrName" />
          </el-form-item>
        </el-form>
        <!--添加属性值按钮和修改属性值-->
        <div style="margin-bottom:20px">
          <el-button type="primary" icon="el-icon-plus">添加属性值</el-button>
          <el-button @click="isShowList=true">取消</el-button>
        </div>
        <!--展现属性值的列表数据-->
        <el-table :data="formAttr.attrValueList" border style="margin-bottom:20px">
          <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
          <el-table-column label="属性值列表" prop="valueName"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确定删除属性值${row.valueName}吗`">
                <HintButton title="删除" type="danger" icon="el-icon-delete" size="mini" slot="reference">
                </HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="isShowList=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AttrList',
  data() {
    return {
      // 平台属性列表数据
      attrList: [],
      // 一级分类的id
      category1Id: '',
      // 二级分类的id
      category2Id: '',
      // 三级分类的id
      category3Id: '',
      // 显示表格列表数据
      isShowList: true,
      // 当前这一行的属性对象(id,attName)
      formAttr: {}
    }
  },
  methods: {
    // 获取到当前这个级别的id值和标识
    async categoryChange({ categoryId, level }) {
      // 判断
      if (level === 3) {
        // 三级分类
        this.category3Id = categoryId
        // 获取数据
        const result = await this.$API.attr.getAttrList(
          this.category1Id,
          this.category2Id,
          this.category3Id
        )
        if (result.code === 200) {
          // 更新数据
          this.attrList = result.data
        }
      } else if (level === 1) {
        // 一级分类
        this.category1Id = categoryId
        // 清除二级分类和三级分类的id,还要清空attrList数组
        this.category2Id = null
        this.category3Id = null
        this.attrList = []
      } else {
        // 二级分类
        this.category2Id = categoryId
        // 清除三级分类id和attrList数组
        this.category3Id = null
        this.attrList = []
      }
    },
    // 展示界面和修改界面
    toUpdateAttr(formAttr) {
      // 更新formAttr的对象数据
      this.formAttr = formAttr
      // 修改界面
      this.isShowList = false
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 60px;
}
.save-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>

