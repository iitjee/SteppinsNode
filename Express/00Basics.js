sudo npm i -g express-generator
express -h                              //to see available options
express --view=hbs
npm i
npm start                   //see localhost:3000



npm i express nodemon
npm i --save-dev babel-cli babel-preset-env babel-preset-stage-0

//In pkg.json
"scripts": {
    "start": "nodemon ./index.js --exec babel-node -e js"
  }

//Let's create our .babelrc file so we can actually tell what are the configurations for babel
//create .babelrc
{
  "presets": [
    "env",
    "stage-0"
    ]
}


//Create index.js file
import express from 'express'; //don't forget to put quotes around express
const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});



$ npm run start



//create some data in https://mockaroo.com/ and download as json data
//create 'data' folder and put the downloaded data file
import data from './data/data.json';

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
  console.log(data);
});



//as soon as you save, nodemon refreshes and see the data printed on the console (i.e in the terminal)

Note: Why didn't you see your data in the chrome console but rather on the terminal console? Because it's server side 
and not front end code.
