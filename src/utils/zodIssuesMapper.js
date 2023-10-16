"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(issues) {
    return issues.map(function (issue) {
        return {
            property: issue.path.join('.'),
            rule: issue.message
        };
    });
}
exports.default = default_1;
