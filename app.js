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
  createGame, getGameById, getPlayerRound, saveRound, updateRound, getStartedGames, endGame
} = require('./controllers/game_controller')

const {
  getRankingTable, getStatsByUser
} = require('./controllers/stats_controller')


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
app.post('/get_player_round', getPlayerRound)
app.get('/get_started_games', getStartedGames)
app.post('/save_round', saveRound)
app.put('/update_round', updateRound)
app.put('/end_game', endGame)

app.get('/get_ranking', getRankingTable)
app.get('/get_stats_by_user_id/:id', getStatsByUser)


// Start the server and listen to the port
app.listen(port,'0.0.0.0' ,() => {
  console.log(`Server is running on port ${port}`);
});