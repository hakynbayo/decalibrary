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
exports.deleteUserBook = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.createUser = exports.addBoookToUser = void 0;
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils/utils");
const fs_1 = __importDefault(require("fs"));
let dbFile = path_1.default.resolve(__dirname + "/database.json");
const author = {
    id: 0,
    author: "",
    dateRegistered: new Date(),
    age: 0,
    address: "",
    books: []
};
function addBoookToUser(userID, book) {
    return __awaiter(this, void 0, void 0, function* () {
        let outputObject = { result: author, error: null };
        if (!fs_1.default.existsSync(dbFile)) {
            outputObject.error = "Database Not Found";
            return outputObject;
        }
        return (0, utils_1.readFilePromise)(dbFile).then((data) => {
            let dbObj = JSON.parse(data);
            //check if all authors has beeen deleted
            let index = dbObj.findIndex((author) => { return author.id === Number(userID); });
            if (index !== -1) {
                let author = dbObj[index];
                book.id = (author.books.length > 0 ? author.books.length + 1 : 1);
                dbObj[index].books.push(book);
                outputObject.result = dbObj[index];
                console.log(outputObject.result);
                fs_1.default.writeFileSync(dbFile, JSON.stringify(dbObj, null, 2));
                return outputObject;
            }
            console.log(index);
            console.log(userID);
            outputObject.error = "author data not found";
            return outputObject;
            //return {result: user, error: null}
        }).catch((err) => { outputObject.error = err; return outputObject; });
    });
}
exports.addBoookToUser = addBoookToUser;
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        let outputObject = { result: user, error: null };
        if (!fs_1.default.existsSync(dbFile)) {
            user.id = 1;
            fs_1.default.writeFileSync(dbFile, JSON.stringify(([user]), null, 2));
            return outputObject;
        }
        return (0, utils_1.readFilePromise)(dbFile).then((data) => {
            let dbObj = JSON.parse(data);
            //check if all authors has beeen deleted
            if (dbObj.length === 0) {
                user.id = 1;
                fs_1.default.writeFileSync(dbFile, JSON.stringify(([user]), null, 2));
                return outputObject;
            }
            user.id = dbObj[dbObj.length - 1].id + 1;
            dbObj.push(user);
            outputObject.result.id = user.id;
            fs_1.default.writeFileSync(dbFile, JSON.stringify(dbObj, null, 2));
            return outputObject;
            //return {result: user, error: null}
        }).catch((err) => { outputObject.error = err; outputObject.error = err; outputObject.result = user; return outputObject; });
    });
}
exports.createUser = createUser;
function getUsers() {
    let authors = [];
    let outputObject = { result: authors, error: null };
    if (!fs_1.default.existsSync(dbFile)) {
        outputObject.error = "No database available";
        return Promise.resolve(outputObject);
    }
    return (0, utils_1.readFilePromise)(dbFile).then((data) => {
        outputObject.result = JSON.parse(data);
        return outputObject;
    }).catch((err) => { outputObject.error = err; return outputObject; });
}
exports.getUsers = getUsers;
function getUser(id) {
    let author = {
        id: 0,
        author: "",
        dateRegistered: new Date(),
        age: 0,
        address: "",
        books: []
    };
    let outputObject = { result: author, error: null };
    if (!fs_1.default.existsSync(dbFile)) {
        outputObject.error = "No database available";
        return Promise.resolve(outputObject);
    }
    return (0, utils_1.readFilePromise)(dbFile).then((data) => {
        outputObject.result = JSON.parse(data).find((author) => { return author.id === id; });
        return outputObject;
    }).catch((err) => { outputObject.error = err.message; return outputObject; });
}
exports.getUser = getUser;
function updateUser(id, user) {
    return __awaiter(this, void 0, void 0, function* () {
        let outputObject = { result: user, error: null };
        if (!fs_1.default.existsSync(dbFile)) {
            outputObject.error = "No database available";
            return Promise.resolve(outputObject);
        }
        return (0, utils_1.readFilePromise)(dbFile).then((data) => {
            let dbObj = JSON.parse(data);
            let index = dbObj.findIndex((author) => { return author.id == id; });
            if (index !== -1) {
                dbObj[index].author = user.author;
                dbObj[index].address = user.address;
                dbObj[index].age = user.age;
                //console.log(dbObj[index])
                fs_1.default.writeFileSync(dbFile, JSON.stringify(dbObj, null, 2));
                outputObject.result = dbObj[index];
                return outputObject;
            }
            outputObject.error = "Author not found";
            return outputObject;
        }).catch((err) => { outputObject.error = err.message; console.log(err.message); return outputObject; });
    });
}
exports.updateUser = updateUser;
function deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let outputObject = { result: [], error: null };
        if (!fs_1.default.existsSync(dbFile)) {
            outputObject.error = "No database available";
            return Promise.resolve(outputObject);
        }
        return (0, utils_1.readFilePromise)(dbFile).then((data) => {
            let dbObj = JSON.parse(data);
            let index = dbObj.findIndex((author) => { return author.id === id; });
            if (index !== -1) {
                dbObj.splice(index, 1);
                outputObject.result = dbObj;
                fs_1.default.writeFileSync(dbFile, JSON.stringify(dbObj, null, 2));
                return outputObject;
            }
            outputObject.error = "No match found";
            return outputObject;
        }).catch((err) => { outputObject.error = err.message; return outputObject; });
    });
}
exports.deleteUser = deleteUser;
function deleteUserBook(userID, bookID) {
    return __awaiter(this, void 0, void 0, function* () {
        let outputObject = { result: author, error: null };
        if (!fs_1.default.existsSync(dbFile)) {
            outputObject.error = "No database available";
            return Promise.resolve(outputObject);
        }
        return (0, utils_1.readFilePromise)(dbFile).then((data) => {
            let dbObj = JSON.parse(data);
            let index = dbObj.findIndex((author) => { return author.id === userID; });
            if (index !== -1 && dbObj[index].books.length > 0) {
                let bookIndex = dbObj[index].books.findIndex((book) => { return book.id === bookID; });
                dbObj[index].books.splice(bookIndex, 1);
                fs_1.default.writeFileSync(dbFile, JSON.stringify(dbObj, null, 2));
                outputObject.result = dbObj[index];
                return outputObject;
            }
            outputObject.error = "No match found";
            return outputObject;
        }).catch((err) => { outputObject.error = err.message; return outputObject; });
    });
}
exports.deleteUserBook = deleteUserBook;
