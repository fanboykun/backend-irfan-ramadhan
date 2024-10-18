/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `product_transaction`;
CREATE TABLE `product_transaction` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transactionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `sub_total` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_transaction_transactionId_fkey` (`transactionId`),
  KEY `product_transaction_productId_fkey` (`productId`),
  CONSTRAINT `product_transaction_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `product_transaction_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `transactions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double NOT NULL,
  `merchantId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `products_merchantId_fkey` (`merchantId`),
  CONSTRAINT `products_merchantId_fkey` FOREIGN KEY (`merchantId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `promo_transaction`;
CREATE TABLE `promo_transaction` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transactionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `promoId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `promo_transaction_transactionId_fkey` (`transactionId`),
  KEY `promo_transaction_promoId_fkey` (`promoId`),
  CONSTRAINT `promo_transaction_promoId_fkey` FOREIGN KEY (`promoId`) REFERENCES `promos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `promo_transaction_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `transactions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `promos`;
CREATE TABLE `promos` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount` int NOT NULL,
  `minimun` double NOT NULL,
  `affectOn` enum('SHIPPING','PRICE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customerId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_before_discount` double NOT NULL,
  `total_discount` double DEFAULT NULL,
  `shipping_cost` double DEFAULT NULL,
  `total_price` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `transactions_customerId_fkey` (`customerId`),
  CONSTRAINT `transactions_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('MERCHANT','CUSTOMER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CUSTOMER',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('3668d9b8-9ad0-44a0-8c31-9aa715233406', '5c275a05a0daf880177e7cc94a41f3f9e350bea8825f1eacfc8bed0f72c520b9', '2024-10-18 10:30:56.973', '20241018103056_', NULL, NULL, '2024-10-18 10:30:56.601', 1);
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('6e4476ff-dbe4-4c6f-987e-40752a6ac702', '0e0c13f2abb592f4286c695c6911c87ee12b5201370d2dcac0fdbef4ec7788f2', '2024-10-18 10:30:55.698', '20241018071418_init', NULL, NULL, '2024-10-18 10:30:55.354', 1);


INSERT INTO `product_transaction` (`id`, `transactionId`, `productId`, `quantity`, `sub_total`, `createdAt`, `updatedAt`) VALUES
('14206eaf-5bed-4a9e-a5f3-965b8d972175', 'b24b803f-f310-4d7a-a8c1-62f588bf9963', 'd8ed7098-f3cc-4440-bb22-a5409145cd84', 4, 60444, '2024-10-18 17:59:22.494', '2024-10-18 17:59:22.494');
INSERT INTO `product_transaction` (`id`, `transactionId`, `productId`, `quantity`, `sub_total`, `createdAt`, `updatedAt`) VALUES
('152f7ce5-c2f3-46d7-af4c-fea3cc54c019', 'f799e740-0b39-4080-93c0-81d2be024d05', '14efad91-17da-41c4-b096-8d2e3a3b8437', 3, 55854, '2024-10-18 17:59:22.516', '2024-10-18 17:59:22.516');
INSERT INTO `product_transaction` (`id`, `transactionId`, `productId`, `quantity`, `sub_total`, `createdAt`, `updatedAt`) VALUES
('170f66c1-5e36-4b4c-b6b7-0625ac28353f', '7d9d627e-f0e1-4e36-ae49-8e453ea18ceb', 'd8ed7098-f3cc-4440-bb22-a5409145cd84', 2, 30222, '2024-10-18 17:59:22.488', '2024-10-18 17:59:22.488');
INSERT INTO `product_transaction` (`id`, `transactionId`, `productId`, `quantity`, `sub_total`, `createdAt`, `updatedAt`) VALUES
('1d940799-319e-4d63-8739-e7a24bf09f13', 'd03a7387-011f-4422-b264-0f7809b826f1', '14efad91-17da-41c4-b096-8d2e3a3b8437', 5, 93090, '2024-10-18 17:59:22.522', '2024-10-18 17:59:22.522'),
('1ee85c48-2652-4abc-8817-d43ed9242d69', '9453f79f-3d4c-433c-b958-55922146b9d7', 'bd9eb2e4-93df-4803-afbd-22059d6dcfad', 3, 37992, '2024-10-18 17:59:22.478', '2024-10-18 17:59:22.478'),
('1fbe5291-f0aa-4157-af24-cd9c67350deb', 'd03a7387-011f-4422-b264-0f7809b826f1', 'f2874c4e-9497-4878-a059-7aac5ff585b1', 5, 56895, '2024-10-18 17:59:22.522', '2024-10-18 17:59:22.522'),
('23c768ae-f61f-4a95-9f5a-9adf4f08c64a', '55bfda32-676f-426b-a4c1-95961c5a23f1', 'd8ed7098-f3cc-4440-bb22-a5409145cd84', 1, 15111, '2024-10-18 17:59:22.483', '2024-10-18 17:59:22.483'),
('2ac58e73-a4f4-4aa0-9919-903f470e0775', '7a9bc10e-3ed5-4684-a1d7-5ed2cbe6626c', '14efad91-17da-41c4-b096-8d2e3a3b8437', 2, 37236, '2024-10-18 17:59:22.471', '2024-10-18 17:59:22.471'),
('437545a6-dfc5-4deb-8d6f-3f7ca0be95f9', '7d9d627e-f0e1-4e36-ae49-8e453ea18ceb', '14efad91-17da-41c4-b096-8d2e3a3b8437', 3, 55854, '2024-10-18 17:59:22.488', '2024-10-18 17:59:22.488'),
('44efb330-517b-49b4-847f-b6c021937c51', 'd03a7387-011f-4422-b264-0f7809b826f1', 'd8ed7098-f3cc-4440-bb22-a5409145cd84', 5, 75555, '2024-10-18 17:59:22.522', '2024-10-18 17:59:22.522'),
('46e3740f-37c0-4778-a640-1998dc4bfc7c', '7a9bc10e-3ed5-4684-a1d7-5ed2cbe6626c', 'd8ed7098-f3cc-4440-bb22-a5409145cd84', 5, 75555, '2024-10-18 17:59:22.471', '2024-10-18 17:59:22.471'),
('49f00bdf-21a7-4ba6-8836-412003e162c9', '196359a1-c0b6-464b-aa70-f233f557b561', '14efad91-17da-41c4-b096-8d2e3a3b8437', 5, 93090, '2024-10-18 17:59:22.500', '2024-10-18 17:59:22.500'),
('4e8e5df1-a5f9-4b01-a4ec-ea29ee7e98ab', '9453f79f-3d4c-433c-b958-55922146b9d7', '376de8e5-dc51-4d7d-a700-158b11a71509', 5, 44660, '2024-10-18 17:59:22.478', '2024-10-18 17:59:22.478'),
('50f4eae0-e67d-40e9-9213-3f9f722cb561', '0a98e8c2-1a7d-4331-8512-1316e5edd0da', '376de8e5-dc51-4d7d-a700-158b11a71509', 1, 8932, '2024-10-18 17:59:22.506', '2024-10-18 17:59:22.506'),
('554c9ea1-312a-44fa-a17e-cc2c368b158a', '55bfda32-676f-426b-a4c1-95961c5a23f1', '14efad91-17da-41c4-b096-8d2e3a3b8437', 2, 37236, '2024-10-18 17:59:22.483', '2024-10-18 17:59:22.483'),
('56f7f52e-ed04-45f6-b3b1-8e6bbca9ddc2', '2f0ff260-8d35-4309-85ad-cd09b50a49db', 'f2874c4e-9497-4878-a059-7aac5ff585b1', 5, 56895, '2024-10-18 17:59:22.510', '2024-10-18 17:59:22.510'),
('5c83457b-f33f-4391-87d0-d59ff52a0a14', '2f0ff260-8d35-4309-85ad-cd09b50a49db', '14efad91-17da-41c4-b096-8d2e3a3b8437', 2, 37236, '2024-10-18 17:59:22.510', '2024-10-18 17:59:22.510'),
('6122d6c8-3b1d-4485-a639-e0eb9337b9c7', '7a9bc10e-3ed5-4684-a1d7-5ed2cbe6626c', '376de8e5-dc51-4d7d-a700-158b11a71509', 1, 8932, '2024-10-18 17:59:22.471', '2024-10-18 17:59:22.471'),
('68edc213-5077-40e7-b4cd-c215d2567d2f', '196359a1-c0b6-464b-aa70-f233f557b561', '376de8e5-dc51-4d7d-a700-158b11a71509', 1, 8932, '2024-10-18 17:59:22.500', '2024-10-18 17:59:22.500'),
('69d4ccf5-6345-4fc6-8475-31b91686bbd0', '55bfda32-676f-426b-a4c1-95961c5a23f1', '376de8e5-dc51-4d7d-a700-158b11a71509', 3, 26796, '2024-10-18 17:59:22.483', '2024-10-18 17:59:22.483'),
('6ab32bd9-5096-4e0e-b8bf-02419a9d3bd7', '9453f79f-3d4c-433c-b958-55922146b9d7', 'd8ed7098-f3cc-4440-bb22-a5409145cd84', 1, 15111, '2024-10-18 17:59:22.478', '2024-10-18 17:59:22.478'),
('6b34322c-e0d1-49b6-be5b-ed1f5369c992', 'd03a7387-011f-4422-b264-0f7809b826f1', '3150fea3-238e-4a69-81b6-b771c61a7b17', 1, 11844, '2024-10-18 17:59:22.522', '2024-10-18 17:59:22.522'),
('72db4aea-805b-4b2b-93af-534e4df3c6ca', 'c97ad8c4-ee71-4961-bc21-4da8500d248a', 'f2874c4e-9497-4878-a059-7aac5ff585b1', 1, 11379, '2024-10-18 18:11:46.023', '2024-10-18 18:14:06.473'),
('7402d70b-263b-4c70-a88d-c9037f0eb25d', '7d9d627e-f0e1-4e36-ae49-8e453ea18ceb', '376de8e5-dc51-4d7d-a700-158b11a71509', 5, 44660, '2024-10-18 17:59:22.488', '2024-10-18 17:59:22.488'),
('7df2f958-248d-4ebe-89b2-4a162244206b', '0a98e8c2-1a7d-4331-8512-1316e5edd0da', '14efad91-17da-41c4-b096-8d2e3a3b8437', 2, 37236, '2024-10-18 17:59:22.506', '2024-10-18 17:59:22.506'),
('7f720815-880f-4171-bfa2-08e46cedaba0', 'd03a7387-011f-4422-b264-0f7809b826f1', '78258ba5-3a77-490f-b091-cf74a563adcf', 4, 45016, '2024-10-18 17:59:22.522', '2024-10-18 17:59:22.522'),
('80bb9594-e5ba-4927-9b51-9b873d13dc41', '7d9d627e-f0e1-4e36-ae49-8e453ea18ceb', 'bd9eb2e4-93df-4803-afbd-22059d6dcfad', 3, 37992, '2024-10-18 17:59:22.488', '2024-10-18 17:59:22.488'),
('833834ae-9cb5-43f5-a168-181fc5417c36', '0a98e8c2-1a7d-4331-8512-1316e5edd0da', '78258ba5-3a77-490f-b091-cf74a563adcf', 5, 56270, '2024-10-18 17:59:22.506', '2024-10-18 17:59:22.506'),
('833e6b10-4576-4dd7-99d1-80d2ec046917', 'b24b803f-f310-4d7a-a8c1-62f588bf9963', 'f2874c4e-9497-4878-a059-7aac5ff585b1', 5, 56895, '2024-10-18 17:59:22.494', '2024-10-18 17:59:22.494'),
('8341b067-f831-451c-99c8-e21075b036bb', 'd03a7387-011f-4422-b264-0f7809b826f1', '376de8e5-dc51-4d7d-a700-158b11a71509', 4, 35728, '2024-10-18 17:59:22.522', '2024-10-18 17:59:22.522'),
('8cc68aa5-832f-4112-b9c9-a5bfecdabc12', '55bfda32-676f-426b-a4c1-95961c5a23f1', '78258ba5-3a77-490f-b091-cf74a563adcf', 1, 11254, '2024-10-18 17:59:22.483', '2024-10-18 17:59:22.483'),
('95ac548c-4717-42c6-b5fe-6ba692b1a156', '2f0ff260-8d35-4309-85ad-cd09b50a49db', '78258ba5-3a77-490f-b091-cf74a563adcf', 5, 56270, '2024-10-18 17:59:22.510', '2024-10-18 17:59:22.510'),
('9cad4b80-6802-42f5-bdda-e38ebaada949', 'b24b803f-f310-4d7a-a8c1-62f588bf9963', '376de8e5-dc51-4d7d-a700-158b11a71509', 2, 17864, '2024-10-18 17:59:22.494', '2024-10-18 17:59:22.494'),
('a50beefd-b057-484d-a2fd-3a87bc363690', 'b24b803f-f310-4d7a-a8c1-62f588bf9963', '78258ba5-3a77-490f-b091-cf74a563adcf', 5, 56270, '2024-10-18 17:59:22.494', '2024-10-18 17:59:22.494'),
('a564e613-2567-4018-bb5a-b1dc14cbd53f', '9453f79f-3d4c-433c-b958-55922146b9d7', '78258ba5-3a77-490f-b091-cf74a563adcf', 5, 56270, '2024-10-18 17:59:22.478', '2024-10-18 17:59:22.478'),
('a8598ded-f4d7-481f-bb28-f94a03ae2d76', '9453f79f-3d4c-433c-b958-55922146b9d7', '14efad91-17da-41c4-b096-8d2e3a3b8437', 3, 55854, '2024-10-18 17:59:22.478', '2024-10-18 17:59:22.478'),
('ada017a6-36f3-4e35-a893-9a0be1960c72', '2f0ff260-8d35-4309-85ad-cd09b50a49db', 'd8ed7098-f3cc-4440-bb22-a5409145cd84', 2, 30222, '2024-10-18 17:59:22.510', '2024-10-18 17:59:22.510'),
('b523b80f-91f4-41a6-9e83-c885cbdc0bb4', '0a98e8c2-1a7d-4331-8512-1316e5edd0da', 'd8ed7098-f3cc-4440-bb22-a5409145cd84', 3, 45333, '2024-10-18 17:59:22.506', '2024-10-18 17:59:22.506'),
('b68e9684-9177-4bf6-aa5f-2f621bdaf867', 'd03a7387-011f-4422-b264-0f7809b826f1', 'bd9eb2e4-93df-4803-afbd-22059d6dcfad', 5, 63320, '2024-10-18 17:59:22.522', '2024-10-18 17:59:22.522'),
('b75b8339-82ea-4602-a961-4f56501e60fd', 'b24b803f-f310-4d7a-a8c1-62f588bf9963', '3150fea3-238e-4a69-81b6-b771c61a7b17', 1, 11844, '2024-10-18 17:59:22.494', '2024-10-18 17:59:22.494'),
('b775fd4e-5c90-46f5-aaa6-b3f6bffd6969', '7d9d627e-f0e1-4e36-ae49-8e453ea18ceb', 'f2874c4e-9497-4878-a059-7aac5ff585b1', 3, 34137, '2024-10-18 17:59:22.488', '2024-10-18 17:59:22.488'),
('c20b679b-c29e-401f-9941-2b181748a171', '2f0ff260-8d35-4309-85ad-cd09b50a49db', '376de8e5-dc51-4d7d-a700-158b11a71509', 4, 35728, '2024-10-18 17:59:22.510', '2024-10-18 17:59:22.510'),
('c37b17c7-3a3d-4ffe-b390-b66dd18b86a6', 'f799e740-0b39-4080-93c0-81d2be024d05', '78258ba5-3a77-490f-b091-cf74a563adcf', 5, 56270, '2024-10-18 17:59:22.516', '2024-10-18 17:59:22.516'),
('c7d330ca-c206-4ece-b521-2f92730e5f41', '7d9d627e-f0e1-4e36-ae49-8e453ea18ceb', '78258ba5-3a77-490f-b091-cf74a563adcf', 3, 33762, '2024-10-18 17:59:22.488', '2024-10-18 17:59:22.488'),
('ca3bf238-a8ec-41b9-a041-abc9da923733', '2f0ff260-8d35-4309-85ad-cd09b50a49db', 'bd9eb2e4-93df-4803-afbd-22059d6dcfad', 4, 50656, '2024-10-18 17:59:22.510', '2024-10-18 17:59:22.510'),
('cc1983a0-c9a2-4164-82ee-23d7228d3e0e', 'f799e740-0b39-4080-93c0-81d2be024d05', '376de8e5-dc51-4d7d-a700-158b11a71509', 3, 26796, '2024-10-18 17:59:22.516', '2024-10-18 17:59:22.516'),
('d853968f-755c-47b3-81ae-b28a3a29a324', '2f0ff260-8d35-4309-85ad-cd09b50a49db', '3150fea3-238e-4a69-81b6-b771c61a7b17', 5, 59220, '2024-10-18 17:59:22.510', '2024-10-18 17:59:22.510'),
('d89433c4-a1ea-4d3a-aefe-f9e9ce3f4a95', '0a98e8c2-1a7d-4331-8512-1316e5edd0da', 'bd9eb2e4-93df-4803-afbd-22059d6dcfad', 2, 25328, '2024-10-18 17:59:22.506', '2024-10-18 17:59:22.506'),
('e71ff5c4-a14b-42cd-9f44-7c078dfcbfec', 'b24b803f-f310-4d7a-a8c1-62f588bf9963', '14efad91-17da-41c4-b096-8d2e3a3b8437', 2, 37236, '2024-10-18 17:59:22.494', '2024-10-18 17:59:22.494'),
('ed0217c9-591c-4a49-bdec-7d3b64db00ea', 'b24b803f-f310-4d7a-a8c1-62f588bf9963', 'bd9eb2e4-93df-4803-afbd-22059d6dcfad', 5, 63320, '2024-10-18 17:59:22.494', '2024-10-18 17:59:22.494'),
('eda0b9d5-174d-418c-a0cd-50519b41af42', 'd1f223d6-41fa-424f-8cbd-72bdd19e1d3a', 'fa638eae-0486-4488-bedf-7069e2ae3027', 2, 33126, '2024-10-18 18:59:42.409', '2024-10-18 19:01:14.947'),
('fd9a0114-4e35-4e13-a8b2-15638a0e7995', 'f799e740-0b39-4080-93c0-81d2be024d05', 'd8ed7098-f3cc-4440-bb22-a5409145cd84', 3, 45333, '2024-10-18 17:59:22.516', '2024-10-18 17:59:22.516'),
('fde7d936-89b0-47c3-8b85-250623ac13f0', '7d9d627e-f0e1-4e36-ae49-8e453ea18ceb', '3150fea3-238e-4a69-81b6-b771c61a7b17', 1, 11844, '2024-10-18 17:59:22.488', '2024-10-18 17:59:22.488');

INSERT INTO `products` (`id`, `name`, `price`, `merchantId`, `createdAt`, `updatedAt`) VALUES
('14efad91-17da-41c4-b096-8d2e3a3b8437', 'Tasty Soft Hat', 18618, '5cc19f20-d84a-4149-9610-4498b4022b1d', '2024-10-18 17:59:22.463', '2024-10-18 17:59:22.463');
INSERT INTO `products` (`id`, `name`, `price`, `merchantId`, `createdAt`, `updatedAt`) VALUES
('3150fea3-238e-4a69-81b6-b771c61a7b17', 'Bespoke Fresh Bike', 11844, '5cc19f20-d84a-4149-9610-4498b4022b1d', '2024-10-18 17:59:22.463', '2024-10-18 17:59:22.463');
INSERT INTO `products` (`id`, `name`, `price`, `merchantId`, `createdAt`, `updatedAt`) VALUES
('376de8e5-dc51-4d7d-a700-158b11a71509', 'Generic Bronze Chips', 8932, '5cc19f20-d84a-4149-9610-4498b4022b1d', '2024-10-18 17:59:22.463', '2024-10-18 17:59:22.463');
INSERT INTO `products` (`id`, `name`, `price`, `merchantId`, `createdAt`, `updatedAt`) VALUES
('78258ba5-3a77-490f-b091-cf74a563adcf', 'Incredible Granite Towels', 11254, '5cc19f20-d84a-4149-9610-4498b4022b1d', '2024-10-18 17:59:22.463', '2024-10-18 17:59:22.463'),
('bd9eb2e4-93df-4803-afbd-22059d6dcfad', 'Licensed Wooden Keyboard', 12664, '5cc19f20-d84a-4149-9610-4498b4022b1d', '2024-10-18 17:59:22.463', '2024-10-18 17:59:22.463'),
('bfd2c660-b18f-4037-bdde-1de2bb4feedb', 'Ergonomic Soft Pizza', 15435, '5cc19f20-d84a-4149-9610-4498b4022b1d', '2024-10-18 17:59:22.463', '2024-10-18 17:59:22.463'),
('d8ed7098-f3cc-4440-bb22-a5409145cd84', 'Handcrafted Fresh Car', 15111, '5cc19f20-d84a-4149-9610-4498b4022b1d', '2024-10-18 17:59:22.463', '2024-10-18 17:59:22.463'),
('ef680d30-7b40-42a8-bec3-709cdafaf015', 'Es Teh Jumbo', 5000, '5cc19f20-d84a-4149-9610-4498b4022b1d', '2024-10-18 19:12:27.210', '2024-10-18 19:14:28.801'),
('f2874c4e-9497-4878-a059-7aac5ff585b1', 'Tasty Cotton Soap', 11379, '5cc19f20-d84a-4149-9610-4498b4022b1d', '2024-10-18 17:59:22.463', '2024-10-18 17:59:22.463'),
('fa638eae-0486-4488-bedf-7069e2ae3027', 'Ergonomic Frozen Car', 16563, '5cc19f20-d84a-4149-9610-4498b4022b1d', '2024-10-18 17:59:22.463', '2024-10-18 17:59:22.463');

INSERT INTO `promo_transaction` (`id`, `transactionId`, `promoId`, `createdAt`, `updatedAt`) VALUES
('11d417b7-f259-4d02-acd6-d250354c66f3', 'b24b803f-f310-4d7a-a8c1-62f588bf9963', '3e19e3f0-b413-44f1-bd40-6c33b205fa88', '2024-10-18 17:59:22.494', '2024-10-18 17:59:22.494');
INSERT INTO `promo_transaction` (`id`, `transactionId`, `promoId`, `createdAt`, `updatedAt`) VALUES
('18d21ab6-95c6-49ad-9f95-ee126e9f7bf3', 'b24b803f-f310-4d7a-a8c1-62f588bf9963', '2dd79095-a656-44c4-a22f-5de78c15c798', '2024-10-18 17:59:22.494', '2024-10-18 17:59:22.494');
INSERT INTO `promo_transaction` (`id`, `transactionId`, `promoId`, `createdAt`, `updatedAt`) VALUES
('1d44ffbf-7d35-4b18-8fde-b4bfd36adcbb', 'f799e740-0b39-4080-93c0-81d2be024d05', '2dd79095-a656-44c4-a22f-5de78c15c798', '2024-10-18 17:59:22.516', '2024-10-18 17:59:22.516');
INSERT INTO `promo_transaction` (`id`, `transactionId`, `promoId`, `createdAt`, `updatedAt`) VALUES
('1fa3efbd-43d7-471c-83a7-776c643087ff', '9453f79f-3d4c-433c-b958-55922146b9d7', '3e19e3f0-b413-44f1-bd40-6c33b205fa88', '2024-10-18 17:59:22.478', '2024-10-18 17:59:22.478'),
('35629b10-16b6-4334-aad7-8e061357f328', 'd1f223d6-41fa-424f-8cbd-72bdd19e1d3a', '3e19e3f0-b413-44f1-bd40-6c33b205fa88', '2024-10-18 18:59:42.409', '2024-10-18 18:59:42.409'),
('40aff341-2e03-41ae-b4b2-91f493ea3810', 'd03a7387-011f-4422-b264-0f7809b826f1', '3e19e3f0-b413-44f1-bd40-6c33b205fa88', '2024-10-18 17:59:22.522', '2024-10-18 17:59:22.522'),
('4eecff9c-7b57-4f63-b5f1-653344b03138', '7d9d627e-f0e1-4e36-ae49-8e453ea18ceb', '2dd79095-a656-44c4-a22f-5de78c15c798', '2024-10-18 17:59:22.488', '2024-10-18 17:59:22.488'),
('6a47326b-6892-4327-a1be-2b478b1f1d70', '7a9bc10e-3ed5-4684-a1d7-5ed2cbe6626c', '2dd79095-a656-44c4-a22f-5de78c15c798', '2024-10-18 17:59:22.471', '2024-10-18 17:59:22.471'),
('80fb2b77-b34c-4ba9-b830-3931094b19d6', 'f799e740-0b39-4080-93c0-81d2be024d05', '3e19e3f0-b413-44f1-bd40-6c33b205fa88', '2024-10-18 17:59:22.516', '2024-10-18 17:59:22.516'),
('8869b890-9645-4097-ac01-3045e7326fa0', '2f0ff260-8d35-4309-85ad-cd09b50a49db', '3e19e3f0-b413-44f1-bd40-6c33b205fa88', '2024-10-18 17:59:22.510', '2024-10-18 17:59:22.510'),
('890e5c58-b37c-466d-bc3b-72174ed3afcf', '7d9d627e-f0e1-4e36-ae49-8e453ea18ceb', '3e19e3f0-b413-44f1-bd40-6c33b205fa88', '2024-10-18 17:59:22.488', '2024-10-18 17:59:22.488'),
('9a98876b-b78f-4cda-9af2-548cb6d10d38', '196359a1-c0b6-464b-aa70-f233f557b561', '2dd79095-a656-44c4-a22f-5de78c15c798', '2024-10-18 17:59:22.500', '2024-10-18 17:59:22.500'),
('a9c03219-80db-47cb-beab-4a62338938fc', '0a98e8c2-1a7d-4331-8512-1316e5edd0da', '3e19e3f0-b413-44f1-bd40-6c33b205fa88', '2024-10-18 17:59:22.506', '2024-10-18 17:59:22.506'),
('b1295a12-7ffe-482d-84bd-80f4be3da138', '55bfda32-676f-426b-a4c1-95961c5a23f1', '3e19e3f0-b413-44f1-bd40-6c33b205fa88', '2024-10-18 17:59:22.483', '2024-10-18 17:59:22.483'),
('c1fd6104-8290-4966-a076-e1b218537de8', '2f0ff260-8d35-4309-85ad-cd09b50a49db', '2dd79095-a656-44c4-a22f-5de78c15c798', '2024-10-18 17:59:22.510', '2024-10-18 17:59:22.510'),
('c6896885-f992-4db5-b7e6-ef4c0395fb30', '7a9bc10e-3ed5-4684-a1d7-5ed2cbe6626c', '3e19e3f0-b413-44f1-bd40-6c33b205fa88', '2024-10-18 17:59:22.471', '2024-10-18 17:59:22.471'),
('e09cb0c7-0f7d-4b14-9dc1-f7d7e73a8168', '196359a1-c0b6-464b-aa70-f233f557b561', '3e19e3f0-b413-44f1-bd40-6c33b205fa88', '2024-10-18 17:59:22.500', '2024-10-18 17:59:22.500'),
('e567c21d-3f20-476f-b914-1afef768df59', '55bfda32-676f-426b-a4c1-95961c5a23f1', '2dd79095-a656-44c4-a22f-5de78c15c798', '2024-10-18 17:59:22.483', '2024-10-18 17:59:22.483'),
('ed3997ba-3611-4f75-ba6a-6b2e9c3a30d3', '9453f79f-3d4c-433c-b958-55922146b9d7', '2dd79095-a656-44c4-a22f-5de78c15c798', '2024-10-18 17:59:22.478', '2024-10-18 17:59:22.478'),
('f357a110-28b9-4c9a-840a-ffb72d5f4659', 'd03a7387-011f-4422-b264-0f7809b826f1', '2dd79095-a656-44c4-a22f-5de78c15c798', '2024-10-18 17:59:22.522', '2024-10-18 17:59:22.522'),
('ff382b1d-9bb9-4a58-8893-35d2ba5abb8e', '0a98e8c2-1a7d-4331-8512-1316e5edd0da', '2dd79095-a656-44c4-a22f-5de78c15c798', '2024-10-18 17:59:22.506', '2024-10-18 17:59:22.506');

INSERT INTO `promos` (`id`, `name`, `discount`, `minimun`, `affectOn`, `createdAt`, `updatedAt`) VALUES
('2dd79095-a656-44c4-a22f-5de78c15c798', 'Discount 10%', 10, 50000, 'PRICE', '2024-10-18 17:59:22.467', '2024-10-18 17:59:22.467');
INSERT INTO `promos` (`id`, `name`, `discount`, `minimun`, `affectOn`, `createdAt`, `updatedAt`) VALUES
('3e19e3f0-b413-44f1-bd40-6c33b205fa88', 'Gratis Ongkir', 100, 15000, 'SHIPPING', '2024-10-18 17:59:22.467', '2024-10-18 17:59:22.467');


INSERT INTO `transactions` (`id`, `customerId`, `price_before_discount`, `total_discount`, `shipping_cost`, `total_price`, `createdAt`, `updatedAt`) VALUES
('0a98e8c2-1a7d-4331-8512-1316e5edd0da', 'ff509d84-466c-442f-9e23-74fd1df1f31e', 173099, 17309, 0, 155790, '2024-10-18 17:59:22.506', '2024-10-18 17:59:22.506');
INSERT INTO `transactions` (`id`, `customerId`, `price_before_discount`, `total_discount`, `shipping_cost`, `total_price`, `createdAt`, `updatedAt`) VALUES
('196359a1-c0b6-464b-aa70-f233f557b561', 'ff509d84-466c-442f-9e23-74fd1df1f31e', 102022, 10202, 0, 91820, '2024-10-18 17:59:22.500', '2024-10-18 17:59:22.500');
INSERT INTO `transactions` (`id`, `customerId`, `price_before_discount`, `total_discount`, `shipping_cost`, `total_price`, `createdAt`, `updatedAt`) VALUES
('2f0ff260-8d35-4309-85ad-cd09b50a49db', 'ff509d84-466c-442f-9e23-74fd1df1f31e', 326227, 32622, 0, 293605, '2024-10-18 17:59:22.510', '2024-10-18 17:59:22.510');
INSERT INTO `transactions` (`id`, `customerId`, `price_before_discount`, `total_discount`, `shipping_cost`, `total_price`, `createdAt`, `updatedAt`) VALUES
('55bfda32-676f-426b-a4c1-95961c5a23f1', 'ff509d84-466c-442f-9e23-74fd1df1f31e', 90397, 9039, 0, 81358, '2024-10-18 17:59:22.483', '2024-10-18 17:59:22.483'),
('7a9bc10e-3ed5-4684-a1d7-5ed2cbe6626c', 'ff509d84-466c-442f-9e23-74fd1df1f31e', 121723, 12172, 0, 109551, '2024-10-18 17:59:22.471', '2024-10-18 17:59:22.471'),
('7d9d627e-f0e1-4e36-ae49-8e453ea18ceb', 'ff509d84-466c-442f-9e23-74fd1df1f31e', 248471, 24847, 0, 223624, '2024-10-18 17:59:22.488', '2024-10-18 17:59:22.488'),
('9453f79f-3d4c-433c-b958-55922146b9d7', 'ff509d84-466c-442f-9e23-74fd1df1f31e', 209887, 20988, 0, 188899, '2024-10-18 17:59:22.478', '2024-10-18 17:59:22.478'),
('b24b803f-f310-4d7a-a8c1-62f588bf9963', 'ff509d84-466c-442f-9e23-74fd1df1f31e', 303873, 30387, 0, 273486, '2024-10-18 17:59:22.494', '2024-10-18 17:59:22.494'),
('c97ad8c4-ee71-4961-bc21-4da8500d248a', 'ff509d84-466c-442f-9e23-74fd1df1f31e', 11379, 0, 4499, 11379, '2024-10-18 18:11:46.023', '2024-10-18 18:14:06.473'),
('d03a7387-011f-4422-b264-0f7809b826f1', 'ff509d84-466c-442f-9e23-74fd1df1f31e', 381448, 38144, 0, 343304, '2024-10-18 17:59:22.522', '2024-10-18 17:59:22.522'),
('d1f223d6-41fa-424f-8cbd-72bdd19e1d3a', 'ff509d84-466c-442f-9e23-74fd1df1f31e', 33126, 0, 0, 33126, '2024-10-18 18:59:42.409', '2024-10-18 19:01:14.947'),
('f799e740-0b39-4080-93c0-81d2be024d05', 'ff509d84-466c-442f-9e23-74fd1df1f31e', 184253, 18425, 0, 165828, '2024-10-18 17:59:22.516', '2024-10-18 17:59:22.516');

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
('5cc19f20-d84a-4149-9610-4498b4022b1d', 'Mrs. Lana Padberg', 'merchant@gmail.com', '$argon2id$v=19$m=19456,t=2,p=1$uxYnUMac0inslFIy53OkuA$XsDhMi649h78Pwhxd8FqiJinp0eTe6aL29EO1Bkg4eM', 'MERCHANT', '2024-10-18 17:59:22.457', '2024-10-18 20:13:48.318');
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
('ff509d84-466c-442f-9e23-74fd1df1f31e', 'Sherry Denesik DDS', 'customer@gmail.com', '$argon2id$v=19$m=19456,t=2,p=1$uxYnUMac0inslFIy53OkuA$XsDhMi649h78Pwhxd8FqiJinp0eTe6aL29EO1Bkg4eM', 'CUSTOMER', '2024-10-18 17:59:22.457', '2024-10-18 20:13:48.318');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;