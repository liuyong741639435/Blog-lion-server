export default [
	// id表id，userId注册时生成的用户id,userName用户账户，password密码，要MD5后存储，
	// nickName昵称，iconUrl头像, jobTitle职位，company公司，blogAddress个人博客地址，description个人介绍，createDate创建时间，updateDate更新时间
	{
		title: 'user',
		sql: `
            CREATE TABLE IF NOT EXISTS user (
            id INT PRIMARY KEY AUTO_INCREMENT,
            userId VARCHAR(32) NOT NULL,
            userName VARCHAR(32) NOT NULL UNIQUE,
            password VARCHAR(32) NOT NULL,
            nickName VARCHAR(20) NOT NULL,
            iconUrl VARCHAR(100),
            jobTitle  VARCHAR(50),
            company VARCHAR(50),
            blogAddress VARCHAR(100),
            description VARCHAR(100),
            createDate BIGINT NOT NULL,
            updateDate BIGINT NOT NULL
        ) DEFAULT CHARSET=utf8;
        `
	},
	// id表id， aId文章id, userId用户id, title标题，content内容, introduction文章简介, state状态，browseCount浏览数,supportCount点赞数，commentCount评论数, createDate创建时间，updateDate更新时间
	{
		title: 'article',
		sql: `
                CREATE TABLE IF NOT EXISTS article (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    aId VARCHAR(255) NOT NULL,
                    userId VARCHAR(255) NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    content TEXT NOT NULL,
                    introduction  TEXT,
                    state TINYINT,
                    browseCount BIGINT,
                    supportCount BIGINT,
                    commentCount BIGINT,
                    createDate BIGINT NOT NULL,
                    updateDate BIGINT NOT NULL
                ) DEFAULT CHARSET=utf8;
            `
	},
	// 粉丝 关注 todo后续要实现拉黑屏蔽等
	{
		title: 'follower',
		sql: `CREATE TABLE IF NOT EXISTS follower (
                id int(6) unsigned NOT NULL,
                userId varchar(200) NOT NULL,
                followerUserId varchar(200) NOT NULL,
                PRIMARY KEY (id)
              ) DEFAULT CHARSET=utf8;
            `
	},
	// 评论
	{
		title: 'comments',
		sql: `CREATE TABLE IF NOT EXISTS comments (
                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                aId    BIGINT NOT NULL,
                parentId  BIGINT,
                content   TEXT   NOT NULL,
                userId    BIGINT NOT NULL,
                date      BIGINT NOT NULL,
                state TINYINT
              ) DEFAULT CHARSET=utf8;
            `
	}
]
