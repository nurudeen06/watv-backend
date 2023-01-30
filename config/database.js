import knex from 'knex';
const db = knex({
    client: 'mysql',
    connection: {
      host : process.env.DB_HOST || 'localhost',
      port : process.env.DB_PORT || 3306,
      user : process.env.DB_USER || 'your_database_user',
      password : process.env.DB_PASS || '',
      database : process.env.DB_NAME || 'myapp_test'
    }
});
export default db;