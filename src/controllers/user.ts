import {Request, Response } from 'express';
import { Book } from '../models/book';

import { addBoookToUser, Author, createUser, deleteUser, deleteUserBook, getUser, getUsers, updateUser } from '../models/user';


export function getReqDetails(req: Request){
  console.log(req.ip+":"+req.url)
}

export async function addAuthor(req: Request, res: Response){
    let user: Author = {
      id: 1,
      author: req.body.author,
      dateRegistered: new Date(),
      age: req.body.age,
      address: req.body.address,
      books: []
    };

    
    let result = await createUser(user)
    let message = "successfully created"
    if(result.error){
      return res.status(404).render("user", {"output": result, "message": result.error})
        
    }
    return res.status(200).render("user", {"user": result.result, "message": message})    
  
  }

  export async function getAuthors(req: Request, res: Response): Promise<void>{
    let result = await getUsers();
    if(result.error){
      res.status(404).render("users", {"users": result.result, "message": "No authors found yet"})
      return
    }
    //console.log(result.result)
    res.status(200).render("users", {"users": result.result, "message": "Successfully fetched"})
    return


  }

  export async function getAuthor(req: Request, res: Response): Promise<void>{
    let result = await getUser(Number(req.params.userid));

    if(result.error){
      res.status(404).render("users", {"user": result.result, "message": "No authors found yet"})
      return;
    }

    //console.log(result.result)
    res.status(200).render("user", {"user": result.result, "message": "Successfully fetched"})
    return;

  }



  export async function updateAuthor(req: Request, res: Response){
    let user: Author = {
      id: req.body.userid,
      author: req.body.author,
      dateRegistered: req.body.dateRegistered,
      age: req.body.age,
      address: req.body.address,
      books: []
    };
  
    
    let result = await updateUser(user.id, user)
    let message = "successfully created"
    if(result.error){
        
      return res.status(404).render("user", {"output": result.result, "message": result.error})
        
    }
  
    return res.status(200).render("user", {"user": result.result, "message": message})    
  
  }

  export async function deleteAuthor(req: Request, res: Response){
    let userid: number = Number(req.body.userid) || Number(req.params.userid)
    let result = await deleteUser(userid)
    let message = "successfully deleted"
    if(result.error){
        
      return res.status(404).render("users", {"output": result.result, "message": result.error})
        
    }
  
    return res.status(200).render("users", {"users": result.result, "message": message});
  
  }
    

  export async function addAuthorBook(req: Request, res: Response){
    let book: Book = {
      id: req.body.id,
      name: req.body.name,
      isPublished: true,
      datePublished: new Date(),
      serialNumber: req.body.isdn
    };
  
    
    let result = await addBoookToUser(req.body.userid, book)
    let message = "successfully uadded book"
    if(result.error){
        
      return res.status(404).render("user", {"output": result, "message": result.error})
        
    }
    console.log(result.result)
  
    return res.status(200).render("user", {"user": result.result, "message": message})    
  
  }


  export async function deleteAuthorBook(req: Request, res: Response){
    
    let result = await deleteUserBook(Number(req.body.userid), Number(req.body.bookid))
    let message = "successfully deleted";
    if(result.error){
        
      return res.status(404).render("user", {"output": result, "message": result.error})
      
    }
    return res.status(200).render("user", {"user": result.result, "message": message})    
  
  }