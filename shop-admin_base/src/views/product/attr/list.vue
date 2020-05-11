<template>
  <div>
    <!--级别的分类-->
    <el-card>
      <CategorySelector @categoryChange="categoryChange" ref="cs" />
    </el-card>
    <!--表格列表数据展示-->
    <el-card style="margin-top:20px">
      <!--显示数据的界面-->
      <div v-show="isShowList">
        <!--按钮-->
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="toAddAttr"
          :disabled="!category3Id"
        >添加属性</el-button>
        <!--表格-->
        <el-table :data="attrList" style="margin-top:20px" border>
          <!--第一列-->
          <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
          <el-table-column label="名称" prop="attrName" width="200px"></el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{row,$index}">
              <el-tag
                type="info"
                v-for="value in row.attrValueList"
                :key="value.id"
              >{{value.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="{row,$index}">
              <HintButton
                title="修改"
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="toUpdateAttr(row)"
              ></HintButton>

              <el-popconfirm :title="`确定要删除${row.attName}属性吗`" @onConfirm="deleteAttr(row.id)">
                <HintButton
                  slot="reference"
                  title="删除"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--修改的界面-->
      <div v-show="!isShowList">
        <!--修改界面中的文本框-->
        <el-form inline :model="formAttr">
          <el-form-item label="属性名称">
            <el-input type="text" v-model="formAttr.attrName" />
          </el-form-item>
        </el-form>
        <!--添加属性值按钮和修改属性值-->
        <div style="margin-bottom:20px">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addValue"
            :disabled="!formAttr.attrName.trim()"
          >添加属性值</el-button>
          <el-button @click="isShowList=true">取消</el-button>
        </div>
        <!--展现属性值的列表数据-->
        <el-table :data="formAttr.attrValueList" border style="margin-bottom:20px">
          <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
          <el-table-column label="属性值列表" prop="valueName">
            <template slot-scope="{row,$index}">
              <!--编辑框-->
              <el-input
                type="text"
                size="mini"
                placeholder="输入属性值按回车确定"
                v-model="row.valueName"
                v-if="row.edit"
                @blur="toViewValue(row)"
                @keyup.enter.native="toViewValue(row)"
              />
              <!-- <el-input
                type="text"
                size="mini"
                placeholder="输入属性值按回车确定"
                v-model="row.valueName"
                v-if="row.edit"
                @change="toViewValue(row)"
              />-->
              <!--展示数据的-->
              <span
                v-else
                @click="toEditValue(row)"
                style="display:inline-block;width :100%"
              >{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确定删除属性值${row.valueName}吗`" @onConfirm="deleteValue($index)">
                <HintButton
                  title="删除"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addUpdateAttr" :disabled="!isSaveValid">保存</el-button>
        <el-button @click="isShowList=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入lodash
import cloneDeep from 'lodash/cloneDeep'
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
      formAttr: {
        // 默认为空值
        attrName: '',
        // 默认为空数组
        attrValueList: []
      }
    }
  },
  // 计算属性操作
  computed: {
    isSaveValid() {
      return (
        // this.formAttr.attrName.trim() && this.formAttr.attrValueList.length > 0
        this.formAttr.attrName.trim() &&
        this.formAttr.attrValueList.some(item => !!item.valueName.trim())
      )
    }
  },
  // 这是个监视操作
  watch: {
    isShowList(val) {
      // 父级组件改变子级组件
      this.$refs.cs.isDisabled = !val
    }
  },
  methods: {
    categoryChange({ categoryId, level }) {
      // 判断
      if (level === 3) {
        // 三级分类
        this.category3Id = categoryId
        // 获取数据
        this.getAttrList()
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
    // 点击修改按钮,切换展示界面和修改界面
    toUpdateAttr(formAttr) {
      // 更新数据
      // this.formAttr = formAttr
      // 修改属性名称
      // this.formAttr = { ...formAttr }
      // 使用深拷贝
      this.formAttr = cloneDeep(formAttr)
      // 显示修改界面
      this.isShowList = false
    },
    // 删除属性值
    deleteValue(index) {
      this.formAttr.attrValueList.splice(index, 1)
    },
    // 添加属性值
    addValue() {
      // 修改按钮
      this.formAttr.attrValueList.push({
        // 属性值的数据
        valueName: '',
        // 当前属性的id
        attrId: this.formAttr.id,
        // 后添加的这个属性值的标识
        edit: true
      })
    },
    // 文本框失去焦点
    toViewValue(value) {
      // 判断文本框中是否有这个数据
      if (value.valueName) {
        // 这里是value对象中的edit属性,不是this对象的属性
        value.edit = false
      }
    },
    toEditValue(value) {
      // 编辑模式
      // value.edit = true
      // 判断
      if (!value.hasOwnProperty('edit')) {
        this.$set(value, 'edit', true)
      } else {
        // 如果value中有edit属性,那么就更新属性值
        value.edit = true
      }
    },
    // 更新属性名称及属性值
    async addUpdateAttr() {
      // this.formAttr.attrValueList.forEach(value => delete value.edit)
      this.formAttr.attrValueList = this.formAttr.attrValueList.filter(
        value => {
          delete value.edit
          // 进行过滤
          return !!value.valueName.trim()
        }
      )
      // 获取当前属性的对象
      const result = await this.$API.attr.saveUpdate(this.formAttr)
      if (result.code === 200) {
        this.$message({
          type: 'success',
          message: `${this.formAttr.id ? '更新' : '添加'}属性成功`
          // message: `操作属性成功`
        })
        // 切换属性列表界面的操作
        this.isShowList = true
        // 重新获取新的属性列表
        this.getAttrList()
      } else {
        this.$message({
          type: 'error',
          message: `${this.formAttr.id ? '更新' : '添加'}属性失败`
          // message: `操作属性失败`
        })
      }
    },
    // 获取属性列表数据的方法的封装
    async getAttrList() {
      const result = await this.$API.attr.getAttrList(
        this.category1Id,
        this.category2Id,
        this.category3Id
      )
      if (result.code === 200) {
        // 更新数据,获取平台所有的属性列表数据
        this.attrList = result.data
      }
    },
    // 点击添加属性按钮，实现添加属性的操作
    toAddAttr() {
      // 收集数据
      this.formAttr = {
        // 属性名字
        attrName: '',
        // 属性值列表数组
        attrValueList: [],
        // 三级分类的id
        categoryId: this.category3Id,
        categoryLevel: 3
      }
      // 显示添加数据的界面
      this.isShowList = false
    },
    // 删除属性
    async deleteAttr(id) {
      // 调用接口发送请求
      const result = await this.$API.attr.deleteAttr(id)
      if (result.code === 200) {
        this.$message.success('删除属性成功')
        // 重新获取属性列表数据
        this.getAttrList()
      } else {
        this.$message.error('删除属性失败')
      }
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

