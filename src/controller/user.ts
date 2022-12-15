import { Context } from 'koa'
import { Controller, RequestMapping } from '../common/decorator/decorator'
import { REQUEST_METHOD } from '../types/enum'
import { sign } from '../utils/auth'
import collectErrorLogs from '../utils/collectErrorLogs'
import response from '../utils/response'
import { getFormData } from '../utils/tools'
import userTips from '../errorTips/userTips'
import currencyTips from '../errorTips/currency'
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
			res.length > 0 ? response.success(ctx) : response.error(ctx)
		} catch (error) {
			response.error(ctx, currencyTips.neibuError, collectErrorLogs(error))
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
			const res = await UserService.queryMaxUserId()
			const userId = res[0].userId ?? 1000000
			const newUserId = userId + Math.floor(Math.random() * 1000)
			await UserService.createdUser({
				userId: String(newUserId),
				userName,
				password,
				nickName: `新用户${newUserId}` // todu 找资源，随机生产昵称
			})
			response.success(ctx)
		} catch (error) {
			response.error(ctx, currencyTips.neibuError, collectErrorLogs(error))
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
			const userId = await UserService.getLogin({ userName, password })
			if (userId) {
				const token = sign({ userId: userId })
				response.success(ctx, { token })
			} else {
				response.error(ctx, userTips.loginError.msg)
			}
		} catch (error) {
			response.error(ctx, currencyTips.neibuError, collectErrorLogs(error))
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
			response.error(ctx, currencyTips.neibuError, collectErrorLogs(error))
		}
	}
	// 获取用户信息
	@RequestMapping({ url: '/userInfo', method: REQUEST_METHOD.GET, login: true })
	async userInfo(ctx: Context) {
		const userId = getFormData(ctx).userId || ctx.user.userId
		try {
			const res = await UserService.getUserInfo(userId)
			if (res.length > 0) {
				const { userId, nickName, jobTitle, company, blogAddress, description, createDate } = res[0]
				response.success(ctx, {
					userId,
					nickName,
					jobTitle,
					company,
					blogAddress,
					description,
					createDate
				})
			} else {
				response.error(ctx)
			}
		} catch (error) {
			response.error(ctx, currencyTips.neibuError, collectErrorLogs(error))
		}
	}
	// 修改自身用户信息
	@RequestMapping({ url: '/updateUserInfo', method: REQUEST_METHOD.POST, login: true })
	async updateUserInfo(ctx: Context) {
		const { nickName, jobTitle, company, blogAddress, description } = getFormData(ctx)
		const { userId } = ctx.user
		try {
			const { affectedRows } = await UserService.updateProfile(userId, {
				nickName,
				jobTitle,
				company,
				blogAddress,
				description,
				updateDate: new Date().getTime()
			})
			affectedRows > 0 ? response.success(ctx) : response.error(ctx)
		} catch (error) {
			response.error(ctx, currencyTips.neibuError, collectErrorLogs(error))
		}
	}
}
