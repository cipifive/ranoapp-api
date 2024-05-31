const db = require('../db')



const getRankingTable = (async (req, res) => {
  try {
    const users = await db.query('SELECT * FROM users')
    const usersPromises = users.rows.map(async user => {
      const userWins = await db.query('SELECT COUNT(*) FROM game WHERE winner = $1 AND status = $2', [user.id,2])
      const userGames = await db.query('SELECT COUNT(*) FROM game_player WHERE id_player = $1', [user.id])
      return {
        ...user,
        wins: parseFloat(userWins.rows[0].count),
        games: parseFloat(userGames.rows[0].count),
        ratio: isNaN((parseFloat(userWins.rows[0].count) / parseFloat(userGames.rows[0].count)) * 100)  ? 0 : (parseFloat(userWins.rows[0].count) / parseFloat(userGames.rows[0].count)) * 100 
      }
    })
    const usuarios = await Promise.all(usersPromises);
    res.json({code :200, data: usuarios, message: 'Información del juego' })
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})

const getStatsByUser = (async (req, res) => {
  try {
    const id = req.params.id;

    const userWins = await db.query('SELECT COUNT(*) FROM game WHERE winner = $1', [id])
    const userGames = await db.query('SELECT COUNT(*) FROM game_player WHERE id_player = $1',[id])
    const userTotalPoints = await db.query('SELECT SUM(points) as total_points FROM game_round WHERE id_user = $1',[id])
    const userBoxes = await db.query('SELECT boxes FROM game_round WHERE id_user = $1',[id])

    const boxesArray = userBoxes.rows.map(row => JSON.parse(row.boxes))
    const allBoxes = [].concat(...boxesArray);
    const totalCount = allBoxes.length;

    const countInCategory = (boxes, category) => boxes.filter(box => category.includes(box)).length;

    const hole_count_1 = countInCategory(allBoxes, [1]);
    const hole_count_2 = countInCategory(allBoxes, [2]);
    const hole_count_3 = countInCategory(allBoxes, [3]);
    const hole_count_4 = countInCategory(allBoxes, [4]);
    const hole_count_6 = countInCategory(allBoxes, [6]);
    const frog_count = countInCategory(allBoxes, [5]);
    const bridge_count_7 = countInCategory(allBoxes, [7]);
    const bridge_count_9 = countInCategory(allBoxes, [9]);
    const mill_count = countInCategory(allBoxes, [8]);
    const out_count = countInCategory(allBoxes, [10]);

    // Calcular los porcentajes
    const hole_percent_1 = (hole_count_1 / totalCount) * 100;
    const hole_percent_2 = (hole_count_2  / totalCount) * 100;
    const hole_percent_3 = (hole_count_3 / totalCount) * 100;
    const hole_percent_4 = (hole_count_4 / totalCount) * 100;
    const hole_percent_6 = (hole_count_6 / totalCount) * 100;
    const frog_percent = (frog_count / totalCount) * 100;
    const bridge_percent_7 = (bridge_count_7 / totalCount) * 100;
    const bridge_percent_9 = (bridge_count_9 / totalCount) * 100;
    const mill_percent = (mill_count / totalCount) * 100;
    const out_percent = (out_count / totalCount) * 100;

    

    let response = {
        wins: parseFloat(userWins.rows[0].count),
        games: parseFloat(userGames.rows[0].count),
        points: isNaN(parseInt(userTotalPoints.rows[0].total_points)) ? 0 : parseInt(userTotalPoints.rows[0].total_points) ,
        shots: totalCount,
        hole_1: {
          count: hole_count_1,
          percent: isNaN(hole_percent_1.toFixed(2)) ? 0 : hole_percent_1.toFixed(2)
        },
        hole_2: {
          count: hole_count_2,
          percent: isNaN(hole_percent_2.toFixed(2)) ? 0 : hole_percent_2.toFixed(2)
        },
        hole_3: {
          count: hole_count_3,
          percent: isNaN(hole_percent_3.toFixed(2)) ? 0 : hole_percent_3.toFixed(2)
        },
        hole_4: {
          count: hole_count_4,
          percent: isNaN(hole_percent_4.toFixed(2)) ? 0 : hole_percent_4.toFixed(2)
        },
        hole_6: {
          count: hole_count_6,
          percent: isNaN(hole_percent_6.toFixed(2)) ? 0 : hole_percent_6.toFixed(2)
        },
        frog: {
          count: frog_count,
          percent: isNaN(frog_percent.toFixed(2)) ? 0 : frog_percent.toFixed(2)
        },
        bridge_7: {
          count: bridge_count_7,
          percent: isNaN(bridge_percent_7.toFixed(2)) ? 0 : bridge_percent_7.toFixed(2)
        },
        bridge_9: {
          count: bridge_count_9,
          percent: isNaN(bridge_percent_9.toFixed(2)) ? 0 : bridge_percent_9.toFixed(2)
        },
        mill: {
          count: mill_count,
          percent: isNaN(mill_percent.toFixed(2)) ? 0 : mill_percent.toFixed(2)
        },
        out: {
          count: out_count,
          percent: isNaN(out_percent.toFixed(2)) ? 0 : out_percent.toFixed(2)
        },
    }
    
    res.json({code :200, data: response, message: 'Información del juego' })
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})


module.exports = {
   getRankingTable,
   getStatsByUser
}