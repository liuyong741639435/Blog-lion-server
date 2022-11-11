export default [
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
	}
]
