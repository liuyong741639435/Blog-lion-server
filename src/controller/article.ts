import articleTips from '../errorTips/articleTips'
import { Context } from 'koa'
import { Controller, RequestMapping } from '../common/decorator/decorator'
import { REQUEST_METHOD } from '../types/enum'
import collectErrorLogs from '../utils/collectErrorLogs'
import response from '../utils/response'
import { getFormData } from '../utils/tools'
import ArticleService from '../service/ArticleService'
import { ResultSetHeader } from 'mysql2'
import UserService from '../service/UserService'
import { ArticleState } from '../types/article'
@Controller('/article')
export default class ArticleController {
	// 查询详情
	@RequestMapping({ url: '/getArticle', method: REQUEST_METHOD.GET })
	async getArticle(ctx: Context) {
		// 取值
		const { id } = getFormData(ctx) // 文章id
		// 校验 后续可能需要有权限才能查看， todo 自己的文章随便看，别人的文章需要是公开状态
		const { userId } = ctx.user
		// 查库
		try {
			const res = await ArticleService.getArticle({
				id,
				userId,
				state: ArticleState.PUBLIC
			})
			response.success(ctx, res[0])
		} catch (error: any) {
			response.error(ctx, error)
		}
	}
	// 编辑文章
	@RequestMapping({ url: '/editArticle', method: REQUEST_METHOD.POST, login: true })
	async editArticle(ctx: Context) {
		const { id, title, content } = getFormData(ctx)
		const { userId } = ctx.user
		// 格式校验
		try {
			await ArticleService.updateArticle({
				id,
				userId,
				title,
				content
			})
		} catch (error) {
			response.error(ctx, articleTips.neibuError, collectErrorLogs(error))
		}
	}

	// 删除文章
	async deleteArticle(ctx: Context) {
		const { id } = getFormData(ctx)
		const { userId } = ctx.user
		try {
			const res = await ArticleService.deleteArticle({
				id,
				userId
			})
			const data = res[0] as ResultSetHeader
			data.affectedRows > 0
				? response.success(ctx, `删除的条数:${data.affectedRows}`)
				: response.error(ctx, `删除的条数:${data.affectedRows}`)
		} catch (error) {
			response.error(ctx, articleTips.neibuError, collectErrorLogs(error))
		}
	}
	// 查询所有文章
	async getArticleList(ctx: Context) {
		// todo 前期会拉取所有的文章数据，后需要做分类，分页等功能， 前期不需要请求参数
		const params = getFormData(ctx)
		const currentPage = params.currentPage || 1
		const pageSize = params.pageSize || 15
		try {
			const res = await ArticleService.getArticleList({
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
	// async setArticleState(ctx: Context) {
	// 	const { id, state } = getFormData(ctx)
	// 	const { userId } = ctx.user
	// 	try {
	// 		const res = ArticleService.setArticleState({
	// 			userId,
	// 			id,
	// 			state
	// 		})
	// 	} catch (error) {}
	// }
}
