import { Controller, RequestMapping } from '../common/decorator/decorator'
import { Context } from 'koa'
import { REQUEST_METHOD } from '../types/enum'
import path from 'path'
import fs from 'fs'
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
			console.log(ctx.request.files)
			const file = ctx.request.files.file
			// 多文件处理
			if (Array.isArray(file)) {
				console.log('file1', file)
			}
			// 单文件处理
			else {
				console.log('file2', file)
			}
			// if (Array.isArray(file)) {
			// 	response.error(ctx, '暂不支持多文件上传')
			// } else {
			// 	const fileType = Array.isArray(file) ? file[0].type : file.type
			// 	const typeSet = new Set(['image/jpeg', 'image/jpg', 'image/gif', 'image/png'])
			// 	if (!typeSet.has(fileType)) {
			// 		return response.error(ctx, '非法文件上传')
			// 	}
			// 	// @ts-ignore
			// 	const reader = fs.createReadStream(file.path)
			// 	const ext = path.extname(file.name)
			// 	// @ts-ignor
			// 	const filePath = '/upload/' + this.randomStr(32) + ext
			// 	const writer = fs.createWriteStream('statics' + filePath)
			// 	reader.pipe(writer)
			// 	response.success(ctx, { file: filePath })
			// }
		}
	}
}
