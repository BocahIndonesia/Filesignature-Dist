"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanFiles = exports.validateFileByMeta = exports.matchBytes = void 0;
const clients_1 = __importDefault(require("../../../utils/clients"));
const BadRequestError_1 = __importDefault(require("../../../utils/errors/BadRequestError"));
const prisma = clients_1.default.prisma;
function matchBytes(buffer, hex, offset) {
    hex = hex.replace(' ', '');
    const buffer2 = Buffer.from(hex, 'hex');
    const buffer2Len = hex.length / 2;
    return buffer.compare(buffer2, 0, buffer2Len, offset, buffer2Len) === 0;
}
exports.matchBytes = matchBytes;
function validateFileByMeta(file) {
    return __awaiter(this, void 0, void 0, function* () {
        if (file.size === 0)
            throw new BadRequestError_1.default('Size dari file tidak boleh 0 (tidak ada content)', { file: file.originalname, message: 'Size tidak boleh 0' });
        const temp = file.originalname.split('.');
        const extension = temp[temp.length - 1];
        const mime = file.mimetype;
        const signatures = yield prisma.$queryRaw `
    SELECT S.hex AS hex, S.offset AS offset, E.name AS extension, M.name AS mime
    FROM "Signature" AS S
    JOIN "Extension" AS E
    ON S.extension_id = E.id
    JOIN "Mime" AS M
    ON E.mime_id = M.id
    WHERE E.name = ${extension} AND M.name = ${mime}
    ORDER BY length(hex) DESC, S.offset
  `;
        for (const signature of signatures) {
            if (matchBytes(file.buffer, signature.hex, signature.offset)) {
                return true;
            }
        }
        return false;
    });
}
exports.validateFileByMeta = validateFileByMeta;
function scanFiles(files) {
    return __awaiter(this, void 0, void 0, function* () {
        let counter = files.length;
        let offset = 0;
        const limit = 100;
        const reports = [];
        while (counter > 0) {
            const signatures = yield prisma.$queryRaw `
      SELECT S.hex AS hex, S.offset AS offset, E.name AS extension, M.name AS mime
      FROM "Signature" AS S
      JOIN "Extension" AS E
      ON S.extension_id = E.id
      JOIN "Mime" AS M
      ON E.mime_id = M.id
      ORDER BY length(hex) DESC, S.offset
      OFFSET ${offset * limit}
      LIMIT ${limit}
    `;
            let indexFile = 0;
            for (const file of files) {
                const temp = file.originalname.split('.');
                const extension = temp[temp.length - 1];
                const mime = file.mimetype;
                if (yield validateFileByMeta(file)) {
                    reports.push({
                        file: file.originalname,
                        validity: true,
                        metas: [{ mime, extensions: [extension] }]
                    });
                    files.splice(indexFile, 1);
                }
            }
            for (const signature of signatures) {
                indexFile = 0;
                for (const file of files) {
                    if (matchBytes(file.buffer, signature.hex, signature.offset)) {
                        const metas = yield prisma.$queryRaw `
            SELECT M.name AS mime, STRING_AGG(E.name, ',') AS extensions
            FROM "Signature" AS S
            JOIN "Extension" AS E 
            ON S.extension_id = E.id
            JOIN "Mime" AS M
            ON E.mime_id = M.id
            WHERE S.hex = ${signature.hex} AND S.offset = ${signature.offset}
            GROUP BY mime
          `;
                        reports.push({
                            file: file.originalname,
                            validity: false,
                            metas: metas.map((meta) => ({ mime: meta.mime, extensions: meta.extensions.split(',') }))
                        });
                        files.splice(indexFile, 1);
                        counter--;
                    }
                    indexFile++;
                }
            }
            if (signatures.length < limit)
                break;
            offset++;
        }
        for (const file of files) {
            reports.push({
                file: file.originalname,
                validity: false,
                metas: []
            });
        }
        return reports;
    });
}
exports.scanFiles = scanFiles;
