import { ArticleState } from '../types/article'
import { poolPromise } from '../db'
import { getWhereOr } from './tool'
import { OkPacket, RowDataPacket } from 'mysql2'

class Service {
	/* 增 */
	// 创建
	async createArticle(params: { userId: string; aId: string; title: string; content: string; state: ArticleState; date: number }) {
		const res = await poolPromise.query<OkPacket>('INSERT INTO article(userId,aId,title,content,state,date) VALUES(?,?,?,?,?,?)', [
			params.userId,
			params.aId,
			params.title,
			params.content,
			params.state,
			params.date
		])
		return res[0]
	}
	/* 删 */
	// 删除
	async deleteArticle(params: { aId: string; userId: string }) {
		const res = await poolPromise.query<OkPacket>('DELETE FROM article WHERE aId = ? AND userId = ?', [params.aId, params.userId])
		return res[0]
	}
	/* 改 */
	// 修改
	async updateArticle(params: { aId: string; userId: string; title: string; content: string }) {
		const res = await poolPromise.query<OkPacket>('UPDATE article SET title = ?, content = ? WHERE aId = ? AND userId = ?', [
			params.title,
			params.content,
			params.aId,
			params.userId
		])
		return res[0]
	}
	// 修改状态
	async setArticleState(params: { userId: string; aId: string; state: string }) {
		const res = await poolPromise.query<OkPacket>('UPDATE article SET state=? WHERE userId=? AND aId=?', [
			params.state,
			params.userId,
			params.aId
		])
		return res[0]
	}
	/* 查 */
	// 读取
	async getArticle(params: { aId: string; userId: string; state: ArticleState }) {
		const res = await poolPromise.query<RowDataPacket[]>('SELECT title,content FROM article WHERE aId = ?', [params.aId])
		return res[0].map(({ title, content }) => ({
			title,
			content
		}))
	}
	// 获取文章列表, 后续是要搜索,或者分类 todo
	// `SELECT a.id,a.title,a.userId,a.date,u.nickName,u.url FROM article a LEFT OUTER JOIN user u on a.userId = u.userId LIMIT ?,?`
	async getArticleList(params: { currentPage: number; pageSize: number; state: number }) {
		const currentNumber = (params.currentPage - 1) * params.pageSize
		const res = await poolPromise.query<RowDataPacket[]>('SELECT aId,title,userId,date FROM article WHERE state=? LIMIT ?,?', [
			params.state,
			currentNumber,
			params.pageSize
		])
		return res[0].map(({ aId, title, userId, date }) => ({
			aId,
			title,
			userId,
			date
		}))
	}
	// 获取自身的文章
	async getArticleByUser(params: { userId: string; states: number[] }) {
		let sql = 'SELECT aId,title,userId,date FROM article'
		if (params.states.length > 0) {
			const where = getWhereOr('state', params.states)
			sql = `${sql} WHERE ${where} `
		}
		const res = await poolPromise.query<RowDataPacket[]>(sql)
		res[0].map(({ aId, title, userId, date }) => ({
			aId,
			title,
			userId,
			date
		}))
	}
}
export default new Service()
