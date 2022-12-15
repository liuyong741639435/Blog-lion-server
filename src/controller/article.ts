import currencyTips from '../errorTips/currency'
import { Context } from 'koa'
import { Controller, RequestMapping } from '../common/decorator/decorator'
import { REQUEST_METHOD } from '../types/enum'
import collectErrorLogs from '../utils/collectErrorLogs'
import response from '../utils/response'
import { getFormData } from '../utils/tools'
import { ArticleState } from '../types/article'
import articleService from '../service/articleService'
import Cache from 'utils/cache'

const cache = new Cache(async (key: string, value: any) => {
	console.log('写入sql', key, value)
	try {
		await articleService.setArticleBrowseCount({
			aId: key,
			browseCount: value
		})
		console.error(`写入成功(${key}|${value})`)
	} catch (error) {
		console.error('写入失败')
	}
}, 1000)

@Controller('/article')
export default class ArticleController {
	// 查询自身文章
	@RequestMapping({ url: '/getArticleByUser', method: REQUEST_METHOD.GET, login: true })
	async getArticleByUser(ctx: Context) {
		// 取值
		const { aId } = getFormData(ctx)
		const { userId } = ctx.user
		// 查库
		try {
			const res = await articleService.getArticleByUser({
				aId,
				userId
			})
			res.length > 0 ? response.success(ctx, { title: res[0].title, content: res[0].content }) : response.error(ctx)
		} catch (error) {
			response.error(ctx, currencyTips.neibuError, collectErrorLogs(error))
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
				const { affectedRows } = await articleService.updateArticle({
					aId,
					userId,
					title,
					content
				})
				if (affectedRows > 1) {
					response.success(ctx)
				} else {
					response.error(ctx)
				}
			} catch (error) {
				response.error(ctx, currencyTips.neibuError, collectErrorLogs(error))
			}
		} else {
			const aId = `${new Date().getTime()}${Math.floor(Math.random() * 8999 + 1000)}`
			// 新建文章
			try {
				const { affectedRows } = await articleService.createArticle({
					userId,
					aId,
					title,
					content,
					state: ArticleState.PRIVATE,
					date: new Date().getTime()
				})
				if (affectedRows > 0) {
					response.success(ctx, { aId })
				} else {
					response.error(ctx)
				}
			} catch (error) {
				response.error(ctx, currencyTips.neibuError, collectErrorLogs(error))
			}
		}
	}
	// 删除文章
	@RequestMapping({ url: '/deleteArticle', method: REQUEST_METHOD.PUT, login: true })
	async deleteArticle(ctx: Context) {
		const { aId } = getFormData(ctx)
		const { userId } = ctx.user
		try {
			const { affectedRows } = await articleService.deleteArticle({
				aId,
				userId
			})
			affectedRows > 0 ? response.success(ctx, `删除的条数:${affectedRows}`) : response.error(ctx, `删除的条数:${affectedRows}`)
		} catch (error) {
			response.error(ctx, currencyTips.neibuError, collectErrorLogs(error))
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
			response.success(ctx, res)
		} catch (error) {
			response.error(ctx, currencyTips.neibuError, collectErrorLogs(error))
		}
	}
	// 查询自己的文章列表，通过状态码，可以查询不同状态的文章
	@RequestMapping({ url: '/getArticleListByUser', method: REQUEST_METHOD.GET, login: true })
	async getArticleListByUser(ctx: Context) {
		const { state } = getFormData(ctx)
		const { userId } = ctx.user
		// state 可以为 null, number, [number]
		const states: number[] = state === null ? [] : Array.isArray(state) ? state : [state]
		for (const state of states) {
			if (!Object.values(ArticleState).includes(state)) {
				// 不合法
				response.error(ctx, currencyTips.stateError)
				return
			}
		}
		try {
			const res = await articleService.getArticleListByUser({
				userId,
				states
			})
			response.success(ctx, res)
		} catch (error) {
			response.error(ctx, currencyTips.neibuError, collectErrorLogs(error))
		}
	}
	// 设置文章是否公开
	@RequestMapping({ url: '/setArticleState', method: REQUEST_METHOD.POST, login: true })
	async setArticleState(ctx: Context) {
		const { aId, state } = getFormData(ctx)
		const { userId } = ctx.user
		if (!Object.values(ArticleState).includes(state)) {
			// 不合法
			response.error(ctx, currencyTips.stateError)
			return
		}
		try {
			const { affectedRows } = await articleService.setArticleState({
				userId,
				aId,
				state
			})
			affectedRows > 0 ? response.success(ctx) : response.error(ctx)
		} catch (error) {
			response.error(ctx, currencyTips.neibuError, collectErrorLogs(error))
		}
	}
	// 访问他人文章
	@RequestMapping({ url: '/getArticle', method: REQUEST_METHOD.GET, login: true })
	async getArticle(ctx: Context) {
		// 取值
		const aId = getFormData(ctx).aId || '-'
		const { userId } = ctx.user
		// 查库
		try {
			const res = await articleService.getArticle({
				aId,
				userId,
				state: ArticleState.PUBLIC
			})
			// 访问量加1
			if (res.length > 0) {
				const { title, content, browseCount, supportCount, commentCount } = res[0]
				const value = cache.get(aId) ?? browseCount ?? 0
				cache.set(aId, value + 1)
				response.success(ctx, { title, content, browseCount, supportCount, commentCount })
			} else {
				response.error(ctx)
			}
		} catch (error) {
			response.error(ctx, currencyTips.neibuError, collectErrorLogs(error))
		}
	}
}
