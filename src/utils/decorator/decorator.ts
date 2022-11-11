import { REQUEST_METHOD } from '@/types/enum'
import { useLoginIntercept } from '@/utils/loginIntercept'

export const controllers: Array<ControllerRouter> = []

/**
 * Controller 注解方法  可以解析一个path 直接作用于API上
 * 使用方法：在类上直接使用即可@Controller("/user")
 * @param path 类请求前缀
 * @returns
 */

export function Controller(path = '') {
	return function (target: any) {
		target.prefix = path
	}
}

/**
 * 永固方法上的注解
 * @param param0 ControllerRouter 对象
 * @returns
 */

export function RequestMapping({ url = '', method = REQUEST_METHOD.GET, middleware = [], login = false }: ControllerRouter) {
	return function (target: any, name: string) {
		const path = url ? url : `/${name}`
		useLoginIntercept(path)
		controllers.push({
			url: path,
			method,
			middleware,
			login,
			handler: target[name],
			constructor: target.constructor
		})
	}
}

export * from '@/controller/index'
