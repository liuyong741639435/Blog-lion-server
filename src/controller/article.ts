import articleTips from '../errorTips/articleTips'
import { Context } from 'koa'
import { Controller, RequestMapping } from '../common/decorator/decorator'
import { REQUEST_METHOD } from '../types/enum'
import collectErrorLogs from '../utils/collectErrorLogs'
import response from '../utils/response'
import { getFormData } from '../utils/tools'
import { ResultSetHeader } from 'mysql2'
import UserService from '../service/userService'
import { ArticleState } from '../types/article'
import articleService from '../service/articleService'
@Controller('/article')
export default class ArticleController {
	// 查询文章
	@RequestMapping({ url: '/getArticle', method: REQUEST_METHOD.GET, login: true })
	async getArticle(ctx: Context) {
		// 取值
		const { aId } = getFormData(ctx) // 文章aId
		// 校验 后续可能需要有权限才能查看， todo 自己的文章随便看，别人的文章需要是公开状态
		const { userId } = ctx.user
		// 查库
		try {
			const res = await articleService.getArticle({
				aId,
				userId,
				state: ArticleState.PUBLIC
			})
			const data = res[0] as any
			response.success(ctx, {
				userId: data.data,
				title: data.title,
				content: data.content
			})
		} catch (error: any) {
			response.error(ctx, error)
		}
	}
	// 编辑文章
	@RequestMapping({ url: '/editArticle', method: REQUEST_METHOD.POST, login: true })
	async editArticle(ctx: Context) {
		const { aId, title, content } = getFormData(ctx)
		const { userId } = ctx.user
		// if 如果没有传入aId，那就新建，否则就修改之前的文章         todotodotodo  这个aId可能是瞎传的，一定要判断sql返回。
		if (aId) {
			// 更新文章
			try {
				const res = await articleService.updateArticle({
					aId,
					userId,
					title,
					content
				})
				const resultSetHeader = res[0] as ResultSetHeader
				if (resultSetHeader.affectedRows === 0) {
					response.success(ctx)
				} else {
					response.error(ctx, articleTips.editArticle)
				}
			} catch (error) {
				response.error(ctx, articleTips.neibuError, collectErrorLogs(error))
			}
		} else {
			const aId = `${new Date().getTime()}${Math.floor(Math.random() * 8999 + 1000)}`
			// 新建文章
			try {
				const res = await articleService.createArticle({
					userId,
					aId,
					title,
					content,
					state: ArticleState.PRIVATE,
					date: new Date().getTime()
				})
				const resultSetHeader = res[0] as ResultSetHeader
				if (resultSetHeader.affectedRows === 1) {
					response.success(ctx, { aId })
				} else {
					response.error(ctx, articleTips.editArticleNew)
				}
			} catch (error) {
				response.error(ctx, articleTips.neibuError, collectErrorLogs(error))
			}
		}
	}

	// 删除文章
	@RequestMapping({ url: '/deleteArticle', method: REQUEST_METHOD.PUT, login: true })
	async deleteArticle(ctx: Context) {
		const { aId } = getFormData(ctx)
		const { userId } = ctx.user
		try {
			const res = await articleService.deleteArticle({
				aId,
				userId
			})
			const resultSetHeader = res[0] as ResultSetHeader
			resultSetHeader.affectedRows > 0
				? response.success(ctx, `删除的条数:${resultSetHeader.affectedRows}`)
				: response.error(ctx, `删除的条数:${resultSetHeader.affectedRows}`)
		} catch (error) {
			response.error(ctx, articleTips.neibuError, collectErrorLogs(error))
		}
	}
	// 查询所有文章简略信息
	@RequestMapping({ url: '/getArticleList', method: REQUEST_METHOD.GET })
	async getArticleList(ctx: Context) {
		// todo 前期会拉取所有的文章数据，后需要做分类，分页等功能， 前期不需要请求参数
		const params = getFormData(ctx)
		const currentPage = params.currentPage || 1
		const pageSize = params.pageSize || 15
		try {
			const res = await articleService.getArticleList({
				currentPage,
				pageSize,
				state: ArticleState.PUBLIC
			})
			const tempdata = res[0] as Array<any>
			if (tempdata.length > 0) {
				const userIdList = tempdata.map(item => item.userId)
				const res = await UserService.getNickName(userIdList)
				const data = res[0] as Array<any>
				const resData = tempdata.map((item: any) => {
					const nickName = data.find(item => item.userId)?.nickName
					return {
						...item,
						nickName
					}
				})
				response.success(ctx, resData)
			} else {
				response.success(ctx, [])
			}
		} catch (error) {
			response.error(ctx, articleTips.neibuError, collectErrorLogs(error))
		}
	}
	// 设置文章是否公开
	@RequestMapping({ url: '/setArticleState', method: REQUEST_METHOD.POST, login: true })
	async setArticleState(ctx: Context) {
		console.log('setArticleState')
		const { aId, state } = getFormData(ctx)
		console.log(aId, state)
		const { userId } = ctx.user
		if (!Object.values(ArticleState).includes(state)) {
			// 不合法
			response.error(ctx, articleTips.setArticleState)
			return
		}
		try {
			console.log(userId, aId, state)
			const res = await articleService.setArticleState({
				userId,
				aId,
				state
			})
			const resultSetHeader = res[0] as ResultSetHeader
			console.log(resultSetHeader.affectedRows)
			if (resultSetHeader.affectedRows > 0) {
				response.success(ctx)
			}
		} catch (error) {
			response.error(ctx, articleTips.neibuError, collectErrorLogs(error))
		}
	}
}
