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
exports.scanFile = exports.validateFile = exports.validateMime = exports.validateExtension = exports.matchBytes = void 0;
const clients_1 = __importDefault(require("../../../utils/clients"));
const prisma = clients_1.default.prisma;
function matchBytes(buffer, hex, offset) {
    hex = hex.replace(' ', '');
    const buffer2 = Buffer.from(hex, 'hex');
    const buffer2Len = hex.length / 2;
    return buffer.compare(buffer2, 0, buffer2Len, offset, buffer2Len) === 0;
}
exports.matchBytes = matchBytes;
function validateExtension(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const temp = file.originalname.split('.');
        const extension = temp[temp.length - 1];
        const signatures = yield prisma.$queryRaw `
    SELECT S.hex AS hex, S.offset AS offset
    FROM "Signature" AS S
    JOIN "Extension" AS E
    ON S.extension_id = E.id
    WHERE E.name = ${extension} AND length(S.hex)/2 <= ${file.buffer.length}
    ORDER BY length(S.hex) DESC
  `;
        if (signatures.length > 0) {
            for (const signature of signatures) {
                if (matchBytes(file.buffer, signature.hex, signature.offset)) {
                    return {
                        validity: true,
                        validSignature: signature,
                        signatures,
                        message: 'Extension sudah valid'
                    };
                }
            }
            return {
                validity: false,
                validSignature: null,
                signatures,
                message: 'Extension tidak valid'
            };
        }
        return {
            validity: false,
            validSignature: null,
            signatures: [],
            message: `Tidak ditemukan signature untuk melakukan pencocokan pada file ber-extension: ${extension}`
        };
    });
}
exports.validateExtension = validateExtension;
function validateMime(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const signatures = yield prisma.$queryRaw `
    SELECT S.hex AS hex, S.offset AS offset
    FROM "Signature" AS S
    JOIN (
      SELECT E.id AS id, E.name AS name, M.name AS mime
      FROM "Extension" AS E
      JOIN "Mime" AS M
      ON E.mime_id = M.id
    ) AS E
    ON S.extension_id = E.id
    WHERE E.mime = ${file.mimetype} AND length(S.hex)/2 <= ${file.buffer.length}
    ORDER BY length(S.hex) DESC
  `;
        if (signatures.length > 0) {
            for (const signature of signatures) {
                if (matchBytes(file.buffer, signature.hex, signature.offset)) {
                    return {
                        validity: true,
                        validSignature: signature,
                        signatures,
                        message: 'Mime sudah valid'
                    };
                }
            }
            return {
                validity: false,
                validSignature: null,
                signatures,
                message: 'Mime tidak valid'
            };
        }
        return {
            validity: false,
            validSignature: null,
            signatures: [],
            message: `Tidak ditemukan signature untuk melakukan pencocokan pada file dengan mime: ${file.mimetype}`
        };
    });
}
exports.validateMime = validateMime;
function validateFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const temp = file.originalname.split('.');
        const extension = temp[temp.length - 1];
        const signatures = yield prisma.$queryRaw `
    SELECT S.hex AS hex, S.offset AS offset
    FROM "Signature" AS S
    JOIN "Extension" AS E
    ON S.extension_id = E.id
    JOIN "Mime" AS M
    ON E.mime_id = M.id
    WHERE E.name = ${extension} AND M.name = ${file.mimetype} AND length(S.hex)/2 <= ${file.buffer.length}
    ORDER BY length(S.hex) DESC
  `;
        if (signatures.length > 0) {
            for (const signature of signatures) {
                if (matchBytes(file.buffer, signature.hex, signature.offset)) {
                    return {
                        validity: true,
                        validSignature: signature,
                        signatures,
                        message: 'Extension dan Mime sudah valid satu sama lain.'
                    };
                }
            }
            return {
                validity: false,
                validSignature: null,
                signatures,
                message: 'Extension dan Mime tidak valid satu sama lain.'
            };
        }
        return {
            validity: false,
            validSignature: null,
            signatures: [],
            message: `Tidak ditemukan signature untuk melakukan pencocokan pada file dengan extension: ${extension} mime: ${file.mimetype}.`
        };
    });
}
exports.validateFile = validateFile;
function scanFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const temp = file.originalname.split('.');
        const extension = temp[temp.length - 1];
        const mime = file.mimetype;
        const ev = yield validateExtension(file);
        const mv = yield validateMime(file);
        if (mv.validity && ev.validity) {
            return {
                validity: true,
                validMime: mime,
                validExtension: extension
            };
        }
        else if (mv.validity && !ev.validity) {
            const signatures = yield prisma.$queryRaw `
      SELECT S.hex AS hex, S.offset AS offset, E.name AS extension
      FROM "Signature" AS S
      JOIN (
        SELECT E.id AS id, E.name AS name, M.name AS mime
        FROM "Extension" AS E
        JOIN "Mime" AS M
        ON E.mime_id = M.id
      ) AS E
      WHERE E.mime = ${mime}
      ORDER BY length(hex) DESC
    `;
            for (const signature of signatures) {
                if (matchBytes(file.buffer, signature.hex, signature.offset)) {
                    return {
                        validity: false,
                        validMime: mime,
                        validExtension: signature.extension
                    };
                }
            }
            return {
                validity: false,
                validMime: mime,
                validExtension: null
            };
        }
        else if (!mv.validity && ev.validity) {
            const validMime = (yield prisma.extension.findUniqueOrThrow({
                include: { mime: true },
                where: { name: extension }
            })).mime.name;
            return {
                validity: false,
                validMime,
                validExtension: extension
            };
        }
        // tambahkan kode extreme, looping seluruh data untuk cek 1 per 1 signature...
        return {
            validity: false,
            validMime: null,
            validExtension: null
        };
    });
}
exports.scanFile = scanFile;
