import { poolPromise } from '../db'

class Service {
	// 创建
	createArticle(params: { userId: string; title: string; content: string; state: number; date: number }) {
		return poolPromise.query('INSERT INTO article(userId,title,content,state,date) VALUES(?,?,?,?,?)', [
			params.userId,
			params.title,
			params.content,
			params.state,
			params.date
		])
	}
	// 读取
	getArticle(params: { id: string }) {
		return poolPromise.query('SELECT title,content FROM article WHERE id = ?', [params.id])
	}
	// 修改
	updateArticle(params: { id: string; userId: string; title: string; content: string }) {
		const { id, userId, title, content } = params
		if (title && content) {
			// 同时修改 title content
			return poolPromise.query('UPDATE article SET title = ?, content = ? WHERE id = ? AND userId = ?', [title, content, id, userId])
		} else if (title) {
			// 修改 title
			return poolPromise.query('UPDATE article SET title = ? WHERE id = ? AND userId = ?', [title, id, userId])
		} else if (content) {
			// 修改content
			return poolPromise.query('UPDATE article SET content = ? WHERE id = ? AND userId = ?', [content, id, userId])
		}
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
	deleteArticle(params: { id: string; userId: string }) {
		return poolPromise.query('DELETE FROM article WHERE id = ? AND userId = ?', [params.id, params.userId])
	}
	// 修改状态
	setArticleState(params: { userId: string; id: string; state: string }) {
		return poolPromise.query('UPDATE article SET state=? WHERE userId=? AND id=?', [params.state, params.userId, params.id])
	}
}
export default new Service()
