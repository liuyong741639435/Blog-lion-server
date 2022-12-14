import { ArticleState } from '../types/article'
import { poolPromise } from '../db'
import { getWhereOr } from './tool'
import { OkPacket, RowDataPacket } from 'mysql2'

class Service {
	/* 增 */
	// 创建
	async createArticle(params: { userId: string; aId: string; title: string; content: string; state: ArticleState; date: number }) {
		const res = await poolPromise.query<OkPacket>(
			'INSERT INTO article(userId,aId,title,content,state,createDate,updateDate) VALUES(?,?,?,?,?,?,?)',
			[params.userId, params.aId, params.title, params.content, params.state, params.date, params.date]
		)
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
		console.log(params)
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
	async setArticleBrowseCount(params: { aId: string; browseCount: number }) {
		const res = await poolPromise.query<OkPacket>('UPDATE article SET browseCount=? WHERE aId=?', [params.browseCount, params.aId])
		return res[0]
	}
	/* 查 */
	// 读取
	async getArticleByUser(params: { aId: string; userId: string }) {
		const res = await poolPromise.query<RowDataPacket[]>('SELECT title,content FROM article WHERE aId = ? AND userId = ?', [
			params.aId,
			params.userId
		])
		return res[0].map(({ title, content }) => ({
			title,
			content
		}))
	}
	async getArticle(params: { aId: string; userId: string; state: ArticleState }) {
		const res = await poolPromise.query<RowDataPacket[]>(
			'SELECT title,content,browseCount,supportCount,commentCount FROM article WHERE aId = ? AND state = ?',
			[params.aId, params.state]
		)
		return res[0].map(({ title, content, browseCount, supportCount, commentCount }) => ({
			title,
			content,
			browseCount,
			supportCount,
			commentCount
		}))
	}
	// 获取文章列表, 后续是要搜索,或者分类 todo
	async getArticleList(params: { currentPage: number; pageSize: number; state: number }) {
		console.log('params', params)
		const currentNumber = (params.currentPage - 1) * params.pageSize
		const res = await poolPromise.query<RowDataPacket[]>(
			'SELECT a.aId,a.title,a.briefIntroduction,a.userId,a.updateDate,u.nickName,u.iconUrl FROM article a LEFT OUTER JOIN user u on a.userId = u.userId WHERE state=? LIMIT ?,?',
			[params.state, currentNumber, params.pageSize]
		)
		return res[0].map(({ aId, title, briefIntroduction, userId, nickName, iconUrl, updateDate }) => ({
			aId,
			title,
			briefIntroduction,
			userId,
			nickName,
			iconUrl,
			updateDate
		}))
	}
	// 获取自身的文章列表
	async getArticleListByUser(params: { userId: string; states: number[] }) {
		let sql = 'SELECT aId,title,briefIntroduction,userId,updateDate FROM article'
		if (params.states.length > 0) {
			const where = getWhereOr('state', params.states)
			sql = `${sql} WHERE ${where} `
		}
		const res = await poolPromise.query<RowDataPacket[]>(sql)
		return res[0].map(({ aId, title, briefIntroduction, userId, updateDate }) => ({
			aId,
			title,
			briefIntroduction,
			userId,
			updateDate
		}))
	}
}
export default new Service()
