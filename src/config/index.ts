import dotEnv from 'dotenv'
import path from 'path'
import { checkDirExist, getUploadDirName, getUploadFileExt, getUploadFileName } from '../utils/tools'
// 不同的环境，把对应的.env.development .env.prod .env.uat  改为.env 即可
dotEnv.config()
// end

const config = {
	// 服务器相关
	app: {
		port: process.env.APP_PORT,
		prefix: process.env.APP_PREFIX,
		koaBody: {
			multipart: true, // 支持文件上传
			formidable: {
				keepExtensions: true, // 保留原来的文件后缀
				maxFieldsSize: 2 * 1024 * 1024, // 文件大小限制
				onFileBegin: (name: string, file: any) => {
					// 获取文件后缀
					const ext = getUploadFileExt(file.originalFilename || '')
					// 最终要保存到的文件夹目录
					const dir = path.join(__dirname, `../public/upload/${getUploadDirName()}`)
					// 检查文件夹是否存在如果不存在则新建文件夹
					checkDirExist(dir)
					// 重新覆盖 file.path 属性
					file.filepath = `${dir}/${getUploadFileName(ext)}`
				}
			}
		}
	},
	// 数据库相关
	DB: {
		db_host: process.env.DB_HOST,
		db_port: Number(process.env.DB_PORT),
		db_dataBaseName: process.env.DB_BASEDATANAME,
		db_user: process.env.DB_USER,
		db_password: process.env.DB_PASSWORD
	},
	// 日志相关
	log: {
		appenders: {
			cheese: { type: 'file', filename: 'logs/cheese.log' }, // 必须定义
			access: { type: 'file', filename: 'logs/access.log' }, // 访问日志
			db: { type: 'file', filename: 'logs/db.log' },
			catchError: { type: 'file', filename: 'logs/catchError.log' }
		},
		categories: {
			default: { appenders: ['cheese'], level: 'info' },
			access: { appenders: ['access'], level: 'info' }, // 访问日志
			db: { appenders: ['db'], level: 'info' },
			catchError: { appenders: ['catchError'], level: 'info' }
		}
	},
	// token 相关
	jwt: {
		jwt_sercet: process.env.JWT_EXPIRT || '1d'
	}
}

export default config
