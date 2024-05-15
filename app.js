// Import the express module
const express= require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
dotenv.config()

const {
  getUsers,
  updateUser,
  createUser
} = require('./controllers/user_controller')

const {
  createGame, getGameById, saveRound, getStartedGames
} = require('./controllers/game_controller')


// Create an instance of the express application
const app=express();


app.use(bodyParser.json());
// Specify a port number for the server
app.use(bodyParser.urlencoded({ extended: true }));

const port=8000;

app.use(cors({ 
  origin: ['http://localhost:5137',process.env.CLIENT_URL, '*'],
  credentials: true // Permite solicitudes con credenciales 
}));


app.get('/get_users', getUsers)
app.post('/create_user', createUser)
app.put('/update_user', updateUser)

app.post('/create_game', createGame)
app.get('/get_game_by_id/:id', getGameById)
app.get('/get_started_games', getStartedGames)
app.post('/save_round', saveRound)


// Start the server and listen to the port
app.listen(port,'0.0.0.0' ,() => {
  console.log(`Server is running on port ${port}`);
});