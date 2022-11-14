import config from '../config'
import mysql from 'mysql2'
import sqlInit from './sql/sql'

const pool = mysql.createPool({
	host: config.DB.db_host,
	port: config.DB.db_port,
	database: config.DB.db_dataBaseName,
	user: config.DB.db_user,
	password: config.DB.db_password,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
})

const poolPromise = pool.promise()

// 初始化表格
function initDB() {
	console.log('database init...')
	pool.getConnection(err => {
		if (err) throw err
		sqlInit.forEach(item => {
			poolPromise
				.query(item.sql)
				.then(() => {
					console.log(`创建${item.title}成功！`)
				})
				.catch(err => {
					console.error(err)
				})
		})
	})
}
export { initDB, poolPromise }
