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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var paginate = function (schema) {
    /**
     * @typedef {Object} QueryResult
     * @property {Document[]} results - Results found
     * @property {number} page - Current page
     * @property {number} limit - Maximum number of results per page
     * @property {number} totalPages - Total number of pages
     * @property {number} totalResults - Total number of documents
     */
    /**
     * Query for documents with pagination
     * @param {Object} [filter] - Mongo filter
     * @param {Object} [options] - Query options
     * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
     * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
     * @param {number} [options.limit] - Maximum number of results per page (default = 10)
     * @param {number} [options.page] - Current page (default = 1)
     * @param {string} [options.projectBy] - Fields to hide or include (default = '')
     * @returns {Promise<QueryResult>}
     */
    schema.static('paginate', function (filter, options) {
        return __awaiter(this, void 0, void 0, function () {
            var sort, sortingCriteria_1, project, projectionCriteria_1, limit, page, skip, countPromise, docsPromise;
            return __generator(this, function (_a) {
                sort = '';
                if (options.sortBy) {
                    sortingCriteria_1 = [];
                    options.sortBy.split(',').forEach(function (sortOption) {
                        var _a = sortOption.split(':'), key = _a[0], order = _a[1];
                        sortingCriteria_1.push((order === 'desc' ? '-' : '') + key);
                    });
                    sort = sortingCriteria_1.join(' ');
                }
                else {
                    sort = 'createdAt';
                }
                project = '';
                if (options.projectBy) {
                    projectionCriteria_1 = [];
                    options.projectBy.split(',').forEach(function (projectOption) {
                        var _a = projectOption.split(':'), key = _a[0], include = _a[1];
                        projectionCriteria_1.push((include === 'hide' ? '-' : '') + key);
                    });
                    project = projectionCriteria_1.join(' ');
                }
                else {
                    project = '-createdAt -updatedAt';
                }
                limit = options.limit && parseInt(options.limit.toString(), 10) > 0 ? parseInt(options.limit.toString(), 10) : 10;
                page = options.page && parseInt(options.page.toString(), 10) > 0 ? parseInt(options.page.toString(), 10) : 1;
                skip = (page - 1) * limit;
                countPromise = this.countDocuments(filter).exec();
                docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit).select(project);
                if (options.populate) {
                    options.populate.split(',').forEach(function (populateOption) {
                        docsPromise = docsPromise.populate(populateOption
                            .split('.')
                            .reverse()
                            .reduce(function (a, b) { return ({ path: b, populate: a }); }));
                    });
                }
                docsPromise = docsPromise.exec();
                return [2 /*return*/, Promise.all([countPromise, docsPromise]).then(function (values) {
                        var totalResults = values[0], results = values[1];
                        var totalPages = Math.ceil(totalResults / limit);
                        var result = {
                            results: results,
                            page: page,
                            limit: limit,
                            totalPages: totalPages,
                            totalResults: totalResults,
                        };
                        return Promise.resolve(result);
                    })];
            });
        });
    });
};
exports.default = paginate;
