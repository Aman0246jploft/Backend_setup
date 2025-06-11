
const express = require('express');
const multer = require('multer');
const upload = multer();
const router = express.Router();
const globalCrudController = require('./globalCrudController');
const { User } = require('../../db');
const { getDocumentByQuery } = require('../services/serviceGlobalCURD');
const CONSTANTS_MSG = require('../../utils/constantsMessage');
const CONSTANTS = require('../../utils/constants')
const HTTP_STATUS = require('../../utils/statusCode');
const { apiErrorRes, verifyPassword, apiSuccessRes } = require('../../utils/globalFunction');
const { signToken } = require('../../utils/jwtTokenUtils');
const { loginSchema } = require('../services/validations/userValidation');
const validateRequest = require('../../middlewares/validateRequest');

const login = async (req, res) => {
    try {
        const email = String(req.body.email);
        const userCheckEmail = await getDocumentByQuery(User, { email });

        if (userCheckEmail.statusCode === CONSTANTS.SUCCESS) {
            if (userCheckEmail.data.isDisable === true) {
                return apiErrorRes(
                    HTTP_STATUS.BAD_REQUEST,
                    res,
                    CONSTANTS_MSG.ACCOUNT_DISABLE,
                    userCheckEmail.data
                );
            }

            // ✅ Continue with password verification
            const verifyPass = await verifyPassword(
                userCheckEmail.data.password,
                req.body.password
            );

            if (!verifyPass) {
                return apiErrorRes(
                    HTTP_STATUS.UNAUTHORIZED,
                    res,
                    CONSTANTS_MSG.INVALID_PASSWORD
                );
            }

            // ✅ Password is correct
            const bodyPayload = {};

            if (req.body?.fmcToken) {
                bodyPayload["fmcToken"] = req.body.fmcToken;
                userCheckEmail.data.fmcToken = req.body.fmcToken;
                await userCheckEmail.data.save();
            }

            const payload = {
                email: userCheckEmail.data.email,
                userId: userCheckEmail.data._id,
                roleId: userCheckEmail.data.roleId,
                role: userCheckEmail.data.role
            };

            const token = signToken(payload);

            const output = {
                token,
                userId: userCheckEmail.data._id,
                roleId: userCheckEmail.data.roleId,
                role: userCheckEmail.data.role
            };

            return apiSuccessRes(HTTP_STATUS.OK, res, CONSTANTS_MSG.SUCCESS, output);
        } else {
            return apiErrorRes(
                HTTP_STATUS.BAD_REQUEST,
                res,
                CONSTANTS_MSG.EMAIL_NOTFOUND,
                userCheckEmail.data
            );
        }
    } catch (error) {
        return apiErrorRes(
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            res,
            error.message,
            error.message
        );
    }
};



router.post('/login', upload.none(), validateRequest(loginSchema), login);

router.post('/create', upload.none(), globalCrudController.create(User));
router.post('/getById', upload.none(), globalCrudController.getById(User));
router.post('/update', upload.none(), globalCrudController.update(User));
router.post('/harddelete', upload.none(), globalCrudController.hardDelete(User));
router.post('/softDelete', upload.none(), globalCrudController.softDelete(User));
router.post('/getList', globalCrudController.getList(User));

module.exports = router;
