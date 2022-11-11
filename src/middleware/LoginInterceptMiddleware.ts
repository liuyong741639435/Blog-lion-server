/** 登录拦截，访问需要登录的接口时，解析token */
import { Context, Next } from 'koa'
import { User } from '../types/restructure'
import { verify } from '../utils/auth'
import { loginInterceptList } from '../utils/loginIntercept'
import response from '../utils/response'

export default function (ctx: Context, next: Next) {
	if (!loginInterceptList.includes(ctx.path)) {
		// 当前访问的path 不需要登录时
		return next()
	}
	// 当前访问的path需要登录时，判断token是否有效
	// 取出token 与前端约定放在header中的authorization
	const token = ctx.request.header.authorization
	if (!token) {
		response.error(ctx, '请携带token')
	} else {
		// 校验token
		// 前端传入的数据，可能有空格。
		const tokenData = token.split(' ').pop() || ''
		const res = verify(tokenData)
		if (res.error) {
			response.error(ctx, 'token校验失败，请登录')
		} else {
			const data = res.data as User
			try {
				ctx.user = {
					userId: data.userId
				}
				return next()
			} catch (error) {
				response.error(ctx, 'token校验失败，请登录')
			}
		}
	}
}
