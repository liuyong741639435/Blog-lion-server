/** 生成token 解析token */
import config from '../config'
import jwt from 'jsonwebtoken'
import SecretKey from './secretKey'

// 生成非对称密钥
const { prikey, pubkey } = new SecretKey()

// 生成token
function sign<T extends Object>(data: T) {
	return jwt.sign(data, prikey, { algorithm: 'RS256', expiresIn: config.jwt.jwt_sercet })
}

// 解析token
function verify(token: string) {
	try {
		const decoded = jwt.verify(token, pubkey)
		return {
			data: decoded,
			error: null
		}
	} catch (error) {
		return {
			data: null,
			error: error
		}
	}
}

export { sign, verify }
