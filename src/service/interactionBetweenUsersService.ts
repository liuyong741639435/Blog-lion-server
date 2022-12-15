import { poolPromise } from 'db'
import { OkPacket, RowDataPacket } from 'mysql2'
import { CommentState } from 'types/interactionBetweenUsers'

class Service {
	/* 增 */
	// 新增关注
	async createFollower(params: { userId: string; followerUserId: string }) {
		const res = await poolPromise.query<OkPacket>('INSERT INTO follower(userId,followerUserId) VALUES(?,?)', [
			params.userId,
			params.followerUserId
		])
		return res[0]
	}

	async createComment(params: { aId: string; userId: string; parentId: string; content: string; date: number; state: CommentState }) {
		const res = await poolPromise.query<OkPacket>('INSERT INTO comments(aId,userId,parentId,content,date, state) VALUES(?,?,?,?,?,?)', [
			params.aId,
			params.userId,
			params.parentId ?? null,
			params.content,
			params.date,
			params.state
		])
		return res[0]
	}
	/* 删 */
	async deleteFollower(params: { userId: string; followerUserId: string }) {
		const res = await poolPromise.query<OkPacket>('DELETE FROM follower WHERE userId = ? AND followerUserId = ?', [
			params.userId,
			params.followerUserId
		])
		return res[0]
	}
	/* 改 */
	async updateComment(params: { userId: string; id: string; state: CommentState }) {
		const res = await poolPromise.query<OkPacket>('UPDATE comments SET state=? WHERE userId=? AND id=?', [
			params.state,
			params.userId,
			params.id
		])
		return res[0]
	}
	/* 查 */
	// 我关注的人 todo 联合查询待测试
	async getFollower(params: { userId: string }) {
		const res = await poolPromise.query<RowDataPacket[]>(
			'SELECT f.followerUserId,u.nickName,u.iconUrl from follower f LEFT OUTER JOIN user u on userId = ?',
			[params.userId]
		)
		return res[0].map(({ followerUserId, nickName, iconUrl }) => ({
			followerUserId,
			nickName,
			iconUrl
		}))
	}
	// 关注我的人
	async getFans(params: { userId: string }) {
		const res = await poolPromise.query<RowDataPacket[]>('SELECT userId from follower WHERE followerUserId = ?', [params.userId])
		return res[0].map(({ userId }) => ({
			userId
		}))
	}
	// 查询文章下的评论
	async getComment(params: { aId: string; state: CommentState }) {
		const res = await poolPromise.query<RowDataPacket[]>(
			'SELECT a.id,a.aId,a.userId,a.parentId,b.nickName,b.iconUrl,a.content,a.date from comments AS a,users AS b WHERE a.aId= ? AND state = ? AND a.userId=b.userId',
			[params.aId, params.state]
		)
		return res[0].map(({ id, aId, userId, parentId, nickName, iconUrl, content, date }) => ({
			id,
			aId,
			userId,
			parentId,
			nickName,
			iconUrl,
			content,
			date
		}))
	}
}
export default new Service()
