/** article数据各项校验相关 */
export default {
	title: {
		regular: /^[\u4e00-\u9fa5A-Za-z0-9]{4,50}$/,
		msg: '标题只支持大小写字母和中文，长度4-50'
	},
	content: {
		regular: /^.{100,20000}$/,
		msg: '内容只支持100-20000个汉字'
	}
}
