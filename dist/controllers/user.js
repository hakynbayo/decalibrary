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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAuthorBook = exports.addAuthorBook = exports.deleteAuthor = exports.updateAuthor = exports.getAuthor = exports.getAuthors = exports.addAuthor = exports.getReqDetails = void 0;
const user_1 = require("../models/user");
function getReqDetails(req) {
    console.log(req.ip + ":" + req.url);
}
exports.getReqDetails = getReqDetails;
function addAuthor(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = {
            id: 1,
            author: req.body.author,
            dateRegistered: new Date(),
            age: req.body.age,
            address: req.body.address,
            books: []
        };
        let result = yield (0, user_1.createUser)(user);
        let message = "successfully created";
        if (result.error) {
            return res.status(404).render("user", { "output": result, "message": result.error });
        }
        return res.status(200).render("user", { "user": result.result, "message": message });
    });
}
exports.addAuthor = addAuthor;
function getAuthors(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield (0, user_1.getUsers)();
        if (result.error) {
            res.status(404).render("users", { "users": result.result, "message": "No authors found yet" });
            return;
        }
        //console.log(result.result)
        res.status(200).render("users", { "users": result.result, "message": "Successfully fetched" });
        return;
    });
}
exports.getAuthors = getAuthors;
function getAuthor(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield (0, user_1.getUser)(Number(req.params.userid));
        if (result.error) {
            res.status(404).render("users", { "user": result.result, "message": "No authors found yet" });
            return;
        }
        //console.log(result.result)
        res.status(200).render("user", { "user": result.result, "message": "Successfully fetched" });
        return;
    });
}
exports.getAuthor = getAuthor;
function updateAuthor(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = {
            id: req.body.userid,
            author: req.body.author,
            dateRegistered: req.body.dateRegistered,
            age: req.body.age,
            address: req.body.address,
            books: []
        };
        let result = yield (0, user_1.updateUser)(user.id, user);
        let message = "successfully created";
        if (result.error) {
            return res.status(404).render("user", { "output": result.result, "message": result.error });
        }
        return res.status(200).render("user", { "user": result.result, "message": message });
    });
}
exports.updateAuthor = updateAuthor;
function deleteAuthor(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let userid = Number(req.body.userid) || Number(req.params.userid);
        let result = yield (0, user_1.deleteUser)(userid);
        let message = "successfully deleted";
        if (result.error) {
            return res.status(404).render("users", { "output": result.result, "message": result.error });
        }
        return res.status(200).render("users", { "users": result.result, "message": message });
    });
}
exports.deleteAuthor = deleteAuthor;
function addAuthorBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let book = {
            id: req.body.id,
            name: req.body.name,
            isPublished: true,
            datePublished: new Date(),
            serialNumber: req.body.isdn
        };
        let result = yield (0, user_1.addBoookToUser)(req.body.userid, book);
        let message = "successfully uadded book";
        if (result.error) {
            return res.status(404).render("user", { "output": result, "message": result.error });
        }
        console.log(result.result);
        return res.status(200).render("user", { "user": result.result, "message": message });
    });
}
exports.addAuthorBook = addAuthorBook;
function deleteAuthorBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield (0, user_1.deleteUserBook)(Number(req.body.userid), Number(req.body.bookid));
        let message = "successfully deleted";
        if (result.error) {
            return res.status(404).render("user", { "output": result, "message": result.error });
        }
        return res.status(200).render("user", { "user": result.result, "message": message });
    });
}
exports.deleteAuthorBook = deleteAuthorBook;
