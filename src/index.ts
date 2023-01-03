import path from 'path'
// 第三方库
import Koa from 'koa'
import koaBody from 'koa-body'
import koaStatic from 'koa-static'
import history from 'koa2-connect-history-api-fallback'
import cors from '@koa/cors'
// 配置
import config from './config'
import router from './router/index'
import initRoutes from './common/decorator'
import { initDB } from './db'
// 中间件
import AccessLogMiddleware from './middleware/AccessLogMiddleware' // 登录日志
import LoginInterceptMiddleware from './middleware/LoginInterceptMiddleware'

// 创建
const app = new Koa()
initDB() // 初始化数据库

// 中间件注册
app
	.use(cors()) // 跨域
	.use(history()) // 兼容History
	.use(koaStatic(path.join(__dirname, '/public/'))) // 静态资源
	.use(koaBody(config.app.koaBody)) // 中间件
	.use(AccessLogMiddleware) // 中间件-访问记录
	.use(LoginInterceptMiddleware) // 中间件-token认证处理
// 路由注册
initRoutes(app, router)
// 开始监听
app.listen(config.app.port, () => console.log(`port: ${config.app.port}`))
