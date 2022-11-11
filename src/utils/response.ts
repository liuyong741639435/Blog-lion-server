/** 统一ctx返回格式 */
import { Context } from 'koa'

function success(ctx: Context, data: any = null, msg = 'success', code = 0) {
	ctx.body = {
		code,
		msg,
		data
	}
}

function error(ctx: Context, msg = 'error', data = '', code = 1) {
	ctx.body = {
		code,
		msg,
		data
	}
}

export default { success, error }
