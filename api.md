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

4、修改密码（/updatePassword, post）

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

5、获取用户信息（/login, post）

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

#### 

#### 二、article

#### (prefix: /article)

#### 三、files

(prefix: /files)