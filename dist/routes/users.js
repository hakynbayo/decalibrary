"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//var express = require('express');
const express_1 = require("express");
const user_1 = require("../controllers/user");
const UserRouter = (0, express_1.Router)();
/* GET home page. */
UserRouter.post('/', function (req, res, next) {
    (0, user_1.addAuthor)(req, res);
});
//  UserRouter.use('/', function(req: Request, res: Response, next) {
//     ///res.send("you status is oke")
//     getReqDetails(req);
//     next()
// });
UserRouter.get('/:userid', function (req, res, next) {
    (0, user_1.getAuthor)(req, res);
});
//just a middleware 
UserRouter.use("/", function (req, res, next) {
    (0, user_1.getReqDetails)(req);
    next();
});
UserRouter.get('/', function (req, res, next) {
    (0, user_1.getAuthors)(req, res);
});
UserRouter.put('/update_user', function (req, res, next) {
    (0, user_1.updateAuthor)(req, res);
});
UserRouter.delete('/delete_user/:userid', function (req, res, next) {
    (0, user_1.deleteAuthor)(req, res);
});
UserRouter.post('/update_user', function (req, res, next) {
    (0, user_1.updateAuthor)(req, res);
});
UserRouter.post('/add_book', function (req, res, next) {
    (0, user_1.addAuthorBook)(req, res);
});
UserRouter.post('/delete_book', function (req, res, next) {
    (0, user_1.deleteAuthorBook)(req, res);
});
UserRouter.get('/delete_user/:userid', function (req, res, next) {
    (0, user_1.deleteAuthor)(req, res);
});
module.exports = UserRouter;
