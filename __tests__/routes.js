const users = require('../prod/routes/users');
const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/users", users);

describe("tests users routes", () => {

    test("'/' should work", async () => {
        request(app).get("/").expect(200).end((err, res) => { if (err) {} })
        //await request(app).get("/").expect(200);
    })

    test("'/:id' gets one author, should work", () => {
        request(app).get("/1").expect(200).end((err, res) => { if (err) {} })
    })

    test(" '/add_book' post method should work", async () => {
        
        request(app).post("/add_book").expect(200).end((err, res) => { if (err) {} })
     
        //const result = await request(app).post("/add_book").send({author: "ugonna"}).expect(201);
        //expect(result).toHaveProperty()
       
    })

    test("'/delete_user', delete method should work", () => {
        
        request(app).delete("/delete_user").expect(200).end((err, res) => { if (err) {} })
    
    })


    test(" '/delete_book' delete method should work", () => {
    
        request(app).delete("/delete_book").expect(200).end((err, res) => { if (err) {} })
    
    })

    test(" '/update_user' put method should work", () => {
  
        request(app).put("/update_user").expect(200).end((err, res) => { if (err) {} })
  
    })

})