//var express = require('express');
import {Router, Request, Response, NextFunction } from 'express';
import { addAuthor, addAuthorBook, deleteAuthor, deleteAuthorBook, getAuthor, getAuthors, getReqDetails, updateAuthor } from '../controllers/user';

const UserRouter: Router = Router();

/* GET home page. */

UserRouter.post('/',   function(req: Request, res: Response, next) {

    addAuthor(req, res)
    

 })



//  UserRouter.use('/', function(req: Request, res: Response, next) {

//     ///res.send("you status is oke")
//     getReqDetails(req);
//     next()
    
// });

UserRouter.get('/:userid', function(req: Request, res: Response, next) {

    getAuthor(req, res);

});

//just a middleware 
UserRouter.use("/",function(req: Request, res: Response, next: NextFunction) {
    
    getReqDetails(req)
    next();

})

UserRouter.get('/', function(req: Request, res: Response, next: NextFunction) {

    getAuthors(req, res);
    
    
});



UserRouter.put('/update_user', function(req: Request, res: Response, next) {

    updateAuthor(req, res);

});

UserRouter.delete('/delete_user/:userid', function(req: Request, res: Response, next) {

    deleteAuthor(req, res);

});





UserRouter.post('/update_user', function(req: Request, res: Response, next: NextFunction) {

    updateAuthor(req, res);

});

UserRouter.post('/add_book', function(req: Request, res: Response, next) {

    addAuthorBook(req, res);

});

UserRouter.post('/delete_book', function(req: Request, res: Response, next) {

    deleteAuthorBook(req, res);

});

UserRouter.get('/delete_user/:userid', function(req: Request, res: Response, next) {

    deleteAuthor(req, res);

});


module.exports = UserRouter;
