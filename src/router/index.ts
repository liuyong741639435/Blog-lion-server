import config from '../config'
import koaRouter from 'koa-router'

const router = new koaRouter()

router.prefix(config.app.prefix || '')

export default router
