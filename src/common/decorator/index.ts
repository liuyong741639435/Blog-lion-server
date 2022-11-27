import { controllers } from './decorator'
import config from '../../config'
import Router from 'koa-router'
import Koa from 'koa'
import { useLoginIntercept } from 'utils/loginIntercept'

export default function (app: Koa, router: Router) {
	const urlArr: string[] = []
	controllers.forEach((item: ControllerRouter) => {
		const prefix = item.constructor.prefix
		// 组合真正的链接
		const url = prefix ? `${prefix}${item.url}` : item.url
		urlArr.push(url)
		if (item.handler) {
			item.middleware ? router[item.method](url, ...item.middleware, item.handler) : router[item.method](url, item.handler)
		}
		// 需要登录的接口
		if (item.login) useLoginIntercept(`${config.app.prefix}${url}`)
	})
	console.log(`接口前缀${config.app.prefix || '/'}`)
	console.table(urlArr)

	app.use(router.routes()).use(router.allowedMethods())
}
