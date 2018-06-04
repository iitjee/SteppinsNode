import express from 'express';
import data from './data/data.json';

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
  console.log(data);
});


app.get('/', (req, res) => {
	res.send(`a get request with / route on port ${PORT}`)
});

app.post('/newItem', (req, res) => {
	res.send(`a get request with /newItem route on port ${PORT}`)
});

app.put('/item', (req, res) => {
	res.send(`a put request with /item route on prot ${PORT}`);
});

app.delete('/item', (req, res) => {
	res.send(`a delete request with /item route on prot ${PORT}`);
});



//Open Postman and perform all the four requests to localhost:3000/item and localhost:3000/newItem
