import dotEnv from 'dotenv'
// 不同的环境，把对应的.env.development .env.prod .env.uat  改为.env 即可
dotEnv.config()
// end

const config = {
	// 服务器相关
	app: {
		port: process.env.APP_PORT,
		app_prefix: process.env.APP_PREFIX
	},
	// 数据库相关
	DB: {
		db_host: process.env.DB_HOST,
		db_port: Number(process.env.DB_PORT),
		db_name: process.env.DB_NAME,
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
			catch: { appenders: ['catchError'], level: 'info' }
		}
	},
	// token 相关
	jwt: {
		jwt_sercet: process.env.JWT_EXPIRT || '1d'
	}
}

export default config
