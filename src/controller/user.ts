import { Context } from 'koa'
import { Controller, RequestMapping } from '../common/decorator/decorator'
import { REQUEST_METHOD } from '../types/enum'
import { sign } from '../utils/auth'
import collectErrorLogs from '../utils/collectErrorLogs'
import response from '../utils/response'
import { getFormData } from '../utils/tools'
import userTips from '../errorTips/userTips'
import UserService from '../service/userService'

@Controller('/user')
export default class UserController {
	// 查询账号
	@RequestMapping({ url: '/queryUserName', method: REQUEST_METHOD.GET })
	async querUserName(ctx: Context) {
		const { userName } = getFormData(ctx)
		// 数据校验
		if (!userTips.userName.regular?.test(userName)) {
			response.error(ctx, userTips.userName.msg)
			return
		}
		try {
			const res = await UserService.getUser({ userName })
			const queryData = res[0] as Array<{ userName: string }>
			response.success(ctx, { repeat: queryData.length !== 0 })
		} catch (error) {
			response.error(ctx, userTips.neibuError.msg, collectErrorLogs(error))
		}
	}
	// 注册
	@RequestMapping({ url: '/register', method: REQUEST_METHOD.POST })
	async register(ctx: Context) {
		const { userName, password } = getFormData(ctx)
		// 数据校验
		if (!userTips.userName.regular?.test(userName)) {
			response.error(ctx, userTips.userName.msg)
			return
		}
		if (!userTips.password.regular?.test(password)) {
			response.error(ctx, userTips.password.msg)
			return
		}

		try {
			//  取出最大的userId
			const resUserId = await UserService.queryMaxUserId()
			//  todo 现在queryMaxUserId 只是以当前时间作为最大id, 实际情况不允许如此，后续完善
			const newUserId = resUserId + Math.floor(Math.random() * 1000)
			await UserService.createdUser({
				userId: String(newUserId),
				userName,
				password,
				nickName: `新用户${newUserId}`
			})
			response.success(ctx)
		} catch (error) {
			response.error(ctx, userTips.neibuError.msg, collectErrorLogs(error))
		}
	}
	// 登录
	@RequestMapping({ url: '/login', method: REQUEST_METHOD.POST })
	async login(ctx: Context) {
		const { userName, password } = getFormData(ctx)
		// 数据校验
		if (!userTips.userName.regular.test(userName)) {
			response.error(ctx, userTips.userName.msg)
			return
		}
		if (!userTips.password.regular.test(password)) {
			response.error(ctx, userTips.password.msg)
			return
		}

		try {
			const res = await UserService.getLogin({ userName, password })
			const queryData = res[0] as Array<{ userId: string }> // todo 后续要把这部分格式推断前移到 UserService 内部
			if (queryData.length > 0) {
				const token = sign({ userId: queryData[0].userId })
				response.success(ctx, { token })
			} else {
				response.error(ctx, userTips.loginError.msg)
			}
		} catch (error) {
			response.error(ctx, userTips.neibuError.msg, collectErrorLogs(error))
		}
	}
	// 修改密码
	@RequestMapping({ url: '/updatePassword', method: REQUEST_METHOD.POST, login: true })
	async updatePassword(ctx: Context) {
		const { userName, password } = getFormData(ctx)
		if (!userTips.userName.regular.test(userName)) {
			response.error(ctx, userTips.userName.msg)
			return
		}

		if (!userTips.password.regular.test(password)) {
			response.error(ctx, userTips.password.msg)
			return
		}
		const { userId } = ctx.user
		try {
			await UserService.updateProfile(userId, {
				password
			})
			response.success(ctx)
		} catch (error) {
			response.error(ctx, userTips.neibuError.msg, collectErrorLogs(error))
		}
	}
	@RequestMapping({ url: '/userInfo', method: REQUEST_METHOD.GET, login: true })
	async userInfo(ctx: Context) {
		const { userId } = ctx.user
		try {
			await UserService.getUserInfo(userId)
			response.success(ctx, {
				userId: '',
				nickName: '',
				jobTitle: ''
			})
		} catch (error) {
			response.error(ctx, userTips.neibuError.msg, collectErrorLogs(error))
		}
	}
}
