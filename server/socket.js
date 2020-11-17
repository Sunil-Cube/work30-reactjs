import async from 'async'

var io = {};

var config_mysql = {
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'ironlist',
    database: 'demo_clean_sunday'
  }
}

var knex = require('knex')(config_mysql)
module.exports = (server) => {
  io = require('socket.io')(server);

  io.on('connection', async function (socket) {
    console.log(socket + ' .............a user connected');
    setInterval(() => {
      function all_list_company_count() {
        async.waterfall(
          [
            function (nextCall) {
              const query = knex.select().from('company')
              query.count('id as CNT')
              query.then(function (total_count) {
                nextCall(null, total_count[0].CNT)
              })
            }
          ],
          function (err, response) {
            socket.emit('totalcount', response);
            if (err) {
              return "Something Went Wrong";
            }
            return response;
          });
      }
      all_list_company_count()
    }, 1000);
  });
}