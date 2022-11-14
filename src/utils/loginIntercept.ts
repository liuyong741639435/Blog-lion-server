/**登录拦截 */

export const loginInterceptList: string[] = []

export function useLoginIntercept(path: string) {
	if (loginInterceptList.includes(path)) {
		console.error('loginInterceptList: ${path}重复请查询原因')
	} else {
		loginInterceptList.push(path)
	}
}
