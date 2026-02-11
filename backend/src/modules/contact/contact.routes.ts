import {Router} from 'express'
import { contact } from './contact.controller.js'

const router: Router = Router()

router.post('/contact', contact)

export default router;