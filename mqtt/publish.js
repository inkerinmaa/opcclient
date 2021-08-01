const amqp = require('amqplib')
const config = require('../models/db.config').dbConfig
const serverIP = config.host

function publish(dataToMqtt) {
  amqp.connect('amqp://' + serverIP).then(function(conn) {
  return conn.createChannel().then(function(ch) {
    const q = 'hello'

    let ok = ch.assertQueue(q, {durable: false})

    return ok.then(function(_qok) {
      // NB: `sentToQueue` and `publish` both return a boolean
      // indicating whether it's OK to send again straight away, or
      // (when `false`) that you should wait for the event `'drain'`
      // to fire before writing again. We're just doing the one write,
      // so we'll ignore it.
      ch.sendToQueue(q, Buffer.from(dataToMqtt))
      console.log(" [x] Sent '%s'", dataToMqtt)
      return ch.close()
    });
  }).finally(function() { conn.close() })
}).catch(console.warn)
}

module.exports = publish