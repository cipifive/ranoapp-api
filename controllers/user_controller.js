const db = require('../db')

const getUsers = (async (req, res) => {
  try {
    // Realizar una consulta a la tabla favorites
    const query = await db.query('SELECT * FROM users');
    res.json(query.rows)
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})

const createUser = (async (req, res) => {
  try {
    await db.query('BEGIN')
    const { id,name } = req.body 

    const user = await db.query('SELECT * FROM users WHERE id = $1',[id])

    if(user.rows.length > 0) {
      res.status(500).json({message: "Ya existe un usuario con ese identificador"})
    } else {
      await db.query('INSERT INTO users (id, name) VALUES ($1, $2)',[id,name]);
      await db.query('COMMIT')
      res.json({ message: 'Usuario registrado' });
    }
   
  } catch (err) {
    await db.query('ROLLBACK')
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})

const updateUser = (async (req, res) => {
  try {
    await db.query('BEGIN')
    const { id,name } = req.body 
   
    await db.query('UPDATE users SET name = $1 WHERE id = $2',[name,id]);
    await db.query('COMMIT')
    res.json({ message: 'Usuario actualizado' });
  } catch (err) {
    await db.query('ROLLBACK')
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})



module.exports = {
    getUsers,
    updateUser,
    createUser
}