// 引入ajax(request)
import request from '@/utils/request'
const api_name = '/admin/product'
// 暴露
export default {
  // 获取平台属性列表
  getAttrList(category1Id, category2Id, category3Id) {
    return request.get(`${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },
  // 添加属性或者更新属性
  saveUpdate(attr) {
    return request.post(`${api_name}/saveAttrInfo`, attr)
  },
  // 删除属性
  deleteAttr(attrId) {
    return request.delete(`${api_name}/deleteAttr/${attrId}`)
  }
}
