/* eslint-disable camelcase */

import async from 'async'
import Common from '../../services/common_function'
import DS from '../../services/date'
import config from '../../config/global.js'
import multiparty from 'multiparty'
import fileExtension from 'file-extension'
import fs from 'fs'
var jwt = require('jsonwebtoken')

var config_mysql = {
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'ironlist',
    database: 'demo_clean_sunday'
  }
}

var knex = require('knex')(config_mysql) // added same thing in verifyuser.js

var usercontroller = {

  login: function (req, res) {
    async.waterfall([
      function (nextCall) { // check required parameters
        req.checkBody('email', 'Email is required').notEmpty() // Name is required
        req.checkBody('password', 'Password is required').notEmpty() // password is required

        if (req.body.email !== '') {
          req.checkBody('email', 'Email is not a valid').isEmail()
        }

        var error = req.validationErrors()
        if (error && error.length) {
          return nextCall({ message: error })
        }
        nextCall(null, req.body)
      },
      function (body, nextCall) {
        var search_obj = {}
        search_obj.email = body.email
        search_obj.password = body.password

        knex.select('id', 'email', 'name', 'user_type').from('user').where(search_obj).then(function (user) {
          if (Common.check_obj_empty(user)) {
            // return res.status(202).json({ success: '0', message: 'Invalid Email or Password.', data: {} });
            return nextCall({ message: 'Invalid Email or Password.' })
          }

          if (user.length > 0) {
            if (user[0].status === '0') {
              return nextCall({ status: 200, message: 'Your Account has been disabled' })
            } else {
              nextCall(null, user[0])
            }
          } else {
            return nextCall({ status: 200, message: "This email and password doesn't match." })
          }
        }).catch(function (err) {
          return res.status(202).json({ success: '0', message: err, data: {} })
        })
      },
      function (user, nextCall) {
        var jwtData = {
          id: user.id,
          email: user.email,
          name: user.name,
          timestamp: DS.now()
        }

        // create a token
        const access_token = jwt.sign(jwtData, config.secret, {
          expiresIn: 60 * 60 * 24 // expires in 24 hours
        })

        var update_record_only = { token: access_token }

        knex('user').where('id', user.id).update(update_record_only).then(function () {
          var data = {
            id: user.id,
            name: user.name,
            email: user.email,
            access_token: access_token,
            user_type: user.user_type
          }

          nextCall(null, data)
        }).catch(function () {
          return res.status(202).json({ success: '0', message: 'Something Went Wrong', data: {} })
        })
      },
      function (body, nextCall) {
        nextCall(null, {
          status: 1,
          message: 'Login successfully',
          data: body
        })
      }
    ], function (err, response) {
      if (err) {
        return res.status(202).json({ success: '0', message: err, data: {} })
      }
      return res.status(200).json(response)
    })
  },

  add_user_record: async function (req, res) {
    async.waterfall(
      [
        function (nextCall) {
          var form = new multiparty.Form()
          form.parse(req, function (_err, fields, files) {
            fields = fields || []
            for (var key in fields) {
              if (fields[key].length === 1) {
                fields[key] = fields[key][0]
              }
            }
            req.body = fields
            req.files = files
            nextCall(null, req.body, req.files)
          })
        },
        function (body, allfiles, nextCall) {
          // target_single_file_upload
          var upload_sigle_file = {}

          if (!Common.check_obj_empty(allfiles.single_file)) {
            var file_upload_obj = allfiles.single_file[0]

            var original_file_namee = file_upload_obj.originalFilename

            var get_ext_name = fileExtension(original_file_namee)

            var download_file_namee = new Date().getTime() + '_' + Common.randomAsciiString(25) + '.' + get_ext_name

            var temp_path = file_upload_obj.path

            var physical_path = './public/uploads/' + download_file_namee

            fs.readFile(temp_path, function (_err, data1) {
              fs.writeFile(physical_path, data1, function (error) {
                if (error) {
                  return nextCall(error)
                } else {
                  upload_sigle_file.single_file = download_file_namee
                  nextCall(null, body, upload_sigle_file)
                }
              })
            })
            
          } else {
            upload_sigle_file.single_file = ''
            nextCall(null, body, upload_sigle_file)
          }
        },
        function (body, upload_sigle_file, nextCall) {
          var insert_obj = {}
          insert_obj.name = body.name
          insert_obj.email = body.email
          insert_obj.address = body.address
          insert_obj.companystatus = body.companystatus

          insert_obj.companylocation = body.companylocation
          insert_obj.companywarehouse = body.companywarehouse
          insert_obj.uuid_company = body.uuid_company

          insert_obj.single_file = upload_sigle_file.single_file

          knex('company').insert(insert_obj).then(function (_record) {
          }).catch(function (err) {
            return res.status(202).json({ success: '0', message: err, data: {} })
          })

          nextCall(null, {
            status: 1,
            message: 'User added successfully.',
            data: {}
          })
        }
      ],
      function (err, response) {
        if (err) {
          return res.status(202).json({ success: '0', message: err, data: {} })
        }
        return res.status(200).json(response)
      })
  },

  all_list_company_record: function (req, res) {
    async.waterfall(
      [
        function (nextCall) {
          var numPerPage = parseInt(req.body.perPage, 10) || 1

          var page = parseInt(req.body.page, 10) || 0
          // var numPages;
          var skip = page * numPerPage

          //var query = knex.select().from('user')
          const query = knex.select().from('company')

          //var query2 = knex.select().from('user')

          var query2 = knex.select().from('company')


          nextCall(null, query, query2, numPerPage, skip)
        },

        function (query, query2, numPerPage, skip, nextCall) {
          query2.count('id as CNT')

          query2.then(function (total_count) {
            nextCall(null, query, numPerPage, skip, total_count[0].CNT)
          })
        },
        function (query, numPerPage, skip, total_count, nextCall) {

          query.orderBy('id', 'desc').limit(numPerPage).offset(skip)

          var numRows = total_count
          var numPages = Math.ceil(numRows / numPerPage)

          query.then(function (custom_record) {
            var responsePayload = {
              result: custom_record
            }
            responsePayload.total_record = numRows
            responsePayload.total_pages = numPages
            nextCall(null, {
              status: 1,
              message: 'User listing',
              data: responsePayload
            })
          }).catch(function (err) {
            return res.status(202).json({ success: '0', message: err, data: {} })
          })
        }
      ],
      function (err, response) {
        if (err) {
          return res.status(202).json({ success: '0', message: err, data: {} });
        }
        return res.status(200).json(response);
      });
  },

  update_company_status: function (req, res, next) {
    var update_record_only = {};
    var idd = req.body.row_ids;
    var companystatus = req.body.status;
    if (companystatus) {
      update_record_only.companystatus = 'active';
    }
    else{
      update_record_only.companystatus = 'inactive';
    }
    knex('company').where('id', idd).update(update_record_only).then(function (record) {
      return res.status(200).json({ status: 1, message: 'Update Record Successfully'});
    }).catch(function (err) {
      return res.status(202).json({ success: '0', message: 'Something Went Wrong' });
    });
  },

  deactiveCompanyByIds: function (req, res) {
    var update_record_only = {};
    var idd = req.body.row_ids;
    
    update_record_only.companystatus = 'inactive';

    knex('company').whereIn('id', idd).update(update_record_only).then(function (record) {
      return res.status(200).json({ status: 1, message: 'Update Record Successfully'});
    }).catch(function (err) {
      console.log("err",err)
      return res.status(202).json({ success: '0', message: 'Something Went Wrong' });
    });
  },

}

module.exports = usercontroller
