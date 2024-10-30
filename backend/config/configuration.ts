export default () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  environment: process.env.NODE_ENV,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});
