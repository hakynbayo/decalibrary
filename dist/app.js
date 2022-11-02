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
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const express = require('express');
const IndexRouter = require('./routes/index');
const UserRouter = require('./routes/users');
const app = express();
// view engine setup
app.set('views', path.join(__dirname, '../src/views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', IndexRouter);
app.use('/users', UserRouter);
// app.disable("x-powered-by");
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const users = [];
app.get("/users", (req, res) => {
    res.json(users);
});
// const user:any[] = []
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
        // console.log(salt)
        console.log(hashedPassword);
        const user = { name: req.body.name, password: hashedPassword };
        users.push(user);
        res.status(201).send;
    }
    catch (error) {
        res.status(500).send;
    }
}));
app.post("/users/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = users.find(user => user.name === req.body.name);
    if (user === null) {
        return res.status(400).send('Cannot find user');
    }
    try {
        if (yield bcrypt_1.default.compare(req.body.password, user.password)) {
            res.send('Success');
        }
        else {
            res.send('Not Allowed');
        }
    }
    catch (error) {
        res.status(500).send;
    }
}));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
app.listen(3000, () => {
    console.log("listening");
});
module.exports = app;
