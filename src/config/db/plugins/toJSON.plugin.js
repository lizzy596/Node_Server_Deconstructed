"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */
var deleteAtPath = function (obj, path, index) {
    if (index === path.length - 1) {
        // eslint-disable-next-line no-param-reassign
        delete obj[path[index]];
        return;
    }
    deleteAtPath(obj[path[index]], path, index + 1);
};
var toJSON = function (schema) {
    var transform;
    if (schema.options.toJSON && schema.options.toJSON.transform) {
        transform = schema.options.toJSON.transform;
    }
    // eslint-disable-next-line no-param-reassign
    schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
        transform: function (doc, ret, options) {
            Object.keys(schema.paths).forEach(function (path) {
                if (schema.paths[path].options && schema.paths[path].options.private) {
                    deleteAtPath(ret, path.split('.'), 0);
                }
            });
            // eslint-disable-next-line no-param-reassign
            ret.id = ret._id.toString();
            // eslint-disable-next-line no-param-reassign
            delete ret._id;
            // eslint-disable-next-line no-param-reassign
            delete ret.__v;
            // eslint-disable-next-line no-param-reassign
            delete ret.createdAt;
            // eslint-disable-next-line no-param-reassign
            delete ret.updatedAt;
            if (transform) {
                return transform(doc, ret, options);
            }
        },
    });
};
exports.default = toJSON;
