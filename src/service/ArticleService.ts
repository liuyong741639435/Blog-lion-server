import { ArticleState } from '../types/article'
import { poolPromise } from '../db'

class Service {
	// 创建
	createArticle(params: { userId: string; aId: string; title: string; content: string; state: ArticleState; date: number }) {
		return poolPromise.query('INSERT INTO article(userId,aId,title,content,state,date) VALUES(?,?,?,?,?,?)', [
			params.userId,
			params.aId,
			params.title,
			params.content,
			params.state,
			params.date
		])
	}
	// 读取
	getArticle(params: { aId: string; userId: string; state: ArticleState }) {
		return poolPromise.query('SELECT title,content FROM article WHERE aId = ? or', [params.aId])
	}
	// 修改
	updateArticle(params: { aId: string; userId: string; title: string; content: string }) {
		return poolPromise.query('UPDATE article SET title = ?, content = ? WHERE aId = ? AND userId = ?', [
			params.title,
			params.content,
			params.aId,
			params.userId
		])
	}
	// 获取文章列表, 后续是要搜索,或者分类 todo
	// `SELECT a.id,a.title,a.userId,a.date,u.nickName,u.url FROM article a LEFT OUTER JOIN user u on a.userId = u.userId LIMIT ?,?`
	getArticleList(params: { currentPage: number; pageSize: number; state: number }) {
		const currentNumber = (params.currentPage - 1) * params.pageSize
		return poolPromise.query('SELECT id,title,userId,date FROM article WHERE state=? LIMIT ?,?', [
			params.state,
			currentNumber,
			params.pageSize
		])
	}
	// 删除
	deleteArticle(params: { aId: string; userId: string }) {
		return poolPromise.query('DELETE FROM article WHERE aId = ? AND userId = ?', [params.aId, params.userId])
	}
	// 修改状态
	setArticleState(params: { userId: string; aId: string; state: string }) {
		return poolPromise.query('UPDATE article SET state=? WHERE userId=? AND aId=?', [params.state, params.userId, params.aId])
	}
}
export default new Service()
