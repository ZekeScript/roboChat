import { Router } from 'express'

const router = Router()

router.get('/', (request, response) => {
  response.render('chat')
})

export default router
