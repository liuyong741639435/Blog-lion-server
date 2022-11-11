import { Controller, RequestMapping } from '../common/decorator/decorator'
import { Context } from 'koa'
import multer from 'koa-multer'
import { REQUEST_METHOD } from '../types/enum'
import { Flie } from '../types/model'

const storage = multer.diskStorage({
	// 文件保存路径
	destination(req, file, cb) {
		cb(null, 'src/public/uploads') // 路径必须存在
	},
	// 修改文件名称
	filename(req, file, cb) {
		const fileFormat = file.originalname.split('.')
		cb(null, `${Math.floor(Math.random() * 100000)}${Date.now()}.${fileFormat.pop()}`)
	}
})

const upload = multer({ storage })

@Controller('/files')
export default class UserController {
	@RequestMapping({
		url: '/upload',
		method: REQUEST_METHOD.POST,
		middleware: [upload.single('file')],
		login: true
	})
	async update(ctx: Context) {
		const req = ctx.req as any
		const file = req.file as Flie
		console.log('file', file.destination)
		ctx.response.body = {
			code: 0,
			msg: '',
			data: {
				filename: file.filename,
				path: file.path.split('\\').pop()
			}
		}
	}
}
