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

  static async create({ title, description, user_id }) {
    const { rows } = await pool.query(
      `
      INSERT INTO secrets (title, description, user_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [title, description, user_id]
    )

    return new Secret(rows[0])
  }
  
}