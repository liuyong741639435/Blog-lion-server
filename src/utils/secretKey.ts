/*使用node-rsa生成秘钥对*/

import NodeRSA from 'node-rsa'

export default class SecretKey {
	pubkey = ''
	prikey = ''
	constructor() {
		const key = new NodeRSA({ b: 512 })
		this.pubkey = key.exportKey('pkcs8-public')
		this.prikey = key.exportKey('pkcs8-private')
	}
}
