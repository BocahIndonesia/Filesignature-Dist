"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../utils/configs"));
const BadRequestError_1 = __importDefault(require("../utils/errors/BadRequestError"));
const multer_1 = require("multer");
function default_1(err, req, res, next) {
    if (err instanceof BadRequestError_1.default) {
        return res.status(err.code).json(Object.assign({ status: 'fail' }, err.toObject()));
    }
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send({
            status: 'fail',
            message: 'Data yang dikirimkan tidak dalam format JSON yang valid',
            details: [{
                    body: err.body,
                    message: 'Bukan format JSON yang valid'
                }]
        });
    }
    if (err instanceof multer_1.MulterError) {
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).send({
                status: 'fail',
                message: `Ada field/input yang tidak diperlukan dikirim ke server atau jumlah file melebihi maksimum: ${configs_1.default.multer.limit_files}.`,
                details: {
                    field: err.field,
                    message: 'Field ini tidak dibutuhkan atau melebihi batas maksimum file.'
                }
            });
        }
    }
    console.log(err);
    console.log(err.stack);
    return res.status(500).json({
        status: 'error',
        contact: configs_1.default.developer.email,
        message: 'Ada kesalahan yang tidak diantisipasi di server, please contact us.'
    });
}
exports.default = default_1;
