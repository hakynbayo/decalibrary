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
exports.authUser = exports.rateLimiter = exports.authAdmin = exports.authToken = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const http_response_1 = require("../utils/http_response");
const utils_1 = __importDefault(require("../utils/utils"));
const AdminService_1 = __importDefault(require("../services/AdminService"));
const UserService_1 = __importDefault(require("../services/UserService"));
const redis_1 = __importDefault(require("../config/redis"));
const moment_1 = __importDefault(require("moment"));
const config_1 = require("../config/config");
/**
  * authToken
  * @desc A middleware to authenticate users token
  * @param {Object} req request any
  * @param {Object} res response object
  * @param {Function} next nextFunction middleware
  * @returns {void|Object} object
  */
const authToken = (req, res, next) => {
    const bearerToken = req.headers["authorization"];
    if (!bearerToken) {
        const errMessage = "Access denied. No token provided.";
        return http_response_1.http_responder.errorResponse(res, errMessage, http_status_codes_1.default.UNAUTHORIZED);
    }
    const token = bearerToken.split(' ')[1];
    // Verify token
    try {
        const decoded = utils_1.default.verifyToken(token);
        req.id = decoded.id;
        next();
    }
    catch (err) {
        const errMessage = "Invalid token. Please login";
        return http_response_1.http_responder.errorResponse(res, errMessage, http_status_codes_1.default.UNAUTHORIZED);
    }
};
exports.authToken = authToken;
/**
   * authAdmin
   * @desc A middleware to authenticate admin users
   * @param {Object} req request any
   * @param {Object} res response object
   * @param {Function} next nextFunction middleware
   * @returns {void|Object} object
   */
const authAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield AdminService_1.default.getAdminIdAndRole(req.id);
        if (!admin) {
            const errMessage = "Invalid token. Please login";
            return http_response_1.http_responder.errorResponse(res, errMessage, http_status_codes_1.default.UNAUTHORIZED);
        }
        req.user = admin;
        next();
    }
    catch (err) {
        const errMessage = "Invalid token. Please login";
        return http_response_1.http_responder.errorResponse(res, errMessage, http_status_codes_1.default.UNAUTHORIZED);
    }
});
exports.authAdmin = authAdmin;
const rateLimiter = (req, res, next) => {
    try {
        // * fetch records of current user using user ID, returns null when no record is found
        redis_1.default.get(req.id, (err, record) => {
            if (err) {
                return http_response_1.http_responder.errorResponse(res, err.message, http_status_codes_1.default.UNPROCESSABLE_ENTITY);
            }
            const currentRequestTime = (0, moment_1.default)();
            // *  if no record is found , create a new record for user and store to redis
            if (record == null) {
                const newRecord = [];
                const requestLog = {
                    requestTimeStamp: currentRequestTime.unix(),
                    requestCount: 1,
                };
                newRecord.push(requestLog);
                redis_1.default.set(req.id, JSON.stringify(newRecord));
                return next();
            }
            // * if record is found, parse it's value and calculate number of requests users has made within the last window
            const data = JSON.parse(record);
            const windowStartTimestamp = (0, moment_1.default)()
                .subtract(config_1.config.windowSizeInHours, "hours")
                .unix();
            const requestsWithinWindow = data.filter((entry) => {
                return entry.requestTimeStamp > windowStartTimestamp;
            });
            const totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
                return accumulator + entry.requestCount;
            }, 0);
            // * if number of requests made is greater than or equal to the desired maximum, return error
            if (totalWindowRequestsCount >= config_1.config.maxWindowRequestCount) {
                const errMessage = `You have exceeded the ${config_1.config.maxWindowRequestCount} requests in ${config_1.config.windowSizeInHours} hours limit!`;
                return http_response_1.http_responder.errorResponse(res, errMessage, http_status_codes_1.default.TOO_MANY_REQUESTS);
            }
            else {
                // * if number of requests made is less than allowed maximum, log new entry
                const lastRequestLog = data[data.length - 1];
                const potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
                    .subtract(config_1.config.windowLogInterval, "hours")
                    .unix();
                // *  if interval has not passed since last request log, increment counter
                if (lastRequestLog.requestTimeStamp >
                    potentialCurrentWindowIntervalStartTimeStamp) {
                    lastRequestLog.requestCount++;
                    data[data.length - 1] = lastRequestLog;
                }
                else {
                    // *  if interval has passed, log new entry for current user and timestamp
                    data.push({
                        requestTimeStamp: currentRequestTime.unix(),
                        requestCount: 1,
                    });
                }
                redis_1.default.set(req.id, JSON.stringify(data));
                next();
            }
        });
    }
    catch (error) {
        return http_response_1.http_responder.errorResponse(res, "server error", http_status_codes_1.default.INTERNAL_SERVER_ERROR);
    }
};
exports.rateLimiter = rateLimiter;
/**
  * authUser
  * @desc A middleware to authenticate users
  * @param {Object} req request any
  * @param {Object} res response object
  * @param {Function} next nextFunction middleware
  * @returns {void|Object} object
  */
const authUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserService_1.default.checkIfUserExist(req.id);
        if (!user) {
            const errMessage = "Invalid token. Please login";
            return http_response_1.http_responder.errorResponse(res, errMessage, http_status_codes_1.default.UNAUTHORIZED);
        }
        req.user = user;
        next();
    }
    catch (err) {
        const errMessage = "Invalid token. Please login";
        return http_response_1.http_responder.errorResponse(res, errMessage, http_status_codes_1.default.UNAUTHORIZED);
    }
});
exports.authUser = authUser;
