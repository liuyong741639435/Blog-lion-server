/** 重写部分类型 todo */
import { Context } from 'koa'

export interface User {
	userId?: ''
}

export interface Context2 extends Context {
	user?: {}
}
