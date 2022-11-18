import { Controller, RequestMapping } from '../common/decorator/decorator'
import { Context } from 'koa'
import { REQUEST_METHOD } from '../types/enum'
// import path from 'path'
// import fs from 'fs'
import response from 'utils/response'

@Controller('/files')
export default class UserController {
	@RequestMapping({
		url: '/upload',
		method: REQUEST_METHOD.POST,
		login: true
	})
	async upload(ctx: Context) {
		if (ctx.request.files === undefined) {
			response.error(ctx, '文件不可以为空')
		} else {
			const files = ctx.request.files.files
			const fileList = Array.isArray(files) ? files : [files]
			const data = fileList.map(item => ({
				size: item.size,
				newFilename: item.newFilename,
				originalFilename: item.originalFilename,
				path: `/upload/${item.filepath.split('\\').pop()}`
			}))
			response.success(ctx, data)
		}
	}
}
