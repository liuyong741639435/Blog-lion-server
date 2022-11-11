// 访问日志记录
import { Context, Next } from 'koa'
import { accessLogger } from '../logger'

export default function (ctx: Context, next: Next) {
	const logStr = `path:${ctx.path}|method:${ctx.method}|ua:${ctx.headers['user-agent']}`
	accessLogger.info(logStr)
	return next()
}
