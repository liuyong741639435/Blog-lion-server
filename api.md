# 接口文档

url:127.0.0.1:80

prefix: /api

示例：http://127.0.0.1/api/user/queryUserName

说明：接口login标识说明需要携带token

#### 一、user

(prefix: /user)

1、查询账号（/queryUserName, get）

```tsx
req: {
	userName：string; // 账号
}

res: {
	code: number; // 0 / 1 成功与否
	msg: string; // 提示
	data：null
}
```

2、注册（/register, post）

```tsx
req: {
	userName：string; // 账号
    password: string; // 密码
}

res: {
	code: number; // 0 / 1 成功与否
	msg: string; // 提示
	data：null;
}
```

3、登录（/login, post）

```tsx
req: {
	userName：string; // 账号
}
res: {
	code: number; // 0 / 1 成功与否
	msg: string; // 提示
	data：{
	 token: string; // token用于校验登录
	}
}
```

4、修改密码（/updatePassword, post,login）

```tsx
req: {
	userName：string; // 账号
    password: string; // 密码
}
res: {
	code: number; // 0 / 1 成功与否
	msg: string; // 提示
	data：null
}
```

5、获取用户信息（/userInfo, get,login）

```tsx
req: {
}
res: {
	code: number; // 0 / 1 成功与否
	msg: string; // 提示
	data：{
	 userId: string;
	 nickName: string; // 昵称
     jobTitle: string; // 职务
	 company: string; // 公司
     blogAddress: string; // 博客地址
     description: string; // 个人简介
     createDate: number; // 注册时间 时间戳
	}
}
```

#### 二、article

#### (prefix: /article)

1、查询文章详情（/getArticle, get,login）

```tsx
req: {
    aId： string; // 文章id
}
res: {
	code: number; // 0 / 1 成功与否
	msg: string; // 提示
	data：{
	 userId: string;
	 nickName: string; // 昵称
     jobTitle: string; // 职务
	 company: string; // 公司
     blogAddress: string; // 博客地址
     description: string; // 个人简介
     createDate: number; // 注册时间 时间戳
	}
}
```

#### 

#### 三、files

(prefix: /files)