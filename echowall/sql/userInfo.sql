-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2018-11-17 11:02:33
-- 服务器版本： 8.0.12
-- PHP 版本： 7.0.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `echo`
--

-- --------------------------------------------------------

--
-- 表的结构 `userInfo`
--

CREATE TABLE `userInfo` (
  `id` int(11) NOT NULL,
  `avatarUrl` varchar(200) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `language` varchar(20) DEFAULT NULL,
  `nickName` varchar(200) DEFAULT NULL,
  `openId` varchar(200) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 转存表中的数据 `userInfo`
--

INSERT INTO `userInfo` (`id`, `avatarUrl`, `city`, `country`, `gender`, `language`, `nickName`, `openId`, `province`) VALUES
(10008, 'https://wx.qlogo.cn/mmopen/vi_32/8m1L3YXwEKW8lyEPLzRDRrEGovOXibvYLnicuzRIQfmP5VqRev2gLfyfqpia29UdauNDiatbHexoVZaPkichJvLJFFw/132', '', 'Belgium', '1', 'zh_CN', 'Lcanboom', 'ooLul5CHCCZGeIZ9B1-mGuKfdiag', '');

--
-- 转储表的索引
--

--
-- 表的索引 `userInfo`
--
ALTER TABLE `userInfo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `openId` (`openId`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `userInfo`
--
ALTER TABLE `userInfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10016;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
