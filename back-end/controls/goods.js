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

		let goods_name = param.goods_name;

		if (goods_name) {
			goods_name = '%' + goods_name + '%';
			sql = 'select COUNT(*) from goods where goods_name like ?;select * from goods where goods_name like ? limit ?, ?';
			arr = [goods_name, goods_name, start, page_size];
		} else {
			sql = 'select COUNT(*) from `goods`;select * from `goods`  limit ?, ?';
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




	//商品类型

	fetchType(req, res) {

		let sql = 'select * from goodstype  ';

		func.connPool(sql, (err, rows) => {
			rows = formatData(rows);
			res.json({
				code: 200,
				data: rows
			});

		});



	},






	// 获取商品详情

	fetchById(req, res) {
		let goods_id = req.body.goods_id;

		let sql = 'select * from goods WHERE goods_id = ?';
		let arr = [goods_id];

		func.connPool(sql, arr, (err, rows) => {

			rows = formatData(rows);
			res.json({
				code: 200,
				data: rows[0]
			});
		});


	},





	// 添加|更新 商品
	addOne(req, res) {
		let goods_id = req.body.goods_id;
		console.log(goods_id);
		let goods_name = req.body.goods_name;
		let goods_price = req.body.goods_price;
		let goods_type = req.body.goods_type;
		let goods_typename = req.body.goods_typename;
		let inventory = req.body.inventory;

		let imgs = req.body.imgs;
		let onsale = req.body.onsale;
		let goods_details = req.body.goods_details;

		let sql, arr;

		if (goods_id) {
			// 更新
			sql = 'UPDATE goods SET goods_name=?, goods_price=? ,goods_type =? ,goods_typename =? ,inventory =? ,imgs =?,onsale=?,goods_details =?  WHERE goods_id=?';
			arr = [goods_name, goods_price, goods_type, goods_typename, inventory, imgs, onsale, goods_details, goods_id];
		} else {
			// 新增
			sql = 'INSERT INTO goods(goods_name, goods_price,goods_type,goods_typename,inventory,imgs,onsale, goods_details) VALUES(?,?,?,?,?,?,?,?)';
			arr = [goods_name, goods_price, goods_type, goods_typename, inventory, imgs, onsale, goods_details];

		}



		func.connPool(sql, arr, (err, rows) => {
			res.json({
				code: 200,
				msg: '保存成功'
			});
		});

	},


	// 删除商品


	deleteOne(req, res) {

		let goods_id = req.body.goods_id;

		let sql = 'DELETE  from goods WHERE goods_id = ?';
		let arr = [goods_id];

		func.connPool(sql, arr, (err, rows) => {
			res.json({
				code: 200,
				msg: '删除成功'
			});
		});

	},




	// 批量删除
	deleteMulti(req, res) {
		let goods_id = req.body.goods_id;

		let sql = 'DELETE  from goods WHERE goods_id in ?';
		let arr = [[goods_id]];

		func.connPool(sql, arr, (err, rows) => {
			res.json({
				code: 200,
				msg: '删除成功'
			});
		});

	}
};
