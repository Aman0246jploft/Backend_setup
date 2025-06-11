const { apiSuccessRes, apiErrorRes } = require('../../utils/globalFunction');
const {
  createDocument,
  getDocumentById,
  updateDocument,
  deleteDocument,
  softDeleteDocument,
  getAllDocuments
} = require('../services/serviceGlobalCURD');

const CONSTANTS_MSG = require("../../utils/constantsMessage")
const CONSTANTS = require('../../utils/constants');
const HTTP_STATUS = require('../../utils/statusCode');


// Generic CRUD functions
const globalCrudController = {
  create: (model) => async (req, res) => {
    try {

      const modelData = await createDocument(model, req.body);
      if (modelData.statusCode === CONSTANTS.SUCCESS)
        return apiSuccessRes(HTTP_STATUS.OK, res, CONSTANTS_MSG.SUCCESS, modelData.data);
      return apiErrorRes(HTTP_STATUS.BAD_REQUEST, res, modelData.data, modelData.data);
    } catch (error) {
      return apiErrorRes(HTTP_STATUS.INTERNAL_SERVER_ERROR, res, error.message, error.message);
    }
  },

  getById: (model) => async (req, res) => {
    try {
      const { id } = req.body;
      const modelData = await getDocumentById(model, id);
      if (modelData.statusCode === CONSTANTS.SUCCESS)
        return apiSuccessRes(HTTP_STATUS.OK, res, CONSTANTS_MSG.SUCCESS, modelData.data);

      return apiErrorRes(HTTP_STATUS.BAD_REQUEST, res, CONSTANTS_MSG.NOT_FOUND, CONSTANTS.DATA_NULL);
    } catch (error) {
      return apiErrorRes(HTTP_STATUS.INTERNAL_SERVER_ERROR, res, error.message, error.message);
    }
  },

  update: (model) => async (req, res) => {
    try {
      const { id } = req.body;
      const modelData = await updateDocument(model, _id, req.body);
      if (modelData.statusCode === CONSTANTS.SUCCESS)
        return apiSuccessRes(HTTP_STATUS.OK, res, CONSTANTS_MSG.SUCCESS, modelData.data);

      return apiErrorRes(HTTP_STATUS.BAD_REQUEST, res, CONSTANTS_MSG.FAILED, CONSTANTS.DATA_NULL);
    } catch (error) {
      return apiErrorRes(HTTP_STATUS.INTERNAL_SERVER_ERROR, res, error.message, error.message);
    }
  },

  hardDelete: (model) => async (req, res) => {
    try {
      const { id } = req.body;
      const modelData = await deleteDocument(model, id);
      if (modelData.statusCode === CONSTANTS.SUCCESS)
        return apiSuccessRes(HTTP_STATUS.OK, res, CONSTANTS_MSG.SUCCESS, modelData.data);

      return apiErrorRes(HTTP_STATUS.BAD_REQUEST, res, CONSTANTS_MSG.FAILED, CONSTANTS.DATA_NULL);
    } catch (error) {
      return apiErrorRes(HTTP_STATUS.INTERNAL_SERVER_ERROR, res, error.message, error.message);
    }
  },

  softDelete: (model) => async (req, res) => {
    try {
      const { id } = req.body;
      const modelData = await softDeleteDocument(model, id);
      if (modelData.statusCode === CONSTANTS.SUCCESS)
        return apiSuccessRes(HTTP_STATUS.OK, res, CONSTANTS_MSG.SUCCESS, modelData.data);

      return apiErrorRes(HTTP_STATUS.BAD_REQUEST, res, CONSTANTS_MSG.FAILED, CONSTANTS.DATA_NULL);
    } catch (error) {
      return apiErrorRes(HTTP_STATUS.INTERNAL_SERVER_ERROR, res, error.message, error.message);
    }
  },

  getList: (model) => async (req, res) => {
    try {
      const options = {
        pageNo: req.body.pageNo || 1,
        size: req.body.size || 10,
        sortBy: req.body.sortBy || 'createdAt',
        sortOrder: req.body.sortOrder || 'desc',
        keyWord: req.body.keyWord || '',
        searchFields: req.body.searchFields || "",
        query: req.body.query || {},
        select: req.body.select || "",
        fromDate: req.body.fromDate || "",
        toDate: req.body.toDate || "",
        populate: Array.isArray(req.body.populate) ? req.body.populate : []
      };

      const modelData = await getAllDocuments(model, options);
      if (modelData.statusCode === CONSTANTS.SUCCESS)
        return apiSuccessRes(HTTP_STATUS.OK, res, CONSTANTS_MSG.SUCCESS, modelData.data);

      return apiErrorRes(HTTP_STATUS.BAD_REQUEST, res, CONSTANTS_MSG.FAILED, CONSTANTS.DATA_NULL);
    } catch (error) {
      return apiErrorRes(HTTP_STATUS.INTERNAL_SERVER_ERROR, res, error.message, error.message);
    }
  }
};

module.exports = globalCrudController;