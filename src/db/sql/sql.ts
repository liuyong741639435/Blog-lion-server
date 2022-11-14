export default [
	// id表id，userId注册时生成的用户id,userName用户账户，password密码，要MD5后存储，
	// nickName昵称，jobTitle职位，company公司，blogAddress个人博客地址，description个人介绍，createDate创建时间，updateDate更新时间
	{
		title: 'user',
		sql: `
            CREATE TABLE IF NOT EXISTS user (
            id INT PRIMARY KEY AUTO_INCREMENT,
            userId VARCHAR(32) NOT NULL,
            userName VARCHAR(32) NOT NULL UNIQUE,
            password VARCHAR(32) NOT NULL,
            nickName VARCHAR(20) NOT NULL,
            jobTitle  VARCHAR(50),
            company VARCHAR(50),
            blogAddress VARCHAR(100),
            description VARCHAR(100),
            createDate BIGINT NOT NULL,
            updateDate BIGINT NOT NULL
        )
        `
	},
	// id表id，userId用户id, title标题，content内容，date新建时间， state状态
	{
		title: 'article',
		sql: `
                CREATE TABLE IF NOT EXISTS article (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    userId VARCHAR(255) NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    content TEXT NOT NULL,
                    date BIGINT NOT NULL,
                    state TINYINT
                )
            `
	}
]
