import { REQUEST_METHOD } from '../types/enum'
import { Controller, RequestMapping } from '../common/decorator/decorator'
import { Context } from 'koa'

@Controller('/test')
export default class TestController {
	@RequestMapping({ url: '/test', method: REQUEST_METHOD.GET })
	async getArticle(ctx: Context) {}
}
