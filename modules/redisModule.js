const ioRedis = require('ioredis');
const _ = require('lodash');
const util = require('util');
const moment = require('moment-timezone');

const config = require('../config');

const RedisModule = (function () {
  const redis = new ioRedis(
  {
      port: config.redis.redisPort,
      host: config.redis.redisHost,
      password: config.redis.redisPassword,
      db: 0,
      retryStrategy: function (times) {
          const delay = Math.min(times * 2, 2000);
          console.log(util.format('[Logger]::[Redis]::[Service]::[%s]::[Retried...]',
                                    moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')));
          return delay;
      }
  });
  return {
    getValue: async (key) => await redis.get(key).then(v => JSON.parse(v)).catch(e => e.message),
    setValue: async (key, value) => await redis.set(key, JSON.stringify(value)).catch(e => e.message),
    setFirstAuth: async (key, value) => {
      const auth = {
        auth: true,
        key: value
      }
      return await redis.set(key, JSON.stringify(auth)).then(_ => key).catch(e => e.message);
    },
    setDefaultKey: async function (key) {
      const value = {
        auth: false
      };
      return await redis.set(key, JSON.stringify(value)).then(_ => key);
    },
    getStampPosition: function (key) {
      return go(
        key,
        key => RedisModule.getValue(key),
        result => result.stamp
      );
    },
    setStampPosition: curry(function (key, stamp) {
      return go(
          key,
          key => RedisModule.getValue(key),
          result => {
            result.stamp
            ? result.stamp.push(stamp)
            : (() => {
              result.stamp = [];
              result.stamp.push(stamp);
            })();
            return result;
          },
          obj => RedisModule.setValue(key, obj)
        );
      }
    ),
    stream: redis.scanStream({ count: 10 })
  }
})();

module.exports = RedisModule;
