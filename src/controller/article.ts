import articleTips from '../errorTips/articleTips'
import { Context } from 'koa'
import { Controller, RequestMapping } from '../common/decorator/decorator'
import { REQUEST_METHOD } from '../types/enum'
import collectErrorLogs from '../utils/collectErrorLogs'
import response from '../utils/response'
import { getFormData } from '../utils/tools'
@Controller('/article')
export default class ArticleController {
	//
	@RequestMapping({ url: '/createArticle', method: REQUEST_METHOD.POST })
	async createArticle(ctx: Context) {
		const { title, content, state } = getFormData(ctx)
		const { userId } = ctx.user
		// 校验
		if (!articleTips.title.regular?.test(title)) {
			response.error(ctx, articleTips.title.msg)
			return
		}
		if (!articleTips.content.regular?.test(content)) {
			response.error(ctx, articleTips.content.msg)
			return
		}
		// state 这个应该也要校验，后续补上，或者设置默认值
		// 插入库
		// 判断插入是否正常
		// try {
		// 	const res = await ArticleService.createArticle({
		// 		userId,
		// 		title,
		// 		content,
		// 		date: new Date().getTime()
		// 	})
		// 	// 返回
		// 	response.success(ctx)
		// 	//   还需要其他操作，后续补上
		// } catch (error) {
		// 	const errorNumber = collectErrorLogs(error)
		// 	response.error(ctx, checkConfig.neibuError, {
		// 		errorNumber
		// 	})
		// }
	}
}
