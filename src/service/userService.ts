import { createHash } from 'crypto'
import { OkPacket, RowDataPacket } from 'mysql2'
import { poolPromise } from '../db'
import { setValues } from './tool'

interface createdUserParams {
	userId: string
	userName: string
	password: string
	nickName: string
}
interface Profile {
	password?: string
	nickName?: string
	jobTitle?: string
	company?: string
	blogAddress?: string
	description?: string
	createDate?: Number
	updateDate?: Number
}

class Service {
	/* 增 */
	async createdUser(params: createdUserParams) {
		const time = new Date().getTime()
		const password = createHash('md5').update(params.password).digest('hex')
		const res = await poolPromise.query<OkPacket>(
			'INSERT INTO user(userId,userName,password,nickName,createDate,updateDate) VALUES(?,?,?,?,?,?)',
			[params.userId, params.userName, password, params.nickName, time, time]
		)
		return res[0]
	}
	/* 删 */
	/* 改 */
	async updateProfile(userId: string, params: Profile) {
		const Values = setValues(params)
		const res = await poolPromise.query<OkPacket>(`UPDATE user SET ${Values.itemKey} WHERE userId = ?`, [...Values.itemValue, userId])
		return res[0]
	}
	/* 查 */
	async queryMaxUserId() {
		const res = await poolPromise.query<RowDataPacket[]>('SELECT max(userId) FROM user')
		return res[0].map(({ userId }) => ({
			userId
		}))
	}
	async getUser(params: { userName: string }) {
		const res = await poolPromise.query<RowDataPacket[]>('SELECT userId FROM user WHERE  userName = ?', [params.userName])
		return res[0].map(({ userId }) => ({
			userId
		}))
	}
	async getLogin(params: { userName: string; password: string }) {
		const password = createHash('md5').update(params.password).digest('hex')
		const res = await poolPromise.query<RowDataPacket[]>('SELECT userId FROM user WHERE  userName = ? AND password = ?', [
			params.userName,
			password
		])
		return res[0].map(({ userId }) => ({
			userId
		}))
	}
	async getUserInfo(userId: string) {
		const res = await poolPromise.query<RowDataPacket[]>(
			`SELECT userId,nickName,jobTitle,company,blogAddress,description,createDate FROM user WHERE userId = ?`,
			[userId]
		)
		return res[0].map(({ userId, nickName, jobTitle, company, blogAddress, description, createDate }) => ({
			userId,
			nickName,
			jobTitle,
			company,
			blogAddress,
			description,
			createDate
		}))
	}
}

export default new Service()
