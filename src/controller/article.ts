import { Context } from 'koa'
import { Controller, RequestMapping } from '../common/decorator/decorator'
import { REQUEST_METHOD } from '../types/enum'
import collectErrorLogs from '../utils/collectErrorLogs'
import response from '../utils/response'
import { getFormData } from '../utils/tools'
@Controller('/article')
export default class ArticleController {
	//
	@RequestMapping({ url: '/a', method: REQUEST_METHOD.POST })
	async createArticle(ctx: Context) {
		// const { title, content, state } = getFormData(ctx)
		// const { userId } = ctx.user
	}
}
