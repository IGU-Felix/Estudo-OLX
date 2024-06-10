import { Router } from "express"
import { getStates, info } from '../controllers/UserController.js'
import { authPrivate } from "../middleware/Auth.js"

const router = Router()

router.get("/states", getStates)

router.get("/user/me", info, authPrivate)
// router.put("/user/me", update)

export default router