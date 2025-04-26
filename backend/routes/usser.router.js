//
const express = require('express');
const {
    registeruser,
    loginuser,
    loggedout,
    changepassword,
    update,
    updateuseravatar,
    updateusercoverimage,
    profiledetails,
   addFastingData,
    getcurrentuser,
    refreshaccesstoken,
    getUserProfile
   
    
} = require('../controllers/user.controller');
const getFastingHistory = require('../controllers/fasting.controller')

const isloggedin = require('../middlewares/auth.middleware');
const upload = require('../middlewares/multer');

const router = express.Router();


router.route('/register').post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1,
        },
        {
           name: "coverimage",
           maxCount:1
        }
    ]),
    registeruser)
//router.post('/register', upload.single(), registeruser)
 
router.route('/login').post(loginuser)

router.route('/logout').post(isloggedin, loggedout)
router.route('/changePass').post(isloggedin,changepassword)
router.route('/update').put(isloggedin, update)
router.route('/update-avatar').put(isloggedin,upload.single("avatar"), updateuseravatar)
router.route('/updatecoverimage').patch(isloggedin,upload.single("coverimage"), updateusercoverimage)
router.route("/c/:username").get(isloggedin, profiledetails )

router.route('/currentuser').get(isloggedin, getcurrentuser)
router.route('/refreshtoken').post(refreshaccesstoken)
router.route('/add').post(isloggedin,addFastingData)
router.route('/history').get(isloggedin, getFastingHistory)
router.route('/profile').get(isloggedin, getUserProfile)





module.exports = router;