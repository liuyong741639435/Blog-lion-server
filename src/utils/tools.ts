import { Context } from 'koa'
import fs from 'fs'

export async function sleep(ms = 1000) {
	return new Promise(resolve => {
		setTimeout(resolve, ms)
	})
}

export function getFormData(ctx: Context) {
	switch (ctx.method) {
		case 'GET':
			return ctx.request.query
		case 'POST':
			return ctx.request.body
		case 'PUT':
			return ctx.request.body
		default:
			console.log('尚未覆盖方法:', ctx.method)
			return {}
	}
}

export function getUploadFileExt(str: string) {
	return str.split('.').pop() || 'unknown'
}

export function getUploadDirName() {
	const date = new Date()
	const month = date.getMonth() + 1
	const monthStr = date.getMonth() >= 10 ? `${month}` : `0${month}`
	const dir = `${date.getFullYear()}${monthStr}${date.getDate()}`
	return dir
}

export function checkDirExist(path: string) {
	try {
		const bo = fs.existsSync(path)
		if (bo === false) {
			fs.mkdirSync(path)
		}
	} catch (error) {
		console.error('checkDirExist:', error)
	}
}

export function getUploadFileName(ext: string) {
	return `${Date.now()}${(Math.random() * 10000).toFixed(0)}.${ext}`
}
