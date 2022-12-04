import { createHash } from 'crypto'
import { poolPromise } from '../db'
import { getWhereOr, setValues } from './tool'

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
	createDate?: string
	updateDate?: string
}

class Service {
	queryMaxUserId() {
		// 查库，找出最大的userID / 先用 new Date().getTime()代替
		// todo
		return new Date().getTime()
	}
	getUser(params: { userName: string }) {
		return poolPromise.query('SELECT userName FROM user WHERE  userName = ?', [params.userName])
	}
	createdUser(params: createdUserParams) {
		const time = new Date().getTime()
		const password = createHash('md5').update(params.password).digest('hex')
		return poolPromise.query('INSERT INTO user(userId,userName,password,nickName,createDate,updateDate) VALUES(?,?,?,?,?,?)', [
			params.userId,
			params.userName,
			password,
			params.nickName,
			time,
			time
		])
	}
	getLogin(params: { userName: string; password: string }) {
		const password = createHash('md5').update(params.password).digest('hex')
		return poolPromise.query('SELECT userId FROM user WHERE  userName = ? AND password = ?', [params.userName, password])
	}
	updateProfile(userId: string, params: Profile) {
		const res = setValues(params)
		return poolPromise.query(`UPDATE user SET ${res.itemKey} WHERE userId = ?`, [...res.itemValue, userId])
	}
	getUserInfo(userId: string) {
		return poolPromise.query(`SELECT * FROM user WHERE userId = ?`, [userId])
	}
	getNickName(userIdList: Array<string>) {
		const where = getWhereOr('userId', userIdList)
		return poolPromise.query(`SELECT nickName,userId  FROM user WHERE ${where}`)
	}
}

export default new Service()
