let sql = require('../sql/sql');
let moment = require('moment');
let func = require('../sql/func');
let path = require('path');




function formatData(rows) {
	return rows.map(row => {
		let date = moment(row.create_time).format('YYYY-MM-DD');
		return Object.assign({}, row, {
			create_time: date
		});
	});
}


module.exports = {

	// 获取商品列表

	fetchAll(req, res) {
		let param = req.body;
		let page_num = param.page_num;
		let page_size = param.page_size;
		let sql, arr, start;
		start = (page_num - 1) * page_size;
		
		let member_phone = req.body.member_phone;

		if (member_phone) {
			sql = 'select COUNT(*) from members where member_phone=?; select * from members where member_phone =? limit ?, ?';
			arr = [member_phone,member_phone,start, page_size];
		} else {
			sql = 'select COUNT(*) from members;select * from members  limit ?, ?';
			arr = [start, page_size];
		}



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






	// 获取会员详情

	fetchById(req, res) {
		let members_id = req.body.members_id;

		let sql = 'select * from members WHERE members_id = ?';
		let arr = [members_id];

		func.connPool(sql, arr, (err, rows) => {

			rows = formatData(rows);
			res.json({
				code: 200,
				data: rows[0]
			});
		});
	},

	// 添加|更新 会员
	addOne(req, res) {
		let members_id = req.body.members_id;
		console.log(members_id);

		let member_name = req.body.member_name;
		let member_phone = req.body.member_phone;

		let remarks = req.body.remarks;
		let recommendation_code = req.body.recommendation_code;

		let membership_level = req.body.membership_level;
		let member_address1 = req.body.member_address1;
		let member_address2 = req.body.member_address2;
		let member_address3 = req.body.member_address3;
		let sql, arr;

		if (members_id) {
			// 更新

			sql = 'UPDATE members SET member_name=?, member_phone=? ,remarks =? ,recommendation_code =? ,membership_level =? ,member_address1 =?,member_address2=?,member_address3 =?  WHERE members_id=?';


			arr = [member_name, member_phone, remarks, recommendation_code, membership_level, member_address1, member_address2, member_address3, members_id];
		} else {
			// 新增
			sql = 'INSERT INTO members(member_name, member_phone,remarks,recommendation_code,membership_level,member_address1,member_address2,member_address3) VALUES(?,?,?,?,?,?,?,?)';
			arr = [member_name, member_phone, remarks, recommendation_code, membership_level, member_address1, member_address2, member_address3];


		}




		func.connPool(sql, arr, (err, rows) => {
			res.json({
				code: 200,
				msg: '保存成功'
			});

		});


	},


	// 删除会员

	deleteOne(req, res) {

		let members_id = req.body.members_id;
		let sql = 'DELETE  from members WHERE members_id =?';

		let arr = [members_id];

		func.connPool(sql, arr, (err, rows) => {
			res.json({
				code: 200,
				msg: '删除成功'
			});
		});

	},



	// 批量删除
	deleteMulti(req, res) {
		let members_id = req.body.members_id;

		let sql = 'DELETE  from members WHERE members_id in ?';
		let arr = [[members_id]];

		func.connPool(sql, arr, (err, rows) => {
			res.json({
				code: 200,
				msg: '删除成功'
			});
		});



	},



	// 权限变更
	changeRole(req, res) {
		let change_role = req.body.change_role;

		let members_id = req.body.members_id;




		let sql = 'UPDATE members SET membership_level= ? WHERE members_id = ?';

		let arr = [change_role, members_id];

		func.connPool(sql, arr, (err, rows) => {
			res.json({
				code: 200,
				msg: '更新成功'
			});
		});


	},

};
