import express, { response } from 'express';
import fetch from 'node-fetch';
const app = express();

const PORT = process.env.PORT || 3000;

const products = [{id:'12',name:'book'},{id:'12',name:'book'}];


app.get("/" , (req,res) => {
    res.status(201).json({products})
});

//route
const URL = `https://jsonplaceholder.typicode.com/users`;
app.get('/api/users', async (req, res) => {
    try {
        const response = await fetch(URL);
        const json = await response.json();
        res.json(json);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
        
    }
});
app.get('/api/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    if(isNaN(userId)){
        res.status(400).send({msg:'bad request'})
        return;
    }
    try {
        const response = await fetch(`${URL}/${userId}`);
        const json = await response.json();
        const jsonArray = [json]; //แก้เสร็จละอย่างนาน
        const foundUser = jsonArray.find(user => user.id === userId);
        console.log(foundUser)
         if(!foundUser){
            res.status(404).send({msg:'Not Found'})
            return;
        }
        res.json(json);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }

    
});

app.listen(PORT,()=>{
    console.log(`localhost:${PORT}`);
})