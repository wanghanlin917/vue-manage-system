import { type RouteLocationNormalized } from "vue-router";

// 免登录白名单(匹配路由path)
const whiteListByPath: string[] = ["/login"]

// 免登录白名单(匹配路由name)
const whiteListByName:string[] = []

// 判断是否在白名单
const iswWhiteList = (to:RouteLocationNormalized) => {
  // path和name任意一个匹配上即可
  return whiteListByPath.indexOf(to.path) !== -1 || whiteListByName.indexOf(to.name as any) !== -1
}
export default iswWhiteList
