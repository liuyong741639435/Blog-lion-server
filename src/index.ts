import path from 'path'
// 第三方库
import Koa from 'koa'
import koaBody from 'koa-body'
import koaStatic from 'koa-static'
// 配置
import config from './config'
import router from './router/index'
import initRoutes from './common/decorator'
// import { initDB } from './db'
// 中间件
import AccessLogMiddleware from './middleware/AccessLogMiddleware' // 登录日志

// 创建
const app = new Koa()
// initDB() // 初始化数据库

// 中间件注册
app
	.use(koaStatic(path.join(__dirname, 'public')))
	.use(AccessLogMiddleware)
	.use(koaBody())
// 路由注册
initRoutes(app, router)
// 开始监听
app.listen(config.app.port, () => console.log(`port: ${config.app.port}`))
