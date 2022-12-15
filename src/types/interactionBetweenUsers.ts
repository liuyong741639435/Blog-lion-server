export enum CommentState {
	PUBLIC,
	PRIVATE,
	DELETE
}

export interface CommentListItem {
	id: string
	aId: string
	userId: string
	parentId: string
	nickName: string
	iconUrl: string
	content: string
	date: string
	children?: CommentListItem[]
}
