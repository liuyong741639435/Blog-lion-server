import { poolPromise } from 'db'
import { OkPacket, RowDataPacket } from 'mysql2'

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
	/* 删除 */
	async deleteFollower(params: { userId: string; followerUserId: string }) {
		const res = await poolPromise.query<OkPacket>('DELETE FROM follower WHERE userId = ? AND followerUserId = ?', [
			params.userId,
			params.followerUserId
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
}
export default new Service()
