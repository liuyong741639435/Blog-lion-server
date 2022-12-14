interface cacheData {
	value: any
	updateTime: number
}

type callBack = (key: string, value: any) => void

/* 延时执行 */
export default class {
	data: Record<string, cacheData | null> = {}
	loopTime = 1000
	cb: callBack | null = null
	constructor(cb: callBack, loopTime: number) {
		this.loopTime = loopTime
		this.cb = cb
		this.runLoop()
	}
	// 设置值
	set(key: string, value: any) {
		this.data[key] = {
			value,
			updateTime: new Date().getTime()
		}
	}
	// 取值
	get(key: string) {
		const data = this.data[key]
		if (data) {
			data.updateTime = new Date().getTime()
			return this.data[key]?.value || null
		} else {
			return null
		}
	}
	// 清除值
	remove(key: string) {
		this.data[key] = null
	}
	// 定期检查过期的指标,并执行特定回调如有
	// 启动loop
	runLoop() {
		this.loop()
		setInterval(() => {
			this.loop()
		}, this.loopTime)
	}
	// 逻辑
	loop() {
		// 期望的时间
		const expectedTime = new Date().getTime() - this.loopTime
		const keys = Object.keys(this.data)
		keys.forEach(key => {
			const item = this.data[key]
			if (item) {
				if (item.updateTime < expectedTime) {
					this.cb?.(key, item.value)
					this.remove(key)
				}
			}
		})
	}
}
