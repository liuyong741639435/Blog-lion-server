/** user数据各项校验相关 */
export default {
	userName: {
		regular: /^[A-Za-z0-9]{4,12}$/,
		msg: '账号格式不正确，请输入4-12位由字母+数字的组合'
	},
	password: {
		regular: /^[\u4E00-\u9FA5A-Za-z0-9]{4,12}$/,
		msg: '账号格式不正确，请输入4-12位由字母+数字的组合'
	},
	neibuError: {
		msg: '账号已经被注册'
	},
	loginError: {
		msg: '登录的账号或者密码错误'
	}
}
