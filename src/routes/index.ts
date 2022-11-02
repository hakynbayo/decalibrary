//var express = require('express');
import {Router, Request, Response } from 'express';

const IndexRouter: Router = Router();

/* GET home page. */

IndexRouter.get('/', function(req: Request, res: Response, next) {

    res.render('index', { title: 'Book Library' });

});

module.exports = IndexRouter;
