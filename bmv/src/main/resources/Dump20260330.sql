-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: bmv
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `booking_addons`
--

DROP TABLE IF EXISTS `booking_addons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_addons` (
  `price_per_unit` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  `addon_id` bigint NOT NULL,
  `booking_addon_id` bigint NOT NULL AUTO_INCREMENT,
  `booking_id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`booking_addon_id`),
  KEY `FKq7pf4elwp4nc1a10dn9ttm6or` (`addon_id`),
  KEY `FKfjho8dbfkbf78loy64kx3hgsn` (`booking_id`),
  CONSTRAINT `FKfjho8dbfkbf78loy64kx3hgsn` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  CONSTRAINT `FKq7pf4elwp4nc1a10dn9ttm6or` FOREIGN KEY (`addon_id`) REFERENCES `vendor_service_addons` (`addon_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_addons`
--

LOCK TABLES `booking_addons` WRITE;
/*!40000 ALTER TABLE `booking_addons` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_addons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `amount` decimal(10,2) NOT NULL,
  `booking_date` datetime(6) NOT NULL,
  `booking_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `event_id` bigint NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `vendor_id` bigint NOT NULL,
  `notes` text,
  `booking_status` enum('CANCELLED','COMPLETED','CONFIRMED','PENDING','REJECTED') NOT NULL,
  `payment_status` enum('COMPLETED','FAILED','PARTIAL','PENDING','REFUNDED') NOT NULL,
  `vendor_request_id` bigint NOT NULL,
  PRIMARY KEY (`booking_id`),
  UNIQUE KEY `uq_bookings_vendor_request` (`vendor_request_id`),
  KEY `FK2ww82bk3npaiyu9oeehwtt2q3` (`event_id`),
  KEY `FKjrjb2cmios1nxt6eknr7wwao` (`vendor_id`),
  CONSTRAINT `FK2ww82bk3npaiyu9oeehwtt2q3` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`),
  CONSTRAINT `fk_bookings_vendor_request` FOREIGN KEY (`vendor_request_id`) REFERENCES `vendor_service_requests` (`vendor_request_id`),
  CONSTRAINT `FKjrjb2cmios1nxt6eknr7wwao` FOREIGN KEY (`vendor_id`) REFERENCES `vendor_profiles` (`vendor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (70000.00,'2026-01-14 06:18:35.869971',1,'2026-01-14 06:18:35.869971',13,'2026-01-14 06:18:35.869971',11,'Booking created after vendor confirmation','CONFIRMED','PENDING',8),(60000.00,'2026-01-15 17:42:49.691415',2,'2026-01-15 17:42:49.691415',14,'2026-01-15 17:42:49.691415',22,'Booking created after vendor confirmation','COMPLETED','PENDING',10);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_types`
--

DROP TABLE IF EXISTS `event_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_types` (
  `event_type_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text,
  `icon_url` varchar(255) DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`event_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_types`
--

LOCK TABLES `event_types` WRITE;
/*!40000 ALTER TABLE `event_types` DISABLE KEYS */;
INSERT INTO `event_types` VALUES (1,'2024-01-05 09:00:00.000000','Full wedding planning and vendor coordination including ceremonies and receptions.','?',_binary '','Wedding'),(2,'2024-01-06 09:00:00.000000','Birthday parties for all ages with themes, cakes and entertainers.','?',_binary '','Birthday'),(3,'2024-01-07 09:00:00.000000','Corporate events, conferences, seminars with AV and logistics support.','?',_binary '','Conference'),(4,'2024-01-08 09:00:00.000000','Engagement ceremonies and ring functions with décor and photography.','?',_binary '','Engagement'),(5,'2024-01-09 09:00:00.000000','Graduation parties, college events and prize distributions.','?',_binary '','Graduation'),(6,'2024-01-10 09:00:00.000000','Baby showers and gender-reveal parties with themed décor and catering.','?',_binary '','Baby Shower'),(7,'2024-01-11 09:00:00.000000','Poojas, satsangs and other religious ceremonies with priest arrangements.','?',_binary '','Religious Event'),(8,'2024-01-12 09:00:00.000000','Griha pravesh, housewarming and small family gatherings.','?',_binary '','House Ceremony'),(9,'2024-01-13 09:00:00.000000','Traditional Upanayana / thread ceremony arrangements with catering and priests.','?',_binary '','Upanayana');
/*!40000 ALTER TABLE `event_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `end_time` time(6) DEFAULT NULL,
  `event_date` date NOT NULL,
  `guest_count` int DEFAULT NULL,
  `start_time` time(6) DEFAULT NULL,
  `client_id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `event_id` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) DEFAULT NULL,
  `description` text,
  `title` varchar(255) NOT NULL,
  `venue_address` text,
  `status` enum('CANCELLED','COMPLETED','CONFIRMED','DRAFT','PLANNING') NOT NULL,
  `event_type_id` bigint NOT NULL,
  PRIMARY KEY (`event_id`),
  KEY `FKi6fb12guj9pdvxpp6rlehiw68` (`client_id`),
  KEY `idx_event_type_id` (`event_type_id`),
  CONSTRAINT `FK_events_event_type` FOREIGN KEY (`event_type_id`) REFERENCES `event_types` (`event_type_id`),
  CONSTRAINT `FKi6fb12guj9pdvxpp6rlehiw68` FOREIGN KEY (`client_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (NULL,'2025-08-02',150,'19:09:00.000000',1,'2025-11-16 17:12:12.047535',1,'2025-11-16 17:12:12.047535','','Event - Wedding','Mangalore','DRAFT',1),(NULL,'2025-08-02',150,'06:09:00.000000',1,'2025-11-16 18:10:07.476592',4,'2025-11-16 18:10:07.476592','','Event - Birthday','Mangalore','DRAFT',2),(NULL,'2026-03-04',150,'06:56:00.000000',1,'2026-01-14 04:26:54.095366',10,'2026-01-14 04:26:54.095366','','Event - Wedding','Mangalore','DRAFT',1),(NULL,'2026-06-10',150,'08:27:00.000000',1,'2026-01-14 04:27:48.169028',11,'2026-01-14 04:27:48.169028','','Event - Engagement','Mangalore','DRAFT',4),(NULL,'2026-03-11',150,'08:16:00.000000',1,'2026-01-14 06:15:04.551264',12,'2026-01-15 10:51:01.518681','','Event - Religious Event','Mangalore','CONFIRMED',7),(NULL,'2025-08-02',150,'18:19:00.000000',1,'2026-01-14 06:16:50.554534',13,'2026-01-14 06:16:50.554534','','Event - Upanayana','Mangalore','DRAFT',9),(NULL,'2026-07-10',150,'08:44:00.000000',1,'2026-01-15 17:42:18.403544',14,'2026-01-15 17:43:18.401021','','Event - Baby Shower','Mangalore','COMPLETED',6),(NULL,'2026-01-31',150,'11:00:00.000000',17,'2026-01-21 10:00:58.385574',15,'2026-01-21 10:00:58.385574','','Event - Wedding','Mangalore, Karnataka, India','DRAFT',1),(NULL,'2026-02-02',140,'12:05:00.000000',1,'2026-01-21 10:06:10.682172',16,'2026-01-21 10:06:10.682172','','Event - Wedding','Mangalore, Karnataka, India','DRAFT',1),(NULL,'2026-04-08',100,'03:31:00.000000',1,'2026-03-30 13:30:01.001218',17,'2026-03-30 13:30:01.001218','','Event - Wedding','Mangalore, Karnataka, India','DRAFT',1),(NULL,'2026-03-31',100,'03:37:00.000000',1,'2026-03-30 13:35:37.837732',18,'2026-03-30 13:35:37.837732','','Event - Wedding','Mangalore, Karnataka, India','DRAFT',1);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `created_at` datetime(6) DEFAULT NULL,
  `favorite_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `vendor_service_id` bigint NOT NULL,
  PRIMARY KEY (`favorite_id`),
  UNIQUE KEY `UKfjehuo7wddjotgymng7utr6f3` (`user_id`,`vendor_service_id`),
  KEY `FKfu80rvq2a4nme5pbjq9cv6468` (`vendor_service_id`),
  CONSTRAINT `FKfu80rvq2a4nme5pbjq9cv6468` FOREIGN KEY (`vendor_service_id`) REFERENCES `vendor_services` (`vendor_service_id`),
  CONSTRAINT `FKk7du8b8ewipawnnpg76d55fus` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `is_read` bit(1) NOT NULL,
  `booking_id` bigint DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `message_id` bigint NOT NULL AUTO_INCREMENT,
  `receiver_id` bigint NOT NULL,
  `sender_id` bigint NOT NULL,
  `message_text` text NOT NULL,
  PRIMARY KEY (`message_id`),
  KEY `FK3dchyurwssx2ht9hgswmw7jt1` (`booking_id`),
  KEY `FKt05r0b6n0iis8u7dfna4xdh73` (`receiver_id`),
  KEY `FK4ui4nnwntodh6wjvck53dbk9m` (`sender_id`),
  CONSTRAINT `FK3dchyurwssx2ht9hgswmw7jt1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  CONSTRAINT `FK4ui4nnwntodh6wjvck53dbk9m` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKt05r0b6n0iis8u7dfna4xdh73` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `is_read` bit(1) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `notification_id` bigint NOT NULL AUTO_INCREMENT,
  `reference_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `notification_type` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `FK9y21adhxn0ayjhfocscqox7bh` (`user_id`),
  CONSTRAINT `FK9y21adhxn0ayjhfocscqox7bh` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (_binary '','2026-01-14 04:30:08.867142',1,11,1,'VENDOR_DECLINE','Choose another vendor for Event - Engagement','Vendor declined for service'),(_binary '','2026-01-15 17:42:49.705066',2,14,1,'VENDOR_ACCEPT','Vendor accepted service request for Event - Baby Shower','Update'),(_binary '','2026-01-21 10:06:30.644955',3,16,1,'VENDOR_DECLINE','Choose another vendor for Event - Wedding','Vendor declined for service'),(_binary '','2026-03-30 13:31:13.481131',4,17,1,'VENDOR_DECLINE','Choose another vendor for Event - Wedding','Vendor declined for service');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `amount` decimal(10,2) NOT NULL,
  `booking_id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `payment_date` datetime(6) DEFAULT NULL,
  `payment_id` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) DEFAULT NULL,
  `payment_method` varchar(50) NOT NULL,
  `notes` text,
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment_status` enum('COMPLETED','FAILED','PENDING','REFUNDED') NOT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `FKc52o2b1jkxttngufqp3t7jr3h` (`booking_id`),
  CONSTRAINT `FKc52o2b1jkxttngufqp3t7jr3h` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `is_approved` bit(1) NOT NULL,
  `rating` int NOT NULL,
  `booking_id` bigint NOT NULL,
  `client_id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `review_id` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) DEFAULT NULL,
  `vendor_id` bigint NOT NULL,
  `comment` text,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  KEY `FK28an517hrxtt2bsg93uefugrm` (`booking_id`),
  KEY `FKthot7stvi7mr7qa7jaj6wt0rj` (`client_id`),
  KEY `FK6hfp3ktjxfyo74f7ida5udiyx` (`vendor_id`),
  CONSTRAINT `FK28an517hrxtt2bsg93uefugrm` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  CONSTRAINT `FK6hfp3ktjxfyo74f7ida5udiyx` FOREIGN KEY (`vendor_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKthot7stvi7mr7qa7jaj6wt0rj` FOREIGN KEY (`client_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (_binary '',4,2,1,NULL,1,NULL,15,'bad',NULL);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_images`
--

DROP TABLE IF EXISTS `service_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_images` (
  `is_primary` bit(1) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `image_id` bigint NOT NULL AUTO_INCREMENT,
  `vendor_service_id` bigint NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `image_url` text NOT NULL,
  PRIMARY KEY (`image_id`),
  KEY `FK49xlvapid78w5a7ruv4rc5an2` (`vendor_service_id`),
  CONSTRAINT `FK49xlvapid78w5a7ruv4rc5an2` FOREIGN KEY (`vendor_service_id`) REFERENCES `vendor_services` (`vendor_service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_images`
--

LOCK TABLES `service_images` WRITE;
/*!40000 ALTER TABLE `service_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_requests`
--

DROP TABLE IF EXISTS `service_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_requests` (
  `budget_max` decimal(10,2) DEFAULT NULL,
  `budget_min` decimal(10,2) DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `guest_count` int DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `event_id` bigint NOT NULL,
  `request_id` bigint NOT NULL AUTO_INCREMENT,
  `service_id` bigint NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `requirements` text,
  `status` enum('CANCELLED','COMPLETED','IN_PROGRESS','OPEN') NOT NULL,
  PRIMARY KEY (`request_id`),
  KEY `FKsxbmjjnm1qymlcal1rdaccob5` (`event_id`),
  KEY `FKlw93ns1xph1x18mxh5p4ukb2g` (`service_id`),
  CONSTRAINT `FKlw93ns1xph1x18mxh5p4ukb2g` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`),
  CONSTRAINT `FKsxbmjjnm1qymlcal1rdaccob5` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_requests`
--

LOCK TABLES `service_requests` WRITE;
/*!40000 ALTER TABLE `service_requests` DISABLE KEYS */;
INSERT INTO `service_requests` VALUES (200000.00,0.00,'2025-08-02',150,'2025-11-16 17:12:12.152612',1,1,1,'2025-11-16 17:12:12.152612',NULL,'OPEN'),(65000.00,0.00,'2025-08-02',150,'2025-11-16 17:12:12.201469',1,2,3,'2025-11-16 17:12:12.201469',NULL,'OPEN'),(35000.00,0.00,'2025-08-02',150,'2025-11-16 17:12:12.234785',1,3,4,'2025-11-16 17:12:12.234785',NULL,'OPEN'),(60000.00,0.00,'2025-08-02',150,'2025-11-16 18:10:07.567244',4,4,3,'2025-11-16 18:10:07.567244',NULL,'OPEN'),(85000.00,0.00,'2026-03-04',150,'2026-01-14 04:26:54.260102',10,5,3,'2026-01-14 04:26:54.260102',NULL,'OPEN'),(50000.00,0.00,'2026-06-10',150,'2026-01-14 04:27:48.222910',11,6,3,'2026-01-14 04:27:48.222910',NULL,'OPEN'),(70000.00,0.00,'2026-03-11',150,'2026-01-14 06:15:04.683316',12,7,3,'2026-01-14 06:15:04.683316',NULL,'OPEN'),(70000.00,0.00,'2025-08-02',150,'2026-01-14 06:16:50.635031',13,8,3,'2026-01-14 06:16:50.635031',NULL,'OPEN'),(60000.00,0.00,'2026-07-10',150,'2026-01-15 17:42:18.530459',14,9,3,'2026-01-15 17:42:18.530459',NULL,'COMPLETED'),(75000.00,0.00,'2026-01-31',150,'2026-01-21 10:00:58.686023',15,10,1,'2026-01-21 10:00:58.686023',NULL,'OPEN'),(150000.00,0.00,'2026-01-31',150,'2026-01-21 10:00:58.727576',15,11,3,'2026-01-21 10:00:58.727576',NULL,'OPEN'),(50000.00,0.00,'2026-01-31',150,'2026-01-21 10:00:58.760810',15,12,4,'2026-01-21 10:00:58.760810',NULL,'OPEN'),(105000.00,0.00,'2026-02-02',140,'2026-01-21 10:06:10.884351',16,13,3,'2026-01-21 10:06:10.884351',NULL,'OPEN'),(40000.00,0.00,'2026-04-08',100,'2026-03-30 13:30:02.090691',17,14,3,'2026-03-30 13:30:02.090691',NULL,'OPEN'),(80000.00,0.00,'2026-03-31',100,'2026-03-30 13:35:37.953188',18,15,1,'2026-03-30 13:35:37.953188',NULL,'OPEN'),(75000.00,0.00,'2026-03-31',100,'2026-03-30 13:35:38.052222',18,16,3,'2026-03-30 13:35:38.052222',NULL,'OPEN');
/*!40000 ALTER TABLE `service_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `is_active` bit(1) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `service_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `icon_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (_binary '','2024-01-10 10:00:00.000000',1,'Catering','Full-service catering for all event types — buffet, plated, live counters and custom menus.','?️'),(_binary '','2024-01-11 10:00:00.000000',2,'Decoration','Stage, venue and floral decoration with modern and traditional themes.','?'),(_binary '','2024-01-12 10:00:00.000000',3,'Venue','Halls, lawns and banquet venues with capacity options and in-house facilities.','?️'),(_binary '','2024-01-13 10:00:00.000000',4,'Photography','Professional photography & videography packages, drones and albums.','?'),(_binary '','2024-01-14 10:00:00.000000',5,'Transportation','Guest pick-up/drop, chauffeur driven cars, buses and logistics for events.','?'),(_binary '','2024-01-15 10:00:00.000000',6,'Music & DJ','Live bands, DJs and sound-lighting setup for parties and corporate events.','?'),(_binary '','2024-01-16 10:00:00.000000',7,'Makeup & Styling','Bridal and guest makeup, hair styling and trial sessions.','?'),(_binary '','2024-01-17 10:00:00.000000',8,'Security','Professional event security staff, crowd management and gate control.','?️');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_addresses`
--

DROP TABLE IF EXISTS `user_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_addresses` (
  `is_default` bit(1) NOT NULL,
  `address_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `address_line1` varchar(255) NOT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `pincode` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `address_type` enum('HOME','OTHER','WORK') NOT NULL,
  PRIMARY KEY (`address_id`),
  KEY `FKn2fisxyyu3l9wlch3ve2nocgp` (`user_id`),
  CONSTRAINT `FKn2fisxyyu3l9wlch3ve2nocgp` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_addresses`
--

LOCK TABLES `user_addresses` WRITE;
/*!40000 ALTER TABLE `user_addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `is_verified` bit(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `profile_image_url` text,
  `user_type` enum('ADMIN','CLIENT','VENDOR') NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (_binary '\0','2025-10-23 07:27:56.726192','2026-01-16 15:44:56.641238',1,'e@e.c','madhav','kapoor','r','9008008069','https://firebasestorage.googleapis.com/v0/b/bookmyvendor-4176c.firebasestorage.app/o/profileimg%2Fuser%201%2Fprofile.jpg?alt=media&token=372924d0-76da-4aac-8758-d5da6af5bdec','CLIENT'),(_binary '\0','2025-11-07 03:34:12.152473',NULL,2,'llushey1w@nationalgeographic.com','Lyon','Lushey','ok','1234',NULL,'CLIENT'),(_binary '','2025-11-10 16:18:16.000000','2025-11-10 16:18:16.000000',3,'coastalfeast@gmail.com','Rahul','Shetty','vendor123','9481012345','https://example.com/profiles/rahul_shetty.jpg','VENDOR'),(_binary '','2025-11-10 16:18:16.000000','2025-11-10 16:18:16.000000',4,'blossomdecor@gmail.com','Sneha','Rao','vendor123','9845023456','https://example.com/profiles/sneha_rao.jpg','VENDOR'),(_binary '','2025-11-10 16:18:16.000000','2025-11-10 16:18:16.000000',5,'sapphirehall@gmail.com','Deepak','Naik','vendor123','08242222333','https://example.com/profiles/deepak_naik.jpg','VENDOR'),(_binary '','2025-11-10 16:18:16.000000','2025-11-10 16:18:16.000000',6,'lenscraft@gmail.com','Ananya','Pai','vendor123','9632025678','https://example.com/profiles/ananya_pai.jpg','VENDOR'),(_binary '','2025-11-10 16:18:16.000000','2025-11-10 16:18:16.000000',7,'royalride@gmail.com','Vikram','Fernandes','vendor123','9008090080','https://example.com/profiles/vikram_fernandes.jpg','VENDOR'),(_binary '','2025-11-10 16:18:16.000000','2025-11-10 16:18:16.000000',8,'beatwave@gmail.com','Aakash','Pinto','vendor123','9845011122','https://example.com/profiles/aakash_pinto.jpg','VENDOR'),(_binary '','2025-11-10 16:18:16.000000','2025-11-10 16:18:16.000000',9,'glamupstudio@gmail.com','Meera','Dsilva','vendor123','9886098877','https://example.com/profiles/meera_dsilva.jpg','VENDOR'),(_binary '','2025-11-10 16:18:16.000000','2025-11-10 16:18:16.000000',10,'safeguard@gmail.com','Prashant','Kumar','vendor123','9740012345','https://example.com/profiles/prashant_kumar.jpg','VENDOR'),(_binary '\0','2025-11-10 11:48:49.096346',NULL,12,'p@g.com','Pranava','K','ok','1234567890',NULL,'VENDOR'),(_binary '\0','2025-11-11 09:44:58.637690',NULL,13,'r@c.c','r','erg','ok','24684',NULL,'VENDOR'),(_binary '\0','2026-01-15 13:33:34.279214',NULL,15,'pa@g.com','Pranava','K','pass','1234',NULL,'VENDOR'),(_binary '\0','2026-01-16 17:07:39.456207',NULL,16,'adi@k.com','Pranava','K','pass','21651',NULL,'VENDOR'),(_binary '\0','2026-01-21 09:57:22.727777',NULL,17,'harshaaithal.k@gmail.com','Harsha','K','pass','9008998012',NULL,'CLIENT'),(_binary '','2026-01-21 16:13:53.000000','2026-01-21 16:13:53.000000',18,'cater_mlr_1@bmv.com','Ravi','Cater','$2a$10$hash','900001001',NULL,'VENDOR'),(_binary '','2026-01-21 16:13:53.000000','2026-01-21 16:13:53.000000',19,'cater_mlr_2@bmv.com','Suresh','Cater','$2a$10$hash','900001002',NULL,'VENDOR'),(_binary '','2026-01-21 16:13:53.000000','2026-01-21 16:13:53.000000',20,'cater_mlr_3@bmv.com','Mahesh','Cater','$2a$10$hash','900001003',NULL,'VENDOR'),(_binary '','2026-01-21 16:13:53.000000','2026-01-21 16:13:53.000000',21,'cater_mlr_4@bmv.com','Anil','Cater','$2a$10$hash','900001004',NULL,'VENDOR'),(_binary '','2026-01-21 16:13:53.000000','2026-01-21 16:13:53.000000',22,'cater_mlr_5@bmv.com','Sunil','Cater','$2a$10$hash','900001005',NULL,'VENDOR'),(_binary '','2026-01-21 16:13:53.000000','2026-01-21 16:13:53.000000',23,'cater_mlr_6@bmv.com','Kiran','Cater','$2a$10$hash','900001006',NULL,'VENDOR'),(_binary '','2026-01-21 16:13:53.000000','2026-01-21 16:13:53.000000',24,'cater_mlr_7@bmv.com','Prakash','Cater','$2a$10$hash','900001007',NULL,'VENDOR'),(_binary '','2026-01-21 16:13:53.000000','2026-01-21 16:13:53.000000',25,'cater_mlr_8@bmv.com','Naveen','Cater','$2a$10$hash','900001008',NULL,'VENDOR'),(_binary '','2026-01-21 16:13:53.000000','2026-01-21 16:13:53.000000',26,'cater_mlr_9@bmv.com','Deepak','Cater','$2a$10$hash','900001009',NULL,'VENDOR'),(_binary '','2026-01-21 16:13:53.000000','2026-01-21 16:13:53.000000',27,'cater_mlr_10@bmv.com','Rohit','Cater','$2a$10$hash','900001010',NULL,'VENDOR'),(_binary '','2026-01-21 16:13:53.000000','2026-01-21 16:13:53.000000',28,'cater_mys_1@bmv.com','Arjun','Cater','$2a$10$hash','900002001',NULL,'VENDOR'),(_binary '','2026-01-21 16:13:53.000000','2026-01-21 16:13:53.000000',29,'cater_mys_2@bmv.com','Vikas','Cater','$2a$10$hash','900002002',NULL,'VENDOR'),(_binary '','2026-01-21 16:13:53.000000','2026-01-21 16:13:53.000000',30,'cater_mys_3@bmv.com','Sanjay','Cater','$2a$10$hash','900002003',NULL,'VENDOR'),(_binary '','2026-01-21 16:13:53.000000','2026-01-21 16:13:53.000000',31,'cater_mys_4@bmv.com','Ajay','Cater','$2a$10$hash','900002004',NULL,'VENDOR'),(_binary '','2026-01-21 16:13:53.000000','2026-01-21 16:13:53.000000',32,'cater_mys_5@bmv.com','Rahul','Cater','$2a$10$hash','900002005',NULL,'VENDOR'),(_binary '','2026-01-21 16:13:53.000000','2026-01-21 16:13:53.000000',33,'cater_mys_6@bmv.com','Nitin','Cater','$2a$10$hash','900002006',NULL,'VENDOR'),(_binary '','2026-01-21 16:13:53.000000','2026-01-21 16:13:53.000000',34,'cater_mys_7@bmv.com','Harish','Cater','$2a$10$hash','900002007',NULL,'VENDOR'),(_binary '','2026-01-21 16:13:53.000000','2026-01-21 16:13:53.000000',35,'cater_mys_8@bmv.com','Manoj','Cater','$2a$10$hash','900002008',NULL,'VENDOR'),(_binary '','2026-01-21 16:13:53.000000','2026-01-21 16:13:53.000000',36,'cater_mys_9@bmv.com','Lokesh','Cater','$2a$10$hash','900002009',NULL,'VENDOR'),(_binary '','2026-01-21 16:13:53.000000','2026-01-21 16:13:53.000000',37,'cater_mys_10@bmv.com','Shiv','Cater','$2a$10$hash','900002010',NULL,'VENDOR'),(_binary '','2026-01-21 16:41:39.000000','2026-01-21 16:41:39.000000',38,'venue_mlr_1@bmv.com','Ramesh','Venue','$2a$10$hash','901001001',NULL,'VENDOR'),(_binary '','2026-01-21 16:41:39.000000','2026-01-21 16:41:39.000000',39,'venue_mlr_2@bmv.com','Sanjay','Venue','$2a$10$hash','901001002',NULL,'VENDOR'),(_binary '','2026-01-21 16:41:39.000000','2026-01-21 16:41:39.000000',40,'venue_mlr_3@bmv.com','Karthik','Venue','$2a$10$hash','901001003',NULL,'VENDOR'),(_binary '','2026-01-21 16:41:39.000000','2026-01-21 16:41:39.000000',41,'venue_mlr_4@bmv.com','Manoj','Venue','$2a$10$hash','901001004',NULL,'VENDOR'),(_binary '','2026-01-21 16:41:39.000000','2026-01-21 16:41:39.000000',42,'venue_mlr_5@bmv.com','Vinay','Venue','$2a$10$hash','901001005',NULL,'VENDOR'),(_binary '','2026-01-21 16:41:39.000000','2026-01-21 16:41:39.000000',43,'venue_mlr_6@bmv.com','Ashok','Venue','$2a$10$hash','901001006',NULL,'VENDOR'),(_binary '','2026-01-21 16:41:39.000000','2026-01-21 16:41:39.000000',44,'venue_mlr_7@bmv.com','Pradeep','Venue','$2a$10$hash','901001007',NULL,'VENDOR'),(_binary '','2026-01-21 16:41:39.000000','2026-01-21 16:41:39.000000',45,'venue_mlr_8@bmv.com','Rohit','Venue','$2a$10$hash','901001008',NULL,'VENDOR'),(_binary '','2026-01-21 16:41:39.000000','2026-01-21 16:41:39.000000',46,'venue_mlr_9@bmv.com','Deepak','Venue','$2a$10$hash','901001009',NULL,'VENDOR'),(_binary '','2026-01-21 16:41:39.000000','2026-01-21 16:41:39.000000',47,'venue_mlr_10@bmv.com','Anil','Venue','$2a$10$hash','901001010',NULL,'VENDOR'),(_binary '','2026-01-21 16:41:39.000000','2026-01-21 16:41:39.000000',48,'venue_mys_1@bmv.com','Arjun','Venue','$2a$10$hash','901002001',NULL,'VENDOR'),(_binary '','2026-01-21 16:41:39.000000','2026-01-21 16:41:39.000000',49,'venue_mys_2@bmv.com','Vikas','Venue','$2a$10$hash','901002002',NULL,'VENDOR'),(_binary '','2026-01-21 16:41:39.000000','2026-01-21 16:41:39.000000',50,'venue_mys_3@bmv.com','Harish','Venue','$2a$10$hash','901002003',NULL,'VENDOR'),(_binary '','2026-01-21 16:41:39.000000','2026-01-21 16:41:39.000000',51,'venue_mys_4@bmv.com','Suresh','Venue','$2a$10$hash','901002004',NULL,'VENDOR'),(_binary '','2026-01-21 16:41:39.000000','2026-01-21 16:41:39.000000',52,'venue_mys_5@bmv.com','Nitin','Venue','$2a$10$hash','901002005',NULL,'VENDOR'),(_binary '','2026-01-21 16:41:39.000000','2026-01-21 16:41:39.000000',53,'venue_mys_6@bmv.com','Mahesh','Venue','$2a$10$hash','901002006',NULL,'VENDOR'),(_binary '','2026-01-21 16:41:39.000000','2026-01-21 16:41:39.000000',54,'venue_mys_7@bmv.com','Raghav','Venue','$2a$10$hash','901002007',NULL,'VENDOR'),(_binary '','2026-01-21 16:41:39.000000','2026-01-21 16:41:39.000000',55,'venue_mys_8@bmv.com','Lokesh','Venue','$2a$10$hash','901002008',NULL,'VENDOR'),(_binary '','2026-01-21 16:41:39.000000','2026-01-21 16:41:39.000000',56,'venue_mys_9@bmv.com','Kiran','Venue','$2a$10$hash','901002009',NULL,'VENDOR'),(_binary '','2026-01-21 16:41:39.000000','2026-01-21 16:41:39.000000',57,'venue_mys_10@bmv.com','Shiv','Venue','$2a$10$hash','901002010',NULL,'VENDOR'),(_binary '','2026-01-21 16:48:35.000000','2026-01-21 16:48:35.000000',58,'photo_mlr_1@bmv.com','Rakesh','Photo','$2a$10$hash','902001001',NULL,'VENDOR'),(_binary '','2026-01-21 16:48:35.000000','2026-01-21 16:48:35.000000',59,'photo_mlr_2@bmv.com','Sunil','Photo','$2a$10$hash','902001002',NULL,'VENDOR'),(_binary '','2026-01-21 16:48:35.000000','2026-01-21 16:48:35.000000',60,'photo_mlr_3@bmv.com','Anand','Photo','$2a$10$hash','902001003',NULL,'VENDOR'),(_binary '','2026-01-21 16:48:35.000000','2026-01-21 16:48:35.000000',61,'photo_mlr_4@bmv.com','Vijay','Photo','$2a$10$hash','902001004',NULL,'VENDOR'),(_binary '','2026-01-21 16:48:35.000000','2026-01-21 16:48:35.000000',62,'photo_mlr_5@bmv.com','Karthik','Photo','$2a$10$hash','902001005',NULL,'VENDOR'),(_binary '','2026-01-21 16:48:35.000000','2026-01-21 16:48:35.000000',63,'photo_mlr_6@bmv.com','Deepak','Photo','$2a$10$hash','902001006',NULL,'VENDOR'),(_binary '','2026-01-21 16:48:35.000000','2026-01-21 16:48:35.000000',64,'photo_mlr_7@bmv.com','Mahesh','Photo','$2a$10$hash','902001007',NULL,'VENDOR'),(_binary '','2026-01-21 16:48:35.000000','2026-01-21 16:48:35.000000',65,'photo_mlr_8@bmv.com','Rohit','Photo','$2a$10$hash','902001008',NULL,'VENDOR'),(_binary '','2026-01-21 16:48:35.000000','2026-01-21 16:48:35.000000',66,'photo_mlr_9@bmv.com','Sandeep','Photo','$2a$10$hash','902001009',NULL,'VENDOR'),(_binary '','2026-01-21 16:48:35.000000','2026-01-21 16:48:35.000000',67,'photo_mlr_10@bmv.com','Naveen','Photo','$2a$10$hash','902001010',NULL,'VENDOR'),(_binary '','2026-01-21 16:48:35.000000','2026-01-21 16:48:35.000000',68,'photo_mys_1@bmv.com','Arvind','Photo','$2a$10$hash','902002001',NULL,'VENDOR'),(_binary '','2026-01-21 16:48:35.000000','2026-01-21 16:48:35.000000',69,'photo_mys_2@bmv.com','Prakash','Photo','$2a$10$hash','902002002',NULL,'VENDOR'),(_binary '','2026-01-21 16:48:35.000000','2026-01-21 16:48:35.000000',70,'photo_mys_3@bmv.com','Suresh','Photo','$2a$10$hash','902002003',NULL,'VENDOR'),(_binary '','2026-01-21 16:48:35.000000','2026-01-21 16:48:35.000000',71,'photo_mys_4@bmv.com','Manoj','Photo','$2a$10$hash','902002004',NULL,'VENDOR'),(_binary '','2026-01-21 16:48:35.000000','2026-01-21 16:48:35.000000',72,'photo_mys_5@bmv.com','Ravi','Photo','$2a$10$hash','902002005',NULL,'VENDOR'),(_binary '','2026-01-21 16:48:35.000000','2026-01-21 16:48:35.000000',73,'photo_mys_6@bmv.com','Lokesh','Photo','$2a$10$hash','902002006',NULL,'VENDOR'),(_binary '','2026-01-21 16:48:35.000000','2026-01-21 16:48:35.000000',74,'photo_mys_7@bmv.com','Kiran','Photo','$2a$10$hash','902002007',NULL,'VENDOR'),(_binary '','2026-01-21 16:48:35.000000','2026-01-21 16:48:35.000000',75,'photo_mys_8@bmv.com','Harish','Photo','$2a$10$hash','902002008',NULL,'VENDOR'),(_binary '','2026-01-21 16:48:35.000000','2026-01-21 16:48:35.000000',76,'photo_mys_9@bmv.com','Nitin','Photo','$2a$10$hash','902002009',NULL,'VENDOR'),(_binary '','2026-01-21 16:48:35.000000','2026-01-21 16:48:35.000000',77,'photo_mys_10@bmv.com','Shiv','Photo','$2a$10$hash','902002010',NULL,'VENDOR');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_availability`
--

DROP TABLE IF EXISTS `vendor_availability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_availability` (
  `day_of_week` int NOT NULL,
  `end_time` time(6) NOT NULL,
  `is_available` bit(1) NOT NULL,
  `start_time` time(6) NOT NULL,
  `availability_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `vendor_id` bigint NOT NULL,
  PRIMARY KEY (`availability_id`),
  KEY `FKehmgbfif86j5v2f6s1qd4kril` (`vendor_id`),
  CONSTRAINT `FKehmgbfif86j5v2f6s1qd4kril` FOREIGN KEY (`vendor_id`) REFERENCES `vendor_profiles` (`vendor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_availability`
--

LOCK TABLES `vendor_availability` WRITE;
/*!40000 ALTER TABLE `vendor_availability` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_availability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_profiles`
--

DROP TABLE IF EXISTS `vendor_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_profiles` (
  `is_approved` bit(1) NOT NULL,
  `is_featured` bit(1) NOT NULL,
  `rating` decimal(3,2) DEFAULT NULL,
  `total_reviews` int DEFAULT NULL,
  `years_of_experience` int DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `vendor_id` bigint NOT NULL AUTO_INCREMENT,
  `business_address` text,
  `business_description` text,
  `business_email` varchar(255) DEFAULT NULL,
  `business_logo_url` text,
  `business_name` varchar(255) NOT NULL,
  `business_phone` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `total_revenue` int DEFAULT NULL,
  PRIMARY KEY (`vendor_id`),
  KEY `FKbdoc22aas6cny51wfhae92xit` (`user_id`),
  CONSTRAINT `FKbdoc22aas6cny51wfhae92xit` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_profiles`
--

LOCK TABLES `vendor_profiles` WRITE;
/*!40000 ALTER TABLE `vendor_profiles` DISABLE KEYS */;
INSERT INTO `vendor_profiles` VALUES (_binary '',_binary '',4.70,124,8,'2025-11-10 16:18:21.000000','2025-11-10 16:18:21.000000',1,9,'Kankanady, Mangalore','Authentic Mangalorean catering with seafood specialties and vegetarian options for all occasions.','contact@coastalfeast.in','https://example.com/images/catering1.jpg','Coastal Feast Caterers','9481012345','Mangalore','India','575002','Karnataka',0),(_binary '',_binary '',4.50,87,5,'2025-11-10 16:18:21.000000','2025-11-10 16:18:21.000000',2,10,'Bejai, Mangalore','Stage and venue decorators specializing in floral, LED, and traditional themes.','info@blossomevents.in','https://example.com/images/decoration1.jpg','Blossom Event Decorators','9845023456','Mangalore','India','575004','Karnataka',0),(_binary '',_binary '',4.33,220,10,'2025-11-10 16:18:21.000000','2026-01-16 16:22:42.943865',3,11,'Kadri, Mangalore','Fully air-conditioned banquet hall with 1000+ capacity and ample parking. Ideal for weddings and conferences.','book@sapphirehall.in','https://firebasestorage.googleapis.com/v0/b/bookmyvendor-4176c.firebasestorage.app/o/businessimg%2Fvendor%2011%2Flogo.png?alt=media&token=374d35cc-48fd-43fe-a83d-257e904cc515','Sapphire Convention Hall','08242222369','Mangalore','India','575003','Karnataka',0),(_binary '',_binary '',4.60,154,6,'2025-11-10 16:18:21.000000','2025-11-10 16:18:21.000000',4,12,'Balmatta, Mangalore','Wedding and event photography & videography with drone coverage and instant prints.','hello@lenscraft.in','https://example.com/images/photography1.jpg','LensCraft Studios','9632025678','Mangalore','India','575001','Karnataka',0),(_binary '',_binary '',4.40,63,12,'2025-11-10 16:18:21.000000','2025-11-10 16:18:21.000000',5,13,'Pumpwell, Mangalore','Premium car rentals, luxury buses, and event guest transport solutions within Mangalore and Udupi.','support@royalride.in','https://example.com/images/transport1.jpg','Royal Ride Travels','9008090080','Mangalore','India','575007','Karnataka',0),(_binary '',_binary '',4.50,95,7,'2025-11-10 16:18:21.000000','2025-11-10 16:18:21.000000',6,14,'Urwa, Mangalore','Professional DJ and live sound system setup for weddings, parties, and corporate events.','bookings@beatwave.in','https://example.com/images/dj1.jpg','BeatWave DJs','9845011122','Mangalore','India','575006','Karnataka',0),(_binary '',_binary '',4.90,180,9,'2025-11-10 16:18:21.000000','2025-11-10 16:18:21.000000',7,15,'Lalbagh, Mangalore','Certified bridal makeup artists providing hair styling, saree draping, and trial sessions.','glamupstudio@gmail.com','https://example.com/images/makeup1.jpg','GlamUp Bridal Studio','9886098877','Mangalore','India','575003','Karnataka',0),(_binary '',_binary '',4.30,71,11,'2025-11-10 16:18:21.000000','2025-11-10 16:18:21.000000',8,16,'Padil, Mangalore','Professional event security personnel and crowd management trained for large gatherings.','admin@safeguard.in','https://example.com/images/security1.jpg','SafeGuard Security Services','9740012345','Mangalore','India','575007','Karnataka',0),(_binary '\0',_binary '\0',0.00,0,2,NULL,NULL,12,17,'24, 3rd Block','Food','','','Krishna Dhama','','Mangalore','India','570022','Karnataka',0),(_binary '\0',_binary '\0',0.00,0,2,NULL,NULL,13,18,'rthrh','','','','rhetyj','7877775','Mysuru','India','570022','Karnataka',0),(_binary '\0',_binary '\0',0.24,21,2,NULL,'2026-01-15 14:01:29.033572',15,22,'xxxx','Best in the Loc','pa@g.com','','Sara','1234','Mangalore','India','570022','Karnataka',60000),(_binary '',_binary '\0',4.60,120,8,'2026-01-21 16:20:25.000000','2026-01-21 16:20:25.000000',18,33,NULL,'Wedding & event catering','cater_mlr_1@bmv.com',NULL,'Spice Coast Caterers','900001001','Mangalore','India','575001','Karnataka',1200000),(_binary '',_binary '\0',4.30,95,6,'2026-01-21 16:20:25.000000','2026-01-21 16:20:25.000000',19,34,NULL,'Multi-cuisine catering','cater_mlr_2@bmv.com',NULL,'Royal Feast','900001002','Mangalore','India','575002','Karnataka',980000),(_binary '',_binary '',4.80,180,12,'2026-01-21 16:20:25.000000','2026-01-21 16:20:25.000000',20,35,NULL,'Luxury wedding catering','cater_mlr_3@bmv.com',NULL,'Elite Caterers','900001003','Mangalore','India','575003','Karnataka',2200000),(_binary '',_binary '\0',4.10,60,4,'2026-01-21 16:20:25.000000','2026-01-21 16:20:25.000000',21,36,NULL,'Traditional meals','cater_mlr_4@bmv.com',NULL,'Home Taste Caterers','900001004','Mangalore','India','575004','Karnataka',650000),(_binary '',_binary '\0',4.50,110,7,'2026-01-21 16:20:25.000000','2026-01-21 16:20:25.000000',22,37,NULL,'Seafood specialists','cater_mlr_5@bmv.com',NULL,'Ocean Pearl Caterers','900001005','Mangalore','India','575005','Karnataka',1050000),(_binary '',_binary '\0',4.20,70,5,'2026-01-21 16:20:25.000000','2026-01-21 16:20:25.000000',23,38,NULL,'South Indian cuisine','cater_mlr_6@bmv.com',NULL,'Dakshin Caterers','900001006','Mangalore','India','575006','Karnataka',720000),(_binary '',_binary '\0',4.40,90,6,'2026-01-21 16:20:25.000000','2026-01-21 16:20:25.000000',24,39,NULL,'Pure veg catering','cater_mlr_7@bmv.com',NULL,'Udupi Delights','900001007','Mangalore','India','575007','Karnataka',880000),(_binary '',_binary '\0',4.00,55,4,'2026-01-21 16:20:25.000000','2026-01-21 16:20:25.000000',25,40,NULL,'Coastal style menus','cater_mlr_8@bmv.com',NULL,'Coastal Treats','900001008','Mangalore','India','575008','Karnataka',610000),(_binary '',_binary '\0',4.70,150,9,'2026-01-21 16:20:25.000000','2026-01-21 16:20:25.000000',26,41,NULL,'Large event catering','cater_mlr_9@bmv.com',NULL,'Grand Buffet','900001009','Mangalore','India','575009','Karnataka',1750000),(_binary '',_binary '\0',4.30,85,6,'2026-01-21 16:20:25.000000','2026-01-21 16:20:25.000000',27,42,NULL,'Corporate & weddings','cater_mlr_10@bmv.com',NULL,'Classic Caterers','900001010','Mangalore','India','575010','Karnataka',940000),(_binary '',_binary '\0',4.70,140,9,'2026-01-21 16:20:25.000000','2026-01-21 16:20:25.000000',28,43,NULL,'Royal style catering','cater_mys_1@bmv.com',NULL,'Mysore Palace Caterers','900002001','Mysore','India','570001','Karnataka',1600000),(_binary '',_binary '\0',4.40,100,6,'2026-01-21 16:20:25.000000','2026-01-21 16:20:25.000000',29,44,NULL,'Authentic Karnataka cuisine','cater_mys_2@bmv.com',NULL,'Heritage Feast','900002002','Mysore','India','570002','Karnataka',1150000),(_binary '',_binary '',4.90,210,15,'2026-01-21 16:20:25.000000','2026-01-21 16:20:25.000000',30,45,NULL,'Premium wedding catering','cater_mys_3@bmv.com',NULL,'Golden Spoon','900002003','Mysore','India','570003','Karnataka',2600000),(_binary '',_binary '\0',4.20,80,5,'2026-01-21 16:20:25.000000','2026-01-21 16:20:25.000000',31,46,NULL,'Home-style catering','cater_mys_4@bmv.com',NULL,'Family Kitchen','900002004','Mysore','India','570004','Karnataka',720000),(_binary '',_binary '\0',4.50,130,8,'2026-01-21 16:20:25.000000','2026-01-21 16:20:25.000000',32,47,NULL,'Events & functions','cater_mys_5@bmv.com',NULL,'Classic Caterers Mysore','900002005','Mysore','India','570005','Karnataka',1450000),(_binary '',_binary '\0',4.30,90,6,'2026-01-21 16:20:25.000000','2026-01-21 16:20:25.000000',33,48,NULL,'Pure veg specialists','cater_mys_6@bmv.com',NULL,'Royal Veg','900002006','Mysore','India','570006','Karnataka',880000),(_binary '',_binary '\0',4.60,160,10,'2026-01-21 16:20:25.000000','2026-01-21 16:20:25.000000',34,49,NULL,'Luxury buffet service','cater_mys_7@bmv.com',NULL,'Star Caterers','900002007','Mysore','India','570007','Karnataka',1900000),(_binary '',_binary '\0',4.10,70,5,'2026-01-21 16:20:25.000000','2026-01-21 16:20:25.000000',35,50,NULL,'Traditional meals','cater_mys_8@bmv.com',NULL,'Annapoorna Caterers','900002008','Mysore','India','570008','Karnataka',690000),(_binary '',_binary '\0',4.80,185,11,'2026-01-21 16:20:25.000000','2026-01-21 16:20:25.000000',36,51,NULL,'Wedding & reception','cater_mys_9@bmv.com',NULL,'Celebration Foods','900002009','Mysore','India','570009','Karnataka',2300000),(_binary '',_binary '\0',4.40,105,7,'2026-01-21 16:20:25.000000','2026-01-21 16:20:25.000000',37,52,NULL,'Modern catering','cater_mys_10@bmv.com',NULL,'Elite Bites','900002010','Mysore','India','570010','Karnataka',1250000),(_binary '',_binary '\0',4.60,120,10,'2026-01-21 16:41:58.000000','2026-01-21 16:41:58.000000',38,53,NULL,NULL,'contact@grandroyal.com','https://images.unsplash.com/photo-1506157786151-b8491531f063','Grand Royal Hall','901001001','Mangalore','India',NULL,'Karnataka',3200000),(_binary '',_binary '\0',4.50,98,8,'2026-01-21 16:41:58.000000','2026-01-21 16:41:58.000000',39,54,NULL,NULL,'contact@seaview.com','https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba','Sea View Convention','901001002','Mangalore','India',NULL,'Karnataka',2900000),(_binary '',_binary '\0',4.40,85,7,'2026-01-21 16:41:58.000000','2026-01-21 16:41:58.000000',40,55,NULL,NULL,'contact@citypride.com','https://images.unsplash.com/photo-1504805572947-34fad45aed93','City Pride Banquet','901001003','Mangalore','India',NULL,'Karnataka',2500000),(_binary '',_binary '\0',4.70,150,12,'2026-01-21 16:41:58.000000','2026-01-21 16:41:58.000000',41,56,NULL,NULL,'contact@goldenpalace.com','https://images.unsplash.com/photo-1560185127-6a8c1b2c7a2d','Golden Palace Lawns','901001004','Mangalore','India',NULL,'Karnataka',4500000),(_binary '',_binary '\0',4.30,70,6,'2026-01-21 16:41:58.000000','2026-01-21 16:41:58.000000',42,57,NULL,NULL,'contact@oceanpearl.com','https://images.unsplash.com/photo-1551887373-6b2c1a3a4e52','Ocean Pearl Hall','901001005','Mangalore','India',NULL,'Karnataka',2100000),(_binary '',_binary '\0',4.20,60,5,'2026-01-21 16:41:58.000000','2026-01-21 16:41:58.000000',43,58,NULL,NULL,'contact@palmgrove.com','https://images.unsplash.com/photo-1600585154340-be6161a56a0c','Palm Grove Venue','901001006','Mangalore','India',NULL,'Karnataka',1800000),(_binary '',_binary '\0',4.60,110,9,'2026-01-21 16:41:58.000000','2026-01-21 16:41:58.000000',44,59,NULL,NULL,'contact@coastalgrand.com','https://images.unsplash.com/photo-1600585154340-be6161a56a0c','Coastal Grand','901001007','Mangalore','India',NULL,'Karnataka',3800000),(_binary '',_binary '\0',4.40,95,8,'2026-01-21 16:41:58.000000','2026-01-21 16:41:58.000000',45,60,NULL,NULL,'contact@harborview.com','https://images.unsplash.com/photo-1512917774080-9991f1c4c750','Harbor View Hall','901001008','Mangalore','India',NULL,'Karnataka',2700000),(_binary '',_binary '\0',4.10,55,4,'2026-01-21 16:41:58.000000','2026-01-21 16:41:58.000000',46,61,NULL,NULL,'contact@gardenia.com','https://images.unsplash.com/photo-1582719478250-c89cae4dc85b','Gardenia Venue','901001009','Mangalore','India',NULL,'Karnataka',1500000),(_binary '',_binary '\0',4.50,100,9,'2026-01-21 16:41:58.000000','2026-01-21 16:41:58.000000',47,62,NULL,NULL,'contact@elite.com','https://images.unsplash.com/photo-1493809842364-78817add7ffb','Elite Banquets','901001010','Mangalore','India',NULL,'Karnataka',3000000),(_binary '',_binary '\0',4.60,130,11,'2026-01-21 16:41:58.000000','2026-01-21 16:41:58.000000',48,63,NULL,NULL,'contact@royalmysore.com',NULL,'Royal Mysore Hall','901002001','Mysore','India',NULL,'Karnataka',3400000),(_binary '',_binary '\0',4.40,90,7,'2026-01-21 16:41:58.000000','2026-01-21 16:41:58.000000',49,64,NULL,NULL,'contact@heritage.com',NULL,'Heritage Convention','901002002','Mysore','India',NULL,'Karnataka',2600000),(_binary '',_binary '\0',4.30,75,6,'2026-01-21 16:41:58.000000','2026-01-21 16:41:58.000000',50,65,NULL,NULL,'contact@greenleaf.com',NULL,'Green Leaf Banquet','901002003','Mysore','India',NULL,'Karnataka',2200000),(_binary '',_binary '\0',4.70,160,13,'2026-01-21 16:41:58.000000','2026-01-21 16:41:58.000000',51,66,NULL,NULL,'contact@chamundi.com',NULL,'Chamundi Lawns','901002004','Mysore','India',NULL,'Karnataka',4800000),(_binary '',_binary '\0',4.20,65,5,'2026-01-21 16:41:58.000000','2026-01-21 16:41:58.000000',52,67,NULL,NULL,'contact@urbannest.com',NULL,'Urban Nest','901002005','Mysore','India',NULL,'Karnataka',1700000),(_binary '',_binary '\0',4.10,58,4,'2026-01-21 16:41:58.000000','2026-01-21 16:41:58.000000',53,68,NULL,NULL,'contact@silveroak.com',NULL,'Silver Oak Hall','901002006','Mysore','India',NULL,'Karnataka',1600000),(_binary '',_binary '\0',4.50,105,9,'2026-01-21 16:41:58.000000','2026-01-21 16:41:58.000000',54,69,NULL,NULL,'contact@imperial.com',NULL,'Imperial Convention','901002007','Mysore','India',NULL,'Karnataka',3900000),(_binary '',_binary '\0',4.40,88,7,'2026-01-21 16:41:58.000000','2026-01-21 16:41:58.000000',55,70,NULL,NULL,'contact@gardeniaopen.com',NULL,'Gardenia Open Venue','901002008','Mysore','India',NULL,'Karnataka',2300000),(_binary '',_binary '\0',4.30,72,6,'2026-01-21 16:41:58.000000','2026-01-21 16:41:58.000000',56,71,NULL,NULL,'contact@elitemysore.com',NULL,'Elite Mysore Hall','901002009','Mysore','India',NULL,'Karnataka',2500000),(_binary '',_binary '\0',4.60,140,12,'2026-01-21 16:41:58.000000','2026-01-21 16:41:58.000000',57,72,NULL,NULL,'contact@mysoregrand.com',NULL,'Mysore Grand','901002010','Mysore','India',NULL,'Karnataka',4200000),(_binary '',_binary '\0',4.80,220,12,'2026-01-21 16:48:51.000000','2026-01-21 16:48:51.000000',58,93,NULL,NULL,'pixel@photo.com',NULL,'Pixel Perfect Studio','902001001','Mangalore','India',NULL,'Karnataka',1800000),(_binary '',_binary '\0',4.60,180,10,'2026-01-21 16:48:51.000000','2026-01-21 16:48:51.000000',59,94,NULL,NULL,'moments@photo.com',NULL,'Moments Capture','902001002','Mangalore','India',NULL,'Karnataka',1500000),(_binary '',_binary '\0',4.50,160,9,'2026-01-21 16:48:51.000000','2026-01-21 16:48:51.000000',60,95,NULL,NULL,'frameit@photo.com',NULL,'Frame It Right','902001003','Mangalore','India',NULL,'Karnataka',1300000),(_binary '',_binary '\0',4.70,200,11,'2026-01-21 16:48:51.000000','2026-01-21 16:48:51.000000',61,96,NULL,NULL,'wedding@clicks.com',NULL,'Wedding Clicks','902001004','Mangalore','India',NULL,'Karnataka',1900000),(_binary '',_binary '\0',4.40,140,8,'2026-01-21 16:48:51.000000','2026-01-21 16:48:51.000000',62,97,NULL,NULL,'lens@craft.com',NULL,'Lens Craft','902001005','Mangalore','India',NULL,'Karnataka',1100000),(_binary '',_binary '\0',4.30,120,7,'2026-01-21 16:48:51.000000','2026-01-21 16:48:51.000000',63,98,NULL,NULL,'flash@point.com',NULL,'Flash Point','902001006','Mangalore','India',NULL,'Karnataka',1000000),(_binary '',_binary '\0',4.60,175,9,'2026-01-21 16:48:51.000000','2026-01-21 16:48:51.000000',64,99,NULL,NULL,'life@photo.com',NULL,'Capture Life','902001007','Mangalore','India',NULL,'Karnataka',1450000),(_binary '',_binary '\0',4.50,155,8,'2026-01-21 16:48:51.000000','2026-01-21 16:48:51.000000',65,100,NULL,NULL,'focus@studio.com',NULL,'Focus Studio','902001008','Mangalore','India',NULL,'Karnataka',1250000),(_binary '',_binary '\0',4.20,95,6,'2026-01-21 16:48:51.000000','2026-01-21 16:48:51.000000',66,101,NULL,NULL,'dreams@photo.com',NULL,'Photo Dreams','902001009','Mangalore','India',NULL,'Karnataka',850000),(_binary '',_binary '\0',4.70,210,11,'2026-01-21 16:48:51.000000','2026-01-21 16:48:51.000000',67,102,NULL,NULL,'elite@frames.com',NULL,'Elite Frames','902001010','Mangalore','India',NULL,'Karnataka',1700000),(_binary '',_binary '\0',4.80,230,13,'2026-01-21 16:48:51.000000','2026-01-21 16:48:51.000000',68,103,NULL,NULL,'royal@shots.com',NULL,'Royal Shots','902002001','Mysore','India',NULL,'Karnataka',2000000),(_binary '',_binary '\0',4.60,170,9,'2026-01-21 16:48:51.000000','2026-01-21 16:48:51.000000',69,104,NULL,NULL,'classic@clicks.com',NULL,'Classic Clicks','902002002','Mysore','India',NULL,'Karnataka',1400000),(_binary '',_binary '\0',4.40,145,8,'2026-01-21 16:48:51.000000','2026-01-21 16:48:51.000000',70,105,NULL,NULL,'golden@moments.com',NULL,'Golden Moments','902002003','Mysore','India',NULL,'Karnataka',1200000),(_binary '',_binary '\0',4.70,215,12,'2026-01-21 16:48:51.000000','2026-01-21 16:48:51.000000',71,106,NULL,NULL,'epic@frames.com',NULL,'Epic Frames','902002004','Mysore','India',NULL,'Karnataka',1850000),(_binary '',_binary '\0',4.30,110,7,'2026-01-21 16:48:51.000000','2026-01-21 16:48:51.000000',72,107,NULL,NULL,'light@lens.com',NULL,'Light & Lens','902002005','Mysore','India',NULL,'Karnataka',900000),(_binary '',_binary '\0',4.20,98,6,'2026-01-21 16:48:51.000000','2026-01-21 16:48:51.000000',73,108,NULL,NULL,'snap@studio.com',NULL,'Snap Studio','902002006','Mysore','India',NULL,'Karnataka',800000),(_binary '',_binary '\0',4.50,165,9,'2026-01-21 16:48:51.000000','2026-01-21 16:48:51.000000',74,109,NULL,NULL,'true@colors.com',NULL,'True Colors','902002007','Mysore','India',NULL,'Karnataka',1350000),(_binary '',_binary '\0',4.40,150,8,'2026-01-21 16:48:51.000000','2026-01-21 16:48:51.000000',75,110,NULL,NULL,'urban@clicks.com',NULL,'Urban Clicks','902002008','Mysore','India',NULL,'Karnataka',1250000),(_binary '',_binary '\0',4.30,130,7,'2026-01-21 16:48:51.000000','2026-01-21 16:48:51.000000',76,111,NULL,NULL,'story@tellers.com',NULL,'Story Tellers','902002009','Mysore','India',NULL,'Karnataka',1100000),(_binary '',_binary '\0',4.70,205,11,'2026-01-21 16:48:51.000000','2026-01-21 16:48:51.000000',77,112,NULL,NULL,'prime@lens.com',NULL,'Prime Lens','902002010','Mysore','India',NULL,'Karnataka',1750000);
/*!40000 ALTER TABLE `vendor_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_service_addons`
--

DROP TABLE IF EXISTS `vendor_service_addons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_service_addons` (
  `is_available` bit(1) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `addon_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `vendor_service_id` bigint NOT NULL,
  `description` text,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`addon_id`),
  KEY `FK6imob0350qk79bbsxfganjk6g` (`vendor_service_id`),
  CONSTRAINT `FK6imob0350qk79bbsxfganjk6g` FOREIGN KEY (`vendor_service_id`) REFERENCES `vendor_services` (`vendor_service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_service_addons`
--

LOCK TABLES `vendor_service_addons` WRITE;
/*!40000 ALTER TABLE `vendor_service_addons` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_service_addons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_service_requests`
--

DROP TABLE IF EXISTS `vendor_service_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_service_requests` (
  `proposed_amount` decimal(10,2) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `request_id` bigint NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `vendor_id` bigint NOT NULL,
  `vendor_request_id` bigint NOT NULL AUTO_INCREMENT,
  `message` text,
  `status` enum('ACCEPTED','PENDING','REJECTED','WITHDRAWN') NOT NULL,
  PRIMARY KEY (`vendor_request_id`),
  KEY `FKc19cnim3midga2ft015ci5oi0` (`request_id`),
  KEY `FKidfnc85iftqysw9igrjxcl3g9` (`vendor_id`),
  CONSTRAINT `FKc19cnim3midga2ft015ci5oi0` FOREIGN KEY (`request_id`) REFERENCES `service_requests` (`request_id`),
  CONSTRAINT `FKidfnc85iftqysw9igrjxcl3g9` FOREIGN KEY (`vendor_id`) REFERENCES `vendor_profiles` (`vendor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_service_requests`
--

LOCK TABLES `vendor_service_requests` WRITE;
/*!40000 ALTER TABLE `vendor_service_requests` DISABLE KEYS */;
INSERT INTO `vendor_service_requests` VALUES (200000.00,'2025-11-16 17:12:12.176655',1,'2025-11-16 17:12:12.176655',9,1,'Service request for Catering','PENDING'),(65000.00,'2025-11-16 17:12:12.212745',2,'2026-01-14 03:45:49.242930',11,2,'Service request for Venue','ACCEPTED'),(35000.00,'2025-11-16 17:12:12.244660',3,'2025-11-16 17:12:12.244660',12,3,'Service request for Photography','PENDING'),(60000.00,'2025-11-16 18:10:07.587410',4,'2026-01-14 03:46:00.265890',11,4,'Service request for Venue','ACCEPTED'),(85000.00,'2026-01-14 04:26:54.286677',5,'2026-01-14 05:08:08.423534',11,5,'Service request for Venue','ACCEPTED'),(50000.00,'2026-01-14 04:27:48.238211',6,'2026-01-14 04:30:08.679944',11,6,'Service request for Venue','REJECTED'),(70000.00,'2026-01-14 06:15:04.696121',7,'2026-01-14 06:15:20.263140',11,7,'Service request for Venue','ACCEPTED'),(70000.00,'2026-01-14 06:16:50.650337',8,'2026-01-14 06:18:35.671820',11,8,'Service request for Venue','ACCEPTED'),(50000.00,'2026-01-15 14:20:29.131219',6,'2026-01-15 14:20:29.131219',22,9,'Service request for Venue','PENDING'),(60000.00,'2026-01-15 17:42:18.543567',9,'2026-01-15 17:42:49.634754',22,10,'Service request for Venue','ACCEPTED'),(75000.00,'2026-01-21 10:00:58.692626',10,'2026-01-21 10:00:58.692626',9,11,'Service request for Catering','PENDING'),(150000.00,'2026-01-21 10:00:58.739566',11,'2026-01-21 10:00:58.739566',22,12,'Service request for Venue','PENDING'),(50000.00,'2026-01-21 10:00:58.788147',12,'2026-01-21 10:00:58.788147',12,13,'Service request for Photography','PENDING'),(105000.00,'2026-01-21 10:06:10.899342',13,'2026-01-21 10:06:30.612530',11,14,'Service request for Venue','REJECTED'),(40000.00,'2026-03-30 13:30:02.118208',14,'2026-03-30 13:31:13.386794',11,15,'Service request for Venue','REJECTED'),(80000.00,'2026-03-30 13:35:37.988266',15,'2026-03-30 13:35:37.988932',9,16,'Service request for Catering','PENDING'),(75000.00,'2026-03-30 13:35:38.069476',16,'2026-03-30 13:35:38.070460',53,17,'Service request for Venue','PENDING');
/*!40000 ALTER TABLE `vendor_service_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_services`
--

DROP TABLE IF EXISTS `vendor_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_services` (
  `is_available` bit(1) NOT NULL,
  `max_guests` int DEFAULT NULL,
  `min_guests` int DEFAULT NULL,
  `price_range_end` decimal(10,2) DEFAULT NULL,
  `price_range_start` decimal(10,2) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `service_id` bigint NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `vendor_id` bigint NOT NULL,
  `vendor_service_id` bigint NOT NULL AUTO_INCREMENT,
  `description` text,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`vendor_service_id`),
  KEY `FKhr9rsb4vqc0crffflmuyht1k9` (`service_id`),
  KEY `FKsn95xu9qn5yi3r66u12pj6wp6` (`vendor_id`),
  CONSTRAINT `FKhr9rsb4vqc0crffflmuyht1k9` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`),
  CONSTRAINT `FKsn95xu9qn5yi3r66u12pj6wp6` FOREIGN KEY (`vendor_id`) REFERENCES `vendor_profiles` (`vendor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_services`
--

LOCK TABLES `vendor_services` WRITE;
/*!40000 ALTER TABLE `vendor_services` DISABLE KEYS */;
INSERT INTO `vendor_services` VALUES (_binary '',1000,50,300000.00,50000.00,'2025-11-10 16:25:06.000000',1,'2025-11-10 16:25:06.000000',9,9,'Authentic Mangalorean seafood, vegetarian and continental menus. Full buffet, plated service, and live counters available.','Wedding & Event Catering'),(_binary '',800,50,150000.00,25000.00,'2025-11-10 16:25:06.000000',2,'2025-11-10 16:25:06.000000',10,10,'Premium stage, mandap and venue decoration with floral, drapery and LED lighting themes. Custom-theme design available.','Stage & Floral Decoration'),(_binary '',1200,100,500000.00,75000.00,'2025-11-10 16:25:06.000000',3,'2025-11-10 16:25:06.000000',11,11,'Large air-conditioned banquet and convention hall with seating, basic AV, and in-house staff. Parking available.','Banquet Hall Rental'),(_binary '',800,20,100000.00,20000.00,'2025-11-10 16:25:06.000000',4,'2025-11-10 16:25:06.000000',12,12,'Full-day photography & videography packages, drone coverage, candid shots, and albums. Custom packages on request.','Wedding & Event Photography'),(_binary '',500,10,80000.00,10000.00,'2025-11-10 16:25:06.000000',5,'2025-11-10 16:25:06.000000',13,13,'Premium sedans, tempo travellers and mini buses with professional chauffeurs for guest transfers and logistics.','Luxury Event Transportation'),(_binary '',1000,20,60000.00,15000.00,'2025-11-10 16:25:06.000000',6,'2025-11-10 16:25:06.000000',14,14,'Experienced DJs with sound, lighting and emcee services for weddings, parties, and corporate events.','Event DJ & Sound Setup'),(_binary '',20,1,40000.00,8000.00,'2025-11-10 16:25:06.000000',7,'2025-11-10 16:25:06.000000',15,15,'Bridal makeup, hair styling, saree draping and trial sessions. Team available for large bridal parties.','Bridal & Guest Makeup Packages'),(_binary '',2000,50,50000.00,10000.00,'2025-11-10 16:25:06.000000',8,'2025-11-10 16:25:06.000000',16,16,'Trained security personnel for crowd control, VIP protection, gate management and parking supervision.','Event Security & Crowd Management'),(_binary '',NULL,NULL,0.00,0.00,'2026-01-15 13:59:13.552457',3,'2026-01-15 13:59:13.552457',22,23,'Halls, lawns and banquet venues with capacity options and in-house facilities.','Venue'),(_binary '',1500,50,2500.00,800.00,'2026-01-21 16:24:12.000000',1,'2026-01-21 16:24:12.000000',33,24,'Complete wedding catering solutions','Wedding Catering'),(_binary '',1200,80,2200.00,900.00,'2026-01-21 16:24:12.000000',1,'2026-01-21 16:24:12.000000',34,25,'Multi-cuisine buffet catering','Buffet Catering'),(_binary '',2000,150,3000.00,1000.00,'2026-01-21 16:24:12.000000',1,'2026-01-21 16:24:12.000000',35,26,'Premium catering with live counters','Luxury Catering'),(_binary '',900,60,1800.00,750.00,'2026-01-21 16:24:12.000000',1,'2026-01-21 16:24:12.000000',36,27,'Authentic South Indian meals','Traditional Catering'),(_binary '',1100,100,2300.00,850.00,'2026-01-21 16:24:12.000000',1,'2026-01-21 16:24:12.000000',37,28,'Specialized coastal & seafood menus','Seafood Catering'),(_binary '',1000,70,2000.00,780.00,'2026-01-21 16:24:12.000000',1,'2026-01-21 16:24:12.000000',38,29,'Pure vegetarian catering services','Vegetarian Catering'),(_binary '',1400,90,2100.00,820.00,'2026-01-21 16:24:12.000000',1,'2026-01-21 16:24:12.000000',39,30,'Traditional Udupi-style cuisine','Udupi Style Catering'),(_binary '',800,50,1600.00,700.00,'2026-01-21 16:24:12.000000',1,'2026-01-21 16:24:12.000000',40,31,'Simple home-style food','Home Style Catering'),(_binary '',1800,120,2600.00,900.00,'2026-01-21 16:24:12.000000',1,'2026-01-21 16:24:12.000000',41,32,'Large scale event catering','Grand Event Catering'),(_binary '',1300,80,2400.00,850.00,'2026-01-21 16:24:12.000000',1,'2026-01-21 16:24:12.000000',42,33,'Corporate events & conferences','Corporate Catering'),(_binary '',1700,100,2600.00,900.00,'2026-01-21 16:24:12.000000',1,'2026-01-21 16:24:12.000000',43,34,'Palace-style royal catering','Royal Catering'),(_binary '',1400,90,2100.00,850.00,'2026-01-21 16:24:12.000000',1,'2026-01-21 16:24:12.000000',44,35,'Traditional Karnataka cuisine','Heritage Catering'),(_binary '',2500,200,3500.00,1200.00,'2026-01-21 16:24:12.000000',1,'2026-01-21 16:24:12.000000',45,36,'Elite wedding & reception catering','Premium Catering'),(_binary '',900,60,1900.00,750.00,'2026-01-21 16:24:12.000000',1,'2026-01-21 16:24:12.000000',46,37,'Small functions & family events','Family Catering'),(_binary '',1500,100,2400.00,900.00,'2026-01-21 16:24:12.000000',1,'2026-01-21 16:24:12.000000',47,38,'All event types','Event Catering'),(_binary '',1200,80,2000.00,800.00,'2026-01-21 16:24:12.000000',1,'2026-01-21 16:24:12.000000',48,39,'Exclusive vegetarian menus','Pure Veg Catering'),(_binary '',2000,120,2800.00,950.00,'2026-01-21 16:24:12.000000',1,'2026-01-21 16:24:12.000000',49,40,'High-end buffet catering','Star Catering'),(_binary '',850,50,1800.00,700.00,'2026-01-21 16:24:12.000000',1,'2026-01-21 16:24:12.000000',50,41,'Authentic South Indian meals','Traditional Meals'),(_binary '',2200,150,3200.00,1000.00,'2026-01-21 16:24:12.000000',1,'2026-01-21 16:24:12.000000',51,42,'Wedding & celebration catering','Celebration Catering'),(_binary '',1300,90,2300.00,850.00,'2026-01-21 16:24:12.000000',1,'2026-01-21 16:24:12.000000',52,43,'Contemporary catering menus','Modern Catering'),(_binary '',500,100,250000.00,80000.00,'2026-01-21 16:42:12.000000',3,'2026-01-21 16:42:12.000000',53,44,'Spacious AC banquet hall','Grand Royal Hall'),(_binary '',700,150,300000.00,100000.00,'2026-01-21 16:42:12.000000',3,'2026-01-21 16:42:12.000000',54,45,'Sea-facing premium venue','Sea View Convention'),(_binary '',400,80,180000.00,60000.00,'2026-01-21 16:42:12.000000',3,'2026-01-21 16:42:12.000000',55,46,'Elegant banquet hall','City Pride Banquet'),(_binary '',1000,200,500000.00,150000.00,'2026-01-21 16:42:12.000000',3,'2026-01-21 16:42:12.000000',56,47,'Large open lawn venue','Golden Palace Lawns'),(_binary '',600,120,220000.00,90000.00,'2026-01-21 16:42:12.000000',3,'2026-01-21 16:42:12.000000',57,48,'Luxury indoor venue','Ocean Pearl Hall'),(_binary '',250,50,120000.00,40000.00,'2026-01-21 16:42:12.000000',3,'2026-01-21 16:42:12.000000',58,49,'Garden-style venue','Palm Grove Venue'),(_binary '',1500,300,700000.00,200000.00,'2026-01-21 16:42:12.000000',3,'2026-01-21 16:42:12.000000',59,50,'Large convention center','Coastal Grand Convention'),(_binary '',450,100,200000.00,75000.00,'2026-01-21 16:42:12.000000',3,'2026-01-21 16:42:12.000000',60,51,'Modern hall with parking','Harbor View Hall'),(_binary '',300,60,150000.00,50000.00,'2026-01-21 16:42:12.000000',3,'2026-01-21 16:42:12.000000',61,52,'Open-air venue','Gardenia Venue'),(_binary '',800,180,350000.00,120000.00,'2026-01-21 16:42:12.000000',3,'2026-01-21 16:42:12.000000',62,53,'Premium banquet hall','Elite Banquets'),(_binary '',500,100,230000.00,70000.00,'2026-01-21 16:42:12.000000',3,'2026-01-21 16:42:12.000000',63,54,'Traditional royal venue','Royal Mysore Hall'),(_binary '',700,150,280000.00,95000.00,'2026-01-21 16:42:12.000000',3,'2026-01-21 16:42:12.000000',64,55,'Heritage-style hall','Heritage Convention'),(_binary '',350,80,160000.00,55000.00,'2026-01-21 16:42:12.000000',3,'2026-01-21 16:42:12.000000',65,56,'Eco-friendly venue','Green Leaf Banquet'),(_binary '',1200,250,550000.00,170000.00,'2026-01-21 16:42:12.000000',3,'2026-01-21 16:42:12.000000',66,57,'Scenic outdoor lawns','Chamundi Lawns'),(_binary '',600,120,210000.00,85000.00,'2026-01-21 16:42:12.000000',3,'2026-01-21 16:42:12.000000',67,58,'Compact venue','Urban Nest'),(_binary '',280,60,130000.00,45000.00,'2026-01-21 16:42:12.000000',3,'2026-01-21 16:42:12.000000',68,59,'Modern interiors','Silver Oak Hall'),(_binary '',1400,300,650000.00,190000.00,'2026-01-21 16:42:12.000000',3,'2026-01-21 16:42:12.000000',69,60,'Premium convention hall','Imperial Convention'),(_binary '',400,90,190000.00,70000.00,'2026-01-21 16:42:12.000000',3,'2026-01-21 16:42:12.000000',70,61,'Outdoor day events','Gardenia Open Venue'),(_binary '',320,70,155000.00,52000.00,'2026-01-21 16:42:12.000000',3,'2026-01-21 16:42:12.000000',71,62,'Stylish banquet','Elite Mysore Hall'),(_binary '',900,200,380000.00,130000.00,'2026-01-21 16:42:12.000000',3,'2026-01-21 16:42:12.000000',72,63,'High-end convention','Mysore Grand'),(_binary '',500,50,90000.00,25000.00,'2026-01-21 16:52:23.000000',4,'2026-01-21 16:52:23.000000',93,104,'Candid & traditional photography','Pixel Perfect Wedding'),(_binary '',400,50,75000.00,20000.00,'2026-01-21 16:52:23.000000',4,'2026-01-21 16:52:23.000000',94,105,'Wedding & event coverage','Moments Capture Pro'),(_binary '',350,50,65000.00,18000.00,'2026-01-21 16:52:23.000000',4,'2026-01-21 16:52:23.000000',95,106,'Budget-friendly photography','Frame It Right'),(_binary '',600,80,120000.00,30000.00,'2026-01-21 16:52:23.000000',4,'2026-01-21 16:52:23.000000',96,107,'Luxury wedding shoots','Wedding Clicks Premium'),(_binary '',300,40,55000.00,15000.00,'2026-01-21 16:52:23.000000',4,'2026-01-21 16:52:23.000000',97,108,'Creative photography','Lens Craft Studio'),(_binary '',250,30,45000.00,12000.00,'2026-01-21 16:52:23.000000',4,'2026-01-21 16:52:23.000000',98,109,'Fast delivery photo service','Flash Point Media'),(_binary '',450,60,80000.00,22000.00,'2026-01-21 16:52:23.000000',4,'2026-01-21 16:52:23.000000',99,110,'Candid photography experts','Capture Life Events'),(_binary '',400,50,70000.00,20000.00,'2026-01-21 16:52:23.000000',4,'2026-01-21 16:52:23.000000',100,111,'Professional photo shoots','Focus Studio'),(_binary '',200,30,40000.00,10000.00,'2026-01-21 16:52:23.000000',4,'2026-01-21 16:52:23.000000',101,112,'Small events & parties','Photo Dreams'),(_binary '',500,70,100000.00,28000.00,'2026-01-21 16:52:23.000000',4,'2026-01-21 16:52:23.000000',102,113,'High-end wedding coverage','Elite Frames'),(_binary '',500,50,95000.00,26000.00,'2026-01-21 16:52:23.000000',4,'2026-01-21 16:52:23.000000',103,114,'Royal wedding photography','Royal Shots'),(_binary '',350,40,65000.00,18000.00,'2026-01-21 16:52:23.000000',4,'2026-01-21 16:52:23.000000',104,115,'Classic photography style','Classic Clicks'),(_binary '',400,50,72000.00,20000.00,'2026-01-21 16:52:23.000000',4,'2026-01-21 16:52:23.000000',105,116,'Traditional + candid','Golden Moments'),(_binary '',600,80,130000.00,32000.00,'2026-01-21 16:52:23.000000',4,'2026-01-21 16:52:23.000000',106,117,'Premium cinematic shoots','Epic Frames'),(_binary '',250,30,48000.00,14000.00,'2026-01-21 16:52:23.000000',4,'2026-01-21 16:52:23.000000',107,118,'Minimalist photography','Light & Lens'),(_binary '',200,30,42000.00,12000.00,'2026-01-21 16:52:23.000000',4,'2026-01-21 16:52:23.000000',108,119,'Quick event shoots','Snap Studio'),(_binary '',450,60,85000.00,23000.00,'2026-01-21 16:52:23.000000',4,'2026-01-21 16:52:23.000000',109,120,'Vibrant wedding shots','True Colors'),(_binary '',400,50,75000.00,21000.00,'2026-01-21 16:52:23.000000',4,'2026-01-21 16:52:23.000000',110,121,'Modern photography','Urban Clicks'),(_binary '',300,40,60000.00,17000.00,'2026-01-21 16:52:23.000000',4,'2026-01-21 16:52:23.000000',111,122,'Story-based photography','Story Tellers'),(_binary '',550,70,110000.00,29000.00,'2026-01-21 16:52:23.000000',4,'2026-01-21 16:52:23.000000',112,123,'Premium photography brand','Prime Lens Studio');
/*!40000 ALTER TABLE `vendor_services` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-30 19:20:51
