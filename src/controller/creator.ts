import { REQUEST_METHOD } from '../types/enum'
import { Controller, RequestMapping } from '../common/decorator/decorator'
import { Context } from 'koa'
import creatorService from 'service/creatorService'
import { getFormData } from 'utils/tools'
import response from 'utils/response'

@Controller('/creator')
export default class TestController {
	// 获取用户关系, 传入userId获取特定用户，不传入userId获取自身
	@RequestMapping({ url: '/getUserRelations', method: REQUEST_METHOD.GET, login: true })
	async getUserRelations(ctx: Context) {
		const { userId } = getFormData(ctx).userId ?? ctx.user.userId
		try {
			const fans = await creatorService.getFans({ userId }) // 粉丝
			const followers = await creatorService.getFollower({ userId }) // 我关注的
			// 相互关注
			const friends = fans.filter(item => {
				followers.find(follower => item.userId === follower.followerUserId)
			})
			response.success(ctx, {
				fans, // 粉丝
				followers, // 关注
				friends // 共同好友
			})
		} catch (error: any) {
			response.error(ctx, error)
		}
	}
	// 关注
	@RequestMapping({ url: '/setFollower', method: REQUEST_METHOD.POST, login: true })
	async setFollower(ctx: Context) {
		const { followerUserId } = getFormData(ctx)
		const { userId } = ctx.user
		try {
			const { affectedRows } = await creatorService.createFollower({
				userId,
				followerUserId
			})
			affectedRows === 1 ? response.success(ctx) : response.error(ctx)
		} catch (error: any) {
			response.error(ctx, error)
		}
	}
	// 取消关注
	@RequestMapping({ url: '/setCancelFollower', method: REQUEST_METHOD.POST, login: true })
	async setCancelFollower(ctx: Context) {
		const { followerUserId } = getFormData(ctx)
		const { userId } = ctx.user
		try {
			const { affectedRows } = await creatorService.deleteFollower({
				userId,
				followerUserId
			})
			affectedRows === 1 ? response.success(ctx) : response.error(ctx)
		} catch (error: any) {
			response.error(ctx, error)
		}
	}
}
