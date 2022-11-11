/** 记录catch的错误，并生成随机的code，传给前端用于查询错误信息，不能直接把错误信息给到前端 */

import { catchErrorLogger } from '../logger'

export default function collectErrorLogs(error: any) {
	const errorJSON = JSON.stringify(error)
	const random = Math.floor(Math.random() * 9000) + 1000 // 随机生成1000-9999的数
	const errorNumber = `${new Date().getTime()}${random}`
	catchErrorLogger.info(`errorNumber:${errorNumber}|errorJSON:${errorJSON}`)
	return errorNumber
}
