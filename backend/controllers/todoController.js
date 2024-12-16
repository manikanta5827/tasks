import { pool } from "../config/db.js";


const getTodos = async (req, res) => {
  const user_id = req.user_id;
  try {
    const todos = await pool.query(
      `SELECT 
         id, 
         title, 
         start_time AT TIME ZONE 'UTC' AS start_time,
         end_time AT TIME ZONE 'UTC' AS end_time,
         CASE 
            WHEN end_time IS NOT NULL THEN end_time - start_time
            ELSE NULL
         END AS total_time,
         priority, 
         status 
         
       FROM todos 
       WHERE user_id = $1`,
      [user_id]
    );
    let data = todos.rows;

    data.map((todo) => {
      todo.total_time = todo.total_time.hours || 0 + todo.total_time.days * 24 || 0;
      if (todo.total_time < 0) {
        todo.total_time = 0;
      }
    })
    // console.log('Data : ',data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTodo = async (req, res) => {
  try {
    const { title, start_time, end_time, priority, status } = req.body;
    const user_id = req.user_id;

    const query = `
      INSERT INTO todos (user_id, title, start_time, end_time, priority, status)
      VALUES ($1, $2, $3::timestamp AT TIME ZONE 'UTC', $4::timestamp AT TIME ZONE 'UTC', $5, $6)
      RETURNING *;
    `;
    const values = [user_id, title, start_time, end_time, priority, status];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { todoid } = req.params;
    const { title, start_time, end_time, priority, status } = req.body;
    const user_id = req.user_id;

    const query = `
      UPDATE todos 
      SET title = $1, 
          start_time = $2::timestamp AT TIME ZONE 'UTC', 
          end_time = $3::timestamp AT TIME ZONE 'UTC', 
          priority = $4, 
          status = $5 
      WHERE id = $6 AND user_id = $7
      RETURNING *;
    `;
    const values = [title, start_time, end_time, priority, status, todoid, user_id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTodo = async (req, res) => {
  const { todoid } = req.params;
  const user_id = req.user_id;
  try {
    if (!todoid) {
      return res.status(400).json({ message: 'Missing todo ID' });
    }
    const query = `DELETE FROM todos WHERE id = $1 AND user_id = $2`;
    const values = [todoid, user_id];
    await pool.query(query, values);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getTodos, createTodo, updateTodo, deleteTodo };
