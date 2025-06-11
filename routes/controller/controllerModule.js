
const express = require('express');
const multer = require('multer');
const upload = multer();
const router = express.Router();
const globalCrudController = require('./globalCrudController');
const { Module } = require('../../db');
const validateRequest = require('../../middlewares/validateRequest');
const { moduleSchema } = require('../services/validations/moduleValidation');
const { moduleSchemaForId } = require('../services/validations/globalCURDValidation');

// validateRequest(moduleSchema),
router.post('/create', upload.none(), globalCrudController.create(Module));
router.post('/getById', upload.none(),validateRequest(moduleSchemaForId) ,globalCrudController.getById(Module));
router.post('/update', upload.none(), globalCrudController.update(Module));
router.post('/harddelete', upload.none(), globalCrudController.hardDelete(Module));
router.post('/softDelete', upload.none(), globalCrudController.softDelete(Module));
router.post('/getList', globalCrudController.getList(Module));

module.exports = router;
