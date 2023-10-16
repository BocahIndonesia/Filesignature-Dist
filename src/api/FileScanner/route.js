"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../../utils/configs"));
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const asyncErrorCatcher_1 = __importDefault(require("../../utils/asyncErrorCatcher"));
const multer_1 = __importDefault(require("multer"));
const controller = new controller_1.default();
const router = express_1.default.Router();
const multerMiddleware = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() }).array('files', configs_1.default.multer.limit_files);
router.post('/filesignature/scanner', [multerMiddleware], (0, asyncErrorCatcher_1.default)(controller.scanFiles.bind(controller)));
exports.default = router;
