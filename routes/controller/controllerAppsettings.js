
const express = require('express');
const multer = require('multer');
const upload = multer();
const router = express.Router();
const globalCrudController = require('./globalCrudController');
const { AppSetting } = require('../../db');
// upload.none()

router.post('/create', upload.array('file'), globalCrudController.create(AppSetting));
router.post('/getById', globalCrudController.getById(AppSetting));
router.post('/update', upload.none(), globalCrudController.update(AppSetting));
router.post('/harddelete', globalCrudController.hardDelete(AppSetting));
router.post('/softDelete', globalCrudController.softDelete(AppSetting));
router.post('/getList', globalCrudController.getList(AppSetting));

module.exports = router;
