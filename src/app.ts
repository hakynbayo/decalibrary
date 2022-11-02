import { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import bcrypt from "bcrypt";

const createError  = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path')
const express = require('express')


const IndexRouter = require('./routes/index')
const UserRouter = require('./routes/users')
const app: Express = express();


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

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const users:any[] = []
app.get("/users",(req,res,)=>{
  res.json(users)
})

// const user:any[] = []
app.post("/users",async (req,res,)=>{
  try {
   const hashedPassword= await bcrypt.hash(req.body.password, 10)
    // console.log(salt)
    console.log(hashedPassword)
   const user:any = {name:req.body.name, password:hashedPassword}
   users.push(user)
   res.status(201).send
 
  } catch (error) {
    res.status(500).send

  }
})

app.post("/users/login",async (req,res,)=>{
  const user:any = users.find(user=> user.name === req.body.name)
  if (user===null){
    return res.status(400).send('Cannot find user')
  }
  try {
    if(await bcrypt.compare(req.body.password,user.password)){
      res.send('Success')
    }else{
      res.send('Not Allowed')
    }
  } catch (error) {
    res.status(500).send
  }
});


// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => {
  console.log("listening")
})

module.exports = app;
