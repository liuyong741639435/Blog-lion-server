export function setValues(obj: any) {
	const itemKey = []
	const itemValue = []
	for (const key in obj) {
		if (obj[key] !== undefined && obj[key] !== null) {
			itemKey.push(`${key}=?`)
			itemValue.push(obj[key])
		}
	}
	return {
		itemKey: itemKey.join(','),
		itemValue
	}
}

export function getWhereOr(key: string, list: Array<string>) {
	return list.map(item => `${key}=${item}`).join(' or ')
}
