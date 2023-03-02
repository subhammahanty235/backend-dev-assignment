const fetchUser = require('../middleware/fetchUser.middleware')

const router = require('express').Router()
const UserController = require("../controller/user.controller")

router.post("/createnewuser" , fetchUser , UserController.adduserorAdmin)
router.post("/login" ,UserController.logIn)
router.put("/updateuser" , fetchUser , UserController.updateUser)
router.get("/viewdata" , fetchUser , UserController.viewUsers) 

module.exports = router;