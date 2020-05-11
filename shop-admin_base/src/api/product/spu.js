// 引入ajax
import request from '@/utils/request'
// 访问接口中相同的路径单独的拿出来定义成一个变量,简化接口路径的编写
const api_name = '/admin/product'
// 暴露
export default {
  // 获取所有的销售属性列表的数据
  // [
  //   {
  //     "id": 0,
  //     "name": "string"
  //   }
  // ],
  // 获取所有销售属性的接口函数
  getSpuSaleAttrList() {
    return request.get(`${api_name}/baseSaleAttrList`)
  },
  // 根据spuId删除对应的spu接口
  removeSpu(spuId) {
    return request.delete(`${api_name}/deleteSpu/${spuId}`)
  },
  // 根据指定的spuId获取指定的spu基本信息
  getSpuById(spuId) {
    return request.get(`${api_name}/getSpuById/${spuId}`)
  },
  // 保存(添加)/修改spu操作的接口
  // POST /admin/product/saveSpuInfo
  // POST /admin/product/updateSpuInfo
  addUpdateSpu(spuInfo) {
    return request.post(`${api_name}/${spuInfo.id ? 'update' : 'save'}SpuInfo`, spuInfo)
  },
  // 获取指定分类的spu根据指定分类的id
  getSpuList(page, limit, category3Id) {
    return request.get(`${api_name}/${page}/${limit}`, { params: { category3Id }})
  }
}
