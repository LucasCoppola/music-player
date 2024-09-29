export default () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  environment: process.env.NODE_ENV,
  database: {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});
