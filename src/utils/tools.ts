import { Context } from 'koa'

export async function sleep(ms = 1000) {
	return new Promise(resolve => {
		setTimeout(resolve, ms)
	})
}

export function getFormData(ctx: Context) {
	switch (ctx.method) {
		case 'GET':
			return ctx.request.query
		case 'POST':
			return ctx.request.body
		case 'PUT':
			return ctx.request.body
		default:
			console.log('尚未覆盖方法:', ctx.method)
			return {}
	}
}
