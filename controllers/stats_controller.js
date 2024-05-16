const db = require('../db')



const getRankingTable = (async (req, res) => {
    try {

        const users = await db.query('SELECT * FROM users')

        let usuarios_stats = []
       
       
        const usersPromises = users.rows.map(async user => {
            const userWins = await db.query('SELECT COUNT(*) FROM game WHERE winner = $1 AND status = $2', [user.id,2])
            const userGames = await db.query('SELECT COUNT(*) FROM game_player WHERE id_player = $1', [user.id]) 

            return {
                ...user,
                wins: parseFloat(userWins.rows[0].count),
                games: parseFloat(userGames.rows[0].count),
                ratio: (parseFloat(userWins.rows[0].count) / parseFloat(userGames.rows[0].count))
            }
        })

        const usuarios = await Promise.all(usersPromises);

        res.json({code :200, data: usuarios, message: 'Información del juego' })
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
  })


module.exports = {
   getRankingTable
}