"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//var express = require('express');
const express_1 = require("express");
const IndexRouter = (0, express_1.Router)();
/* GET home page. */
IndexRouter.get('/', function (req, res, next) {
    res.render('index', { title: 'Book Library' });
});
module.exports = IndexRouter;
