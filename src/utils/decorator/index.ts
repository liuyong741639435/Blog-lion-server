import { controllers } from './decorator'
import { ControllerRouter } from '@/types/global'
import Router from 'koa-router'
import Koa from 'koa'

export default function (app: Koa, router: Router) {
	controllers.forEach((item: ControllerRouter) => {
		const prefix = item.constructor.prefix
		// 组合真正的链接
		const url = prefix ? `${prefix}${item.url}` : item.url
		if (item.handler) {
			item.middleware ? router[item.method](url, ...item.middleware, item.handler) : router[item.method](url, item.handler)
		}
	})

	app.use(router.routes()).use(router.allowedMethods())
}
