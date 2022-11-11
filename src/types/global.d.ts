import Router from 'koa-router'
import { REQUEST_METHOD } from './enum'

declare global {
	interface ControllerRouter {
		url: string // 路由
		method: REQUEST_METHOD // 传输方式
		middleware?: Router.IMiddleware[] // 特有中间件
		handler?: Router.IMiddleware // 回调
		constructor?: Function | any //
		login?: boolean // 是否必须登录
	}
	type ErrorTigs = Record<string, { regular?: RegExp; msg: string }>
}
export { ControllerRouter }
