/* 用户之间交互  interactionBetweenUsers */
import { REQUEST_METHOD } from '../types/enum'
import { Controller, RequestMapping } from '../common/decorator/decorator'
import { Context } from 'koa'
import { getFormData } from 'utils/tools'
import response from 'utils/response'
import interactionBetweenUsersService from 'service/interactionBetweenUsersService'
import currencyTips from '../errorTips/currency'
import collectErrorLogs from 'utils/collectErrorLogs'
import { CommentListItem, CommentState } from 'types/interactionBetweenUsers'

@Controller('/interactionBetweenUsers')
export default class TestController {
	// 获取用户关系, 传入userId获取特定用户，不传入userId获取自身
	@RequestMapping({ url: '/getUserRelations', method: REQUEST_METHOD.GET, login: true })
	async getUserRelations(ctx: Context) {
		const { userId } = getFormData(ctx).userId ?? ctx.user.userId
		try {
			const fans = await interactionBetweenUsersService.getFans({ userId }) // 粉丝
			const followers = await interactionBetweenUsersService.getFollower({ userId }) // 我关注的
			// 相互关注
			const friends = fans.filter(item => {
				followers.find(follower => item.userId === follower.followerUserId)
			})
			response.success(ctx, {
				fans, // 粉丝
				followers, // 关注
				friends // 共同好友
			})
		} catch (error) {
			response.error(ctx, currencyTips.neibuError, collectErrorLogs(error))
		}
	}
	// 关注
	@RequestMapping({ url: '/setFollower', method: REQUEST_METHOD.POST, login: true })
	async setFollower(ctx: Context) {
		const { followerUserId } = getFormData(ctx)
		const { userId } = ctx.user
		try {
			const { affectedRows } = await interactionBetweenUsersService.createFollower({
				userId,
				followerUserId
			})
			affectedRows === 1 ? response.success(ctx) : response.error(ctx)
		} catch (error) {
			response.error(ctx, currencyTips.neibuError, collectErrorLogs(error))
		}
	}
	// 取消关注
	@RequestMapping({ url: '/setCancelFollower', method: REQUEST_METHOD.POST, login: true })
	async setCancelFollower(ctx: Context) {
		const { followerUserId } = getFormData(ctx)
		const { userId } = ctx.user
		try {
			const { affectedRows } = await interactionBetweenUsersService.deleteFollower({
				userId,
				followerUserId
			})
			affectedRows === 1 ? response.success(ctx) : response.error(ctx)
		} catch (error) {
			response.error(ctx, currencyTips.neibuError, collectErrorLogs(error))
		}
	}
	// 评论
	@RequestMapping({ url: '/comment', method: REQUEST_METHOD.POST, login: true })
	async comment(ctx: Context) {
		const { aId, content, parentId } = getFormData(ctx)
		const { userId } = ctx.user
		// todo 数据校验
		try {
			const { affectedRows } = await interactionBetweenUsersService.createComment({
				aId,
				userId,
				content,
				parentId,
				date: new Date().getTime(),
				state: CommentState.PUBLIC
			})
			affectedRows === 1 ? response.success(ctx) : response.error(ctx)
		} catch (error) {
			response.error(ctx, currencyTips.neibuError, collectErrorLogs(error))
		}
	}
	// 取消评论
	@RequestMapping({ url: '/cancelComment', method: REQUEST_METHOD.POST, login: true })
	async cancelComment(ctx: Context) {
		const { id } = getFormData(ctx)
		const { userId } = ctx.user
		try {
			const { affectedRows } = await interactionBetweenUsersService.updateComment({
				id,
				userId,
				state: CommentState.DELETE
			})
			affectedRows === 1 ? response.success(ctx) : response.error(ctx)
		} catch (error) {
			response.error(ctx, currencyTips.neibuError, collectErrorLogs(error))
		}
	}
	// 读取评论
	@RequestMapping({ url: '/getComment', method: REQUEST_METHOD.GET })
	async getComment(ctx: Context) {
		const { aId } = getFormData(ctx)
		try {
			const res = await interactionBetweenUsersService.getComment({
				aId,
				state: CommentState.PUBLIC
			})
			const commentList: CommentListItem[] = []
			res.forEach(item1 => {
				const item: CommentListItem = {
					...item1,
					children: []
				}
				for (const item2 of res) {
					if (item.userId === item2.parentId) {
						item.children?.push(item2)
					}
				}
				// 没有父级的才保留在最外层
				if (item.parentId === null) commentList.push(item)
			})
			response.success(ctx, commentList)
		} catch (error) {
			console.log(error)
			response.error(ctx, currencyTips.neibuError, collectErrorLogs(error))
		}
	}
}
