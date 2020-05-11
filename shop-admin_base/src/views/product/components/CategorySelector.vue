<template>
  <el-form inline :model="form">
    <!--一级分类列表下拉框-->
    <el-form-item label="一级分类">
      <el-select v-model="form.category1Id" placeholder="请选择" @change="changeCategory1ListHandle" :disabled="isDisabled">
        <el-option v-for="c in category1List" :key="c.id" :label="c.name" :value="c.id"></el-option>
      </el-select>
    </el-form-item>
    <!--二级分类列表下拉框-->
    <el-form-item label="二级分类">
      <el-select v-model="form.category2Id" placeholder="请选择" @change="changeCategory2ListHandle" :disabled="isDisabled">
        <el-option v-for="c in category2List" :key="c.id" :label="c.name" :value="c.id"></el-option>
      </el-select>
    </el-form-item>
    <!--三级分类列表下拉框-->
    <el-form-item label="三级分类">
      <el-select v-model="form.category3Id" placeholder="请选择" @change="changeCategory3ListHandle" :disabled="isDisabled">
        <el-option v-for="c in category3List" :key="c.id" :label="c.name" :value="c.id"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: 'CategorySelector',
  data() {
    return {
      form: {
        // 一级分类的id
        category1Id: '',
        // 二级分类的id
        category2Id: '',
        // 三级分类的id
        category3Id: ''
      },
      // 一级分类列表数据
      category1List: [],
      // 二级分类列表数据
      category2List: [],
      // 三级分类列表数据
      category3List: [],
      // 控制下拉框是否是被禁用的
      isDisabled: false
    }
  },
  // 页面加载后的生命周期回调函数
  mounted() {
    // 获取一级分类列表数据
    this.getCategory1List()
  },
  // 存放放的对象
  methods: {
    // 发送请求获取数据
    async getCategory1List() {
      const result = await this.$API.category.getCategorys1()
      // 判断
      if (result.code === 200) {
        // 保存一级分类的列表数据
        this.category1List = result.data
      }
    },
    // 一级分类列表函数
    async changeCategory1ListHandle(category1Id) {
      // 干掉无用的id
      this.form.category2Id = null
      // 干掉无用的id
      this.form.category3Id = null
      // 重置二级分类列表数据
      this.category2List = []
      // 重置三级分类列表数据
      this.category3List = []
      // 传入一级分类的id值及标识
      this.$emit('categoryChange', { categoryId: category1Id, level: 1 })
      // 获取二级分类列表数据
      const result = await this.$API.category.getCategorys2(category1Id)
      if (result.code === 200) {
        this.category2List = result.data
      }
    },
    async changeCategory2ListHandle(category2Id) {
      // 干掉无用的id
      this.form.category3Id = null
      // 重置三级分类列表数据
      this.category3List = []
      // 传入二级分类的id值及标识
      this.$emit('categoryChange', { categoryId: category2Id, level: 2 })
      // 获取二级分类列表数据
      const result = await this.$API.category.getCategorys3(category2Id)
      if (result.code === 200) {
        this.category3List = result.data
      }
    },
    changeCategory3ListHandle(category3Id) {
      this.$emit('categoryChange', { categoryId: category3Id, level: 3 })
    }

  }
}
</script>
<style scoped>
</style>
