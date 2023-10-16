"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractOrderParams = exports.extractPagination = exports.createAPIRoutes = void 0;
const express_1 = __importDefault(require("express"));
const asyncErrorCatcher_1 = __importDefault(require("../utils/asyncErrorCatcher"));
const authenticationHandler_1 = __importDefault(require("../middlewares/authenticationHandler"));
function createAPIRoutes(prefix, controller) {
    const router = express_1.default.Router();
    router.get(prefix, (0, asyncErrorCatcher_1.default)(controller.list.bind(controller)));
    router.post(prefix, [authenticationHandler_1.default], (0, asyncErrorCatcher_1.default)(controller.create.bind(controller)));
    router.get(prefix + '/:id', (0, asyncErrorCatcher_1.default)(controller.findWhereId.bind(controller)));
    router.patch(prefix + '/:id', [authenticationHandler_1.default], (0, asyncErrorCatcher_1.default)(controller.updateWhereId.bind(controller)));
    router.delete(prefix + '/:id', [authenticationHandler_1.default], (0, asyncErrorCatcher_1.default)(controller.deleteWhereId.bind(controller)));
    return router;
}
exports.createAPIRoutes = createAPIRoutes;
function extractPagination(query) {
    let a = query.pagination === undefined ? 10 : +query.pagination;
    a = a < 1 ? 10 : Math.round(a);
    let b = query.page === undefined ? 1 : +query.page;
    b = b < 0 ? 1 : Math.round(b);
    return [a, b];
}
exports.extractPagination = extractPagination;
function extractOrderParams(query) {
    const result = {};
    for (const key in query) {
        if (key.slice(0, 2) === 'o-') {
            result[key] = query[key];
        }
    }
    return result;
}
exports.extractOrderParams = extractOrderParams;
