let sql = require('../sql/sql');
let moment = require('moment');
let bcrypt = require('bcryptjs');
let func = require('../sql/func');
let mysql = require('mysql');



function formatData(rows) {
	return rows.map(row => {
		let date = moment(row.create_time).format('YYYY-MM-DD');
		let obj = {};

		switch (row.role) {
			case 1:
				obj.role = '普通用户';
				break;
			case 10:
				obj.role = '管理员';
				break;
			case 100:
				obj.role = '超级管理员';
		}

		delete row.password;

		return Object.assign({}, row, {
			create_time: date
		}, obj);
	});
}


module.exports = {

	fetchAll(req, res) {
		let param = req.body;
		let page_num = param.page_num;
		let page_size = param.page_size;
		let sql, arr, start;
		start = (page_num - 1) * page_size;

		sql = 'select COUNT(*) from user;select * from user  limit ?, ?';
		arr = [start, page_size];

		func.connPool(sql, arr, (err, results) => {
			let count = results[0][0]['COUNT(*)'];
			let rows = results[1];
			rows = formatData(rows);
			res.json({
				code: 200,
				data: {
					content: rows,
					total: count
				}
			});

		});





	},

	// 添加用户
	addOne(req, res) {
		let name = req.body.name;
		let pass = req.body.pass;
		let role = req.body.role;



		let sql = 'INSERT INTO user(user_name, password,role) VALUES(?,?,?)';
		let arr = [name, pass, role];



		func.connPool(sql, arr, (err, rows) => {
			res.json({
				code: 200,
				msg: '添加成功'
			});

		});




	},



	// 删除用户

	deleteOne(req, res) {

		let id = req.body.id;

		var sql = 'DELETE  from user WHERE id =? ';

		let arr = [id];

		func.connPool(sql, arr, (err, rows) => {
			res.json({
				code: 200,
				msg: '删除成功'
			});
		});

	},





	// 批量删除

	deleteMulti(req, res) {
		let id = req.body.id;

		let sql = 'DELETE  from user WHERE id in ?';
		let arr = [[id]];

		func.connPool(sql, arr, (err, rows) => {
			res.json({
				code: 200,
				msg: '删除成功'
			});
		});



	},










	// 登录
	login(req, res) {


		let user_name = req.body.user_name;
		let password = req.body.password;

		console.log("user_name", user_name)

		let sql = 'select * from user WHERE user_name = ? ';

		let arr = [user_name];

		func.connPool(sql, arr, (err, rows) => {
			if (!rows.length) {

				res.json({
					code: 403,
					msg: '用户名不存在'
				});
				return;
			}


			let pass = rows[0].password;
			if (password != pass) {
				res.json({
					code: 403,
					msg: '密码错误'
				});
				return;
			}

			let user = {
				user_id: rows[0].id,
				user_name: rows[0].user_name,
				role: rows[0].role,
			};

			req.session.login = user;
			

			res.json({
				code: 200,
				msg: '登录成功',
				data: user
			});


		});







	},


	// 自动登录
	autoLogin(req, res) {
		let user = req.session.login;
		if (user) {
			res.json({
				code: 200,
				data: user
			});

		} else {
			res.json({
				code: 400,
				data: 'auto login failure'
			});
		}
	},

	// 注销
	logout(req, res) {
		req.session.login = null;

		res.json({
			code: 200,
			msg: '注销成功'
		});
	},

	// 权限控制
	controlVisit(req, res, next) {
		if (req.session.login.role && req.session.login.role < 10) {
			res.json({
				code: 400,
				msg: '权限不够'
			});
			return;
		}

		next();
	},

	// 权限变更
	changeRole(req, res) {
		let role = req.session.login.role;
		let change_role = req.body.change_role;

		if (role !== 100 && change_role === 100) {
			res.json({
				code: 400,
				msg: '权限不够'
			});
			return;
		}

		let user_id = req.body.id;

		let sql = 'UPDATE user SET role= ? WHERE id =?';
		let arr = [change_role, user_id];

		func.connPool(sql, arr, (err, rows) => {
			if (rows.affectedRows) {
				res.json({
					code: 200,
					msg: '更新成功'
				});
			}
		});


	},











};
