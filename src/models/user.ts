
import { Book } from "./book"
import path from 'path';
import { readFilePromise } from '../utils/utils';
import fs from 'fs';



let dbFile = path.resolve(__dirname+"/database.json");

export interface Author{
    id: number,
    author: string,
    dateRegistered: Date,
    age: number,
    address: string,
    books: Book[]
  }

interface OutputObject<T, U>{
    result: T,
    error: U
}

const author: Author = {
    id: 0,
    author: "",
    dateRegistered: new Date(),
    age: 0,
    address: "",
    books: []
}

export async function addBoookToUser(userID: number, book: Book): Promise<OutputObject<Author, unknown>>{
    let outputObject: OutputObject<Author, unknown> = { result: author, error: null };
    
    if(!fs.existsSync(dbFile)){
        outputObject.error = "Database Not Found";
        return outputObject
    }

    return readFilePromise(dbFile).then((data: string) => {
        let dbObj: Author[] = JSON.parse(data);
        //check if all authors has beeen deleted
        let index = dbObj.findIndex((author) => { return author.id === Number(userID)});
        if(index !== -1){
            let author = dbObj[index];
            book.id = (author.books.length > 0 ? author.books.length + 1 : 1)
            dbObj[index].books.push(book);
            outputObject.result = dbObj[index];
            console.log(outputObject.result)
        
            fs.writeFileSync(dbFile, JSON.stringify(dbObj, null, 2) )
            return outputObject    
        }
        console.log(index);
        console.log(userID)
        outputObject.error = "author data not found";
        return outputObject;
        //return {result: user, error: null}
        
    }).catch((err) => {outputObject.error = err; return outputObject})

}



export async function createUser(user:Author): Promise<OutputObject<Author, unknown>>{
    let outputObject: OutputObject<Author, unknown> = { result: user, error: null };
    
    if(!fs.existsSync(dbFile)){
        user.id = 1;
        fs.writeFileSync(dbFile, JSON.stringify(([user]), null, 2))
        return outputObject
    }

    return readFilePromise(dbFile).then((data: string) => {
        let dbObj: Author[] = JSON.parse(data);
        //check if all authors has beeen deleted
        if(dbObj.length === 0){
            
            user.id = 1;
            fs.writeFileSync(dbFile, JSON.stringify(([user]), null, 2))
            return outputObject;
        
        }
        
        user.id = dbObj[dbObj.length - 1].id + 1;
        dbObj.push(user);
        outputObject.result.id = user.id;
        fs.writeFileSync(dbFile, JSON.stringify(dbObj, null, 2) )
        return outputObject;
        //return {result: user, error: null}
        
    }).catch((err) => {outputObject.error = err; outputObject.error = err; outputObject.result = user; return outputObject})

}


export function getUsers(): Promise<OutputObject<Author[], unknown>>{
    let authors: Author[] = []
    let outputObject: OutputObject<Author[], unknown> = { result: authors, error: null };
    
    if(!fs.existsSync(dbFile)){
        outputObject.error = "No database available";
        return Promise.resolve(outputObject);
    }

    return readFilePromise(dbFile).then((data) => {
        
        outputObject.result = JSON.parse(data);
        return outputObject;
    }).catch((err) => { outputObject.error = err; return outputObject;  } )
}


export function getUser(id: number): Promise<OutputObject<Author, unknown>>{
    let author: Author = {
        id: 0,
        author: "",
        dateRegistered: new Date(),
        age: 0,
        address: "",
        books: []
    }
    
    let outputObject: OutputObject<Author, unknown> = { result: author, error: null };
    
    if(!fs.existsSync(dbFile)){
        outputObject.error = "No database available";
        return Promise.resolve(outputObject);
    }

    return readFilePromise(dbFile).then((data) => {
        
        outputObject.result = JSON.parse(data).find((author: Author) => { return author.id === id });
        
        return outputObject;
    }).catch((err) => { outputObject.error = err.message; return outputObject;  } )
}


export async function updateUser<T>(id: number, user: Author): Promise<OutputObject<Author, unknown>>{
    

    let outputObject: OutputObject<Author, unknown> = { result: user, error: null };
    
    if(!fs.existsSync(dbFile)){
        outputObject.error = "No database available";
        return Promise.resolve(outputObject);
    }

    return readFilePromise(dbFile).then((data) => {
        
        let dbObj: Author[] = JSON.parse(data);
        let index = dbObj.findIndex((author: Author) => { return author.id == id });
        if(index !== -1){

            dbObj[index].author = user.author;
            dbObj[index].address = user.address;
            dbObj[index].age = user.age;
            //console.log(dbObj[index])
            fs.writeFileSync(dbFile, JSON.stringify(dbObj, null, 2))
            outputObject.result = dbObj[index];
            return outputObject;
        }
        outputObject.error = "Author not found";
        return outputObject
    }).catch((err) => { outputObject.error = err.message; console.log(err.message); return outputObject;  } )
}


export async function deleteUser<T>(id: number): Promise<OutputObject<Author[], unknown>>{
    

    let outputObject: OutputObject<Author[], unknown> = { result: [], error: null };
    
    if(!fs.existsSync(dbFile)){
        outputObject.error = "No database available";
        return Promise.resolve(outputObject);
    }

    return readFilePromise(dbFile).then((data) => {
        
        let dbObj: Author[] = JSON.parse(data);
        let index = dbObj.findIndex((author: Author) => { return author.id === id });
        
        if(index !== -1){
            dbObj.splice(index, 1);
            outputObject.result = dbObj;

            fs.writeFileSync(dbFile, JSON.stringify(dbObj, null, 2))
            return outputObject;
        }
        outputObject.error = "No match found";
        return outputObject;
    }).catch((err) => { outputObject.error = err.message; return outputObject;  } )
}


export async function deleteUserBook(userID: number, bookID: number): Promise<OutputObject<Author, unknown>>{
    

    let outputObject: OutputObject<Author, unknown> = { result: author, error: null };
    
    if(!fs.existsSync(dbFile)){
        outputObject.error = "No database available";
        return Promise.resolve(outputObject);
    }

    return readFilePromise(dbFile).then((data) => {
        
        let dbObj: Author[] = JSON.parse(data);
        let index = dbObj.findIndex((author: Author) => { return author.id === userID });
        
        if(index !== -1 && dbObj[index].books.length > 0){
            let bookIndex: number = dbObj[index].books.findIndex((book: Book) => { return book.id === bookID})
            dbObj[index].books.splice(bookIndex, 1);
            fs.writeFileSync(dbFile, JSON.stringify(dbObj, null, 2))
            outputObject.result = dbObj[index];
            return outputObject;
        }
        outputObject.error = "No match found";
        return outputObject;
    }).catch((err) => { outputObject.error = err.message; return outputObject;  } )
}

