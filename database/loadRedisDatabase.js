require("dotenv").config();
const redis = require("redis");
const redisPath = process.env.redisPath;

const redisClient = redis.createClient({
  url: redisPath,
});
redisClient.on("error", (err) => console.log(err));

module.exports.loadRedisDatabase = async () => {
  await redisClient
    .connect()
    .then(() => {
      console.log("> Connected to Redis Database");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.redisClient = redisClient;
