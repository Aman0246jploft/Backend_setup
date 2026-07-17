const express = require('express');
const router = express.Router();
const globalCrudController = require('./globalCrudController');
const { User } = require('../../db');
const { getDocumentByQuery } = require('../services/serviceGlobalCURD');
const CONSTANTS_MSG = require('../../utils/constantsMessage');
const CONSTANTS = require('../../utils/constants')
const HTTP_STATUS = require('../../utils/statusCode');
const { apiErrorRes, verifyPassword, apiSuccessRes } = require('../../utils/globalFunction');
const { signToken } = require('../../utils/jwtTokenUtils');
const { loginSchema, registerSchema } = require('../services/validations/userValidation');
const validateRequest = require('../../middlewares/validateRequest');
const perApiLimiter = require('../../middlewares/rateLimiter');

// Register a new user
const register = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email: email.toLowerCase().trim() });
        if (userExists) {
            return apiErrorRes(
                HTTP_STATUS.CONFLICT,
                res,
                "Email already in use",
                null
            );
        }

        // Create new user
        const newUser = new User({
            userName,
            email,
            password
        });

        await newUser.save();

        return apiSuccessRes(
            HTTP_STATUS.CREATED,
            res,
            "User registered successfully",
            newUser
        );
    } catch (error) {
        return apiErrorRes(
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            res,
            error.message,
            null
        );
    }
};

// Login user
const login = async (req, res) => {
    try {
        const email = String(req.body.email).toLowerCase().trim();
        const userResult = await getDocumentByQuery(User, { email });

        if (userResult.statusCode === CONSTANTS.SUCCESS) {
            const user = userResult.data;

            // Verify password
            const isMatch = await verifyPassword(user.password, req.body.password);
            if (!isMatch) {
                return apiErrorRes(
                    HTTP_STATUS.UNAUTHORIZED,
                    res,
                    CONSTANTS_MSG.INVALID_PASSWORD
                );
            }

            const payload = {
                email: user.email,
                userId: user._id
            };

            const token = signToken(payload);

            const output = {
                token,
                userId: user._id
            };

            return apiSuccessRes(HTTP_STATUS.OK, res, CONSTANTS_MSG.SUCCESS, output);
        } else {
            return apiErrorRes(
                HTTP_STATUS.BAD_REQUEST,
                res,
                CONSTANTS_MSG.EMAIL_NOTFOUND,
                null
            );
        }
    } catch (error) {
        return apiErrorRes(
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            res,
            error.message,
            null
        );
    }
};

// Authentication routes
router.post('/register', perApiLimiter(), validateRequest(registerSchema), register);
router.post('/login', perApiLimiter(), validateRequest(loginSchema), login);

// CRUD routes
router.post('/getById', perApiLimiter(), globalCrudController.getById(User));
router.post('/update', perApiLimiter(), globalCrudController.update(User));
router.post('/harddelete', perApiLimiter(), globalCrudController.hardDelete(User));
router.post('/softDelete', perApiLimiter(), globalCrudController.softDelete(User));
router.get('/getList', perApiLimiter(), globalCrudController.getList(User));

module.exports = router;
