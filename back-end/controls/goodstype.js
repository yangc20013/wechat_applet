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

		let goods_typename = req.body.goods_typename;
		if (goods_typename) {

			sql = 'select COUNT(*) from goodstype where goods_typename =?;select * from goodstype where goods_typename =? limit ?, ?';
			arr = [goods_typename,goods_typename,start, page_size];

		} else {

			sql = 'select COUNT(*) from goodstype;select * from goodstype  limit ?, ?';
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






	// 获取详情

	fetchById(req, res) {
		let goods_type = req.body.goods_type;

		let sql = 'select * from goodstype WHERE goods_type = ?';
		let arr = [goods_type];


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
		let goods_type = req.body.goods_type;
	
		let goods_typename = req.body.goods_typename;
		let remarks = req.body.remarks;

		let sql, arr;




		if (goods_type) {
			// 更新
			sql = 'UPDATE goodstype SET goods_typename=?, remarks=? WHERE goods_type=?';

			arr = [goods_typename, remarks, goods_type];
		} else {
			// 新增
			sql = 'INSERT INTO goodstype(goods_typename, remarks) VALUES(?,?)';
			arr = [goods_typename, remarks, remarks];


		}


		func.connPool(sql, arr, (err, rows) => {
			if(err){
				res.json({
					code: 403,
					msg: '保存失败',
					data: err.message
				});
				return;
			}
			res.json({
				code: 200,
				msg: '保存成功'
			});
		});


	},




	// 删除商品

	deleteOne(req, res) {

		let goods_type = req.body.goods_type;

		let sql = 'DELETE from goodstype WHERE goods_type = ?';
		let arr = [goods_type];

		func.connPool(sql, arr, (err, rows) => {
			if(err){
				res.json({
					code: 403,
					msg: err.message
				});
				return;
			}
			res.json({
				code: 200,
				msg: '删除成功'
			});
		});

	},


};
