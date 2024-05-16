const db = require('../db')

const createGame = (async (req, res) => {
  try {
    await db.query('BEGIN')
    const { name, players } = req.body
    
    const new_game = await db.query('INSERT INTO game (name) VALUES ($1) RETURNING id', [name])

    const game_id = new_game.rows[0].id

    players.forEach(async player => {
        await db.query('INSERT INTO game_player (id_game,id_player) VALUES ($1,$2)', [game_id,player.id])
        await db.query('COMMIT')
    });

    await db.query('COMMIT')
    res.json({code :200, data: game_id, message: 'Juego creado' });

  } catch (err) {
    await db.query('ROLLBACK')
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})

const calculateRound = (tiradas,numJugadores) => {
    return Math.floor(tiradas / numJugadores) + 1  
}

const getGameById = (async (req, res) => {
    try {
        const id = req.params.id;

        let requested_game = {}

        const game = await db.query('SELECT * FROM game WHERE id = $1 ', [id]); 

        const players_ids = await db.query('SELECT id_player FROM game_player WHERE id_game = $1 ', [id])

        const playersPromises = players_ids.rows.map(async player => {
            const userResult = await db.query('SELECT * FROM users WHERE id = $1 ', [player.id_player]);
            return userResult.rows[0];
        });
    
        const players = await Promise.all(playersPromises);

        const history = await db.query('SELECT * FROM game_round WHERE id_game = $1 ', [id]); 

        requested_game['name'] = game.rows[0].name
        requested_game['players'] = players
        requested_game['round'] = calculateRound(history.rows.length,players.length)
        requested_game['history'] = history.rows.map(h => ({...h,boxes:JSON.parse(h.boxes)}))
    
        res.json({code :200, data: requested_game, message: 'Información del juego' })
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
  })

  const getStartedGames = (async (req, res) => {
    try {
        
        const games = await db.query('SELECT * FROM game WHERE status = 1')
    
        res.json({code :200, data: games.rows, message: 'Información del juego' })
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
  })

  const saveRound = (async (req, res) => {
    try {
      await db.query('BEGIN')
      const { id_game,id_user,id_round,points,boxes } = req.body 

      await db.query('INSERT INTO game_round (id_game,id_user,id_round,points,boxes) VALUES ($1,$2,$3,$4,$5)',[id_game,id_user,id_round,points,boxes])
      await db.query('COMMIT')
        
      res.json({ message: 'Ronda registrada' });
     
    } catch (err) {
      await db.query('ROLLBACK')
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  })

  const endGame = (async (req, res) => {
    try {
      await db.query('BEGIN')
      const { id_game,id_user } = req.body 

      await db.query('UPDATE game SET status = $1, winner = $2 WHERE id = $3',[2,id_user,id_game]);
      await db.query('COMMIT')

      res.json({ message: 'Partida finalizada' });
     
    } catch (err) {
      await db.query('ROLLBACK')
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  })

module.exports = {
   createGame,
   getGameById,
   saveRound,
   getStartedGames,
   endGame
}