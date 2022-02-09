const pool = require('../utils/pool')

module.exports = class Secret {
  id;
  title;
  description;
  user_id;
  created_at;
  
  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.description = row.description;
    this.user_id = row.user_id;
    this.created_at = row.created_at;
  }

  static async insert({ title, description, user_id }) {
    const { rows } = await pool.query(
      `
      WITH new_post AS (
        INSERT INTO secrets (title, description, user_id)
      VALUES ($1, $2, $3)
      RETURNING *
      )
      
      SELECT
        new_post.*,
        users.email AS user
      FROM
        new_post
      LEFT JOIN
        users
      ON
        users.id = new_post.user_id
    `,
      [title, description, user_id]
    )
    return new Secret(rows[0])
  }

  static async getAll() {
    const { rows } = await pool.query(`SELECT * FROM secrets`)
        return rows.map((row) => new Secret(row))
      } 
    }
