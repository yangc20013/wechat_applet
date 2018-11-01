
SET FOREIGN_KEY_CHECKS=0;


/**
CREATE DATABASE IF NOT EXISTS vue_admin default charset utf8 COLLATE utf8_general_ci;

*/

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(40) NOT NULL DEFAULT '',
  `password` varchar(100) NOT NULL DEFAULT '',
  `role` tinyint(3) NOT NULL DEFAULT '0' COMMENT '用户权限',
   `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
   `update_time` datetime COMMENT '更新时间',

  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

insert into `user`(`user_name`,`password`,`role`,`create_time`,`update_time`)values('admin','admin',100,now(),now());

DROP TABLE IF EXISTS `members`;
CREATE TABLE `members` (
  `members_id` int(11) NOT NULL AUTO_INCREMENT,
   `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
   `update_time` datetime COMMENT '更新时间',
  `member_name` varchar(50) NOT NULL DEFAULT 'noname',
  `member_phone` varchar(100) NOT NULL DEFAULT '',
  `remarks` varchar(100) NOT NULL DEFAULT '',
  `recommendation_code` varchar(100) NOT NULL DEFAULT '',
  `membership_level` tinyint(3) NOT NULL DEFAULT '0' COMMENT '会员等级',
  `member_address1` varchar(100) NOT NULL DEFAULT '',		
  `member_address2` varchar(100) NOT NULL DEFAULT '',	
  `member_address3` varchar(100) NOT NULL DEFAULT '',	
	
  PRIMARY KEY (`members_id`),
  UNIQUE KEY `members_id` (`members_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `goodstype`;
CREATE TABLE `goodstype` (
  `goods_type` int(11) NOT NULL AUTO_INCREMENT,
   `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
   `update_time` datetime COMMENT '更新时间',
  `goods_typename` varchar(100) NOT NULL DEFAULT '',
  `remarks` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`goods_type`),
  UNIQUE KEY `goodstype` (`goods_type`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `goods_id` int(11) NOT NULL AUTO_INCREMENT,
   `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
   `update_time` datetime COMMENT '更新时间',
  `goods_name` varchar(50) NOT NULL DEFAULT 'noname',
  `goods_price` float(10,2) NOT NULL DEFAULT '0.00',
  `inventory` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '库存',
  `goods_type` int(11) Default null COMMENT '类型',
  `goods_typename` varchar(50) Default null COMMENT '分类',
  `imgs` varchar(50) Default null,
  `onsale` tinyint(4) unsigned NOT NULL DEFAULT '0' COMMENT '是否上架',
  `goods_details` varchar(50) DEFAULT '' COMMENT '详情',
  PRIMARY KEY (`goods_id`),
  UNIQUE KEY `goods_id` (`goods_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
   `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
   `update_time` datetime COMMENT '更新时间',
 `goods_id` varchar(50) NOT NULL DEFAULT '',
 `goods_name` varchar(50) NOT NULL DEFAULT 'noname',
  `goods_price` float(10,2) NOT NULL DEFAULT '0.00',
  `purchase_quantity` float(10,0) NOT NULL DEFAULT '0',	
  `member_id` varchar(50) NOT NULL DEFAULT '',
  `members_addr` varchar(50) NOT NULL DEFAULT '',
  `state` tinyint(8) NOT NULL DEFAULT '0' COMMENT '订单状态',	
  `state_name` varchar(50) NOT NULL DEFAULT '',	
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `order_id` (`order_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8;
