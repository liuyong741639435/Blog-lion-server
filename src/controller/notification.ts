// 通知相关
import { Controller, RequestMapping } from 'common/decorator/decorator'
import { Context } from 'koa'
import { REQUEST_METHOD } from 'types/enum'

@Controller('/notification')
export default class NotificationConterller {
	@RequestMapping({ url: '/getList', method: REQUEST_METHOD.GET, login: true })
	async getList(ctx: Context) {
		const { userId } = ctx.user
		// todo 后续再去完善把，还没相关怎么实现
	}
}
