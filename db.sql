-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: ayur
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` bigint DEFAULT NULL,
  `image` blob,
  `mode` enum('admin','user') DEFAULT 'user',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (1,'admin','admin','abc@gmail.com',9012345678,NULL,'admin'),(6,'arun','arun','abc@gmail.com',9012345678,NULL,'user'),(7,'anjana','anjana','anjana@gmail.com',7281637291,NULL,'user'),(8,'sandra shaji','sandra','sandra@gmail.com',3626718987,NULL,'user'),(43,'geethika','password','geethika@gmail.com',1234567890,NULL,'user'),(44,'geethika','password','geethika@gmail.com',1234567890,NULL,'user'),(45,'geethika','password','geethika@gmail.com',1234567890,NULL,'user'),(46,'geethika','password','geethika@gmail.com',1234567890,NULL,'user'),(47,'geethika','password','geethika@gmail.com',1234567890,NULL,'user'),(48,'geethika','geethika','geethika@gmail.com',1234567890,NULL,'user');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking` (
  `bookingid` int NOT NULL AUTO_INCREMENT,
  `pname` varchar(255) DEFAULT NULL,
  `pimage` blob,
  `userid` int DEFAULT NULL,
  `pid` int DEFAULT NULL,
  PRIMARY KEY (`bookingid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES (1,'Brahmi',_binary 'image/bb.png',8,3),(2,'Brahmi',_binary 'image/bb.png',8,3),(3,'Abhayarist',_binary 'ayur/product-2.png',8,5),(4,'Brahmi',_binary 'image/bb.png',8,3);
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctorbooking`
--

DROP TABLE IF EXISTS `doctorbooking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctorbooking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bdate` date NOT NULL,
  `btime` time NOT NULL,
  `did` int DEFAULT NULL,
  `uid` int DEFAULT NULL,
  `message` text,
  PRIMARY KEY (`id`),
  KEY `did` (`did`),
  KEY `uid` (`uid`),
  CONSTRAINT `doctorBooking_ibfk_1` FOREIGN KEY (`did`) REFERENCES `doctors` (`did`),
  CONSTRAINT `doctorBooking_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `account` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctorbooking`
--

LOCK TABLES `doctorbooking` WRITE;
/*!40000 ALTER TABLE `doctorbooking` DISABLE KEYS */;
INSERT INTO `doctorbooking` VALUES (1,'2024-04-18','10:55:00',1,6,'oiougou'),(2,'2024-05-25','13:18:00',1,6,'wofeiwoeifwoeifweo'),(3,'2024-05-15','12:18:00',1,6,'qwqfqwfqwefwefwefe'),(4,'2024-06-07','18:34:00',1,6,'woiefbweuwe'),(26,'2024-05-18','08:00:00',1,NULL,'helo'),(27,'2024-05-18','08:00:00',1,NULL,'helo'),(28,'2024-05-17','08:00:00',1,8,'sdf'),(29,'2024-05-17','08:00:00',1,8,'sdf'),(30,'2024-05-17','08:00:00',1,8,'sdf'),(31,'2024-06-01','08:00:00',1,8,'@'),(32,'2024-05-12','08:00:00',1,NULL,'jknj'),(33,'2024-05-12','08:00:00',1,NULL,'jknj'),(34,'2024-05-17','07:00:00',1,8,'');
/*!40000 ALTER TABLE `doctorbooking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
  `did` int NOT NULL AUTO_INCREMENT,
  `dname` varchar(255) NOT NULL,
  `qualification` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `contact` bigint DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `dimage` blob,
  PRIMARY KEY (`did`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES (1,'Dr.Tess','Doctorate (MD)','New York City, NY',8937829127,'tess@gmail.com',_binary 'image/female_doctor.jpg'),(2,'Dr.Geethika','Doctorate(MD)','Kottayam',9892637219,'geethika@gmail.com',_binary 'û\ÍvR\÷fV\Í\ãU\÷F\÷7'),(3,'Dr.Anjana','Cardiology','Ettumanoor',9463728325,'anjana@gmail.com',_binary '/image/female_doctor.jpg');
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `pid` int NOT NULL AUTO_INCREMENT,
  `pname` varchar(255) NOT NULL,
  `prize` int NOT NULL,
  `image` blob,
  `descrption` text,
  `stock` int DEFAULT NULL,
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Ashwagandha',200,_binary 'image/cart-img-1.jpg','This is the description about',10),(2,'Abhayarist',400,_binary 'image/product-2.png','This is the description about',10),(3,'Brahmi',400,_binary 'image/bb.png','very well known ayurvedic medicine for memory power,used as amemory booster and other brain-related disorders',10),(4,'Ashwagandha',200,_binary 'ayur/product-1.png','fkjwkefwjefwjef',123),(5,'Abhayarist',300,_binary 'ayur/product-2.png','',15),(6,'Brahmi',500,_binary '/ayur/brahmi-3.jpg','',15);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatment`
--

DROP TABLE IF EXISTS `treatment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatment` (
  `tid` int NOT NULL AUTO_INCREMENT,
  `tname` varchar(255) NOT NULL,
  `course` int NOT NULL,
  `prize` int NOT NULL,
  `description` text,
  `image` text,
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment`
--

LOCK TABLES `treatment` WRITE;
/*!40000 ALTER TABLE `treatment` DISABLE KEYS */;
INSERT INTO `treatment` VALUES (1,'Abhyanga',7,1000,'Abhyanga is a traditional Ayurvedic full-body massage using warm herbal oils. It is believed to nourish the body, improve blood circulation, and promote relaxation.','/ayur/abhyanga.jpg'),(2,'Shirodhara',7,7000,'Shirodhara is a therapeutic Ayurvedic treatment where warm oil is poured in a continuous stream onto the forehead, typically followed by a scalp massage. It is known for its calming effects and is often used to relieve stress and promote mental clarity.','/ayur/shirodhara.jpg'),(3,'Udwarthanam',3,3000,'Udwarthanam is a therapeutic Ayurvedic massage using herbal powders. It is believed to improve skin texture, reduce cellulite, and promote weight loss.','/ayur/trat4.jpg'),(4,'Panchakarma',5,5000,'Panchakarma is a comprehensive Ayurvedic detoxification and cleansing therapy that involves various treatments like massage, herbal steam, and purgation. It aims to balance the doshas and eliminate toxins from the body, thereby promoting overall health and well-being.','ayur/treat2.jpg'),(5,'Nasya',2,3000,'Nasya is a nasal administration of medicated oils or powders. It is commonly used to treat respiratory conditions, sinusitis, and promote mental clarity.','/ayur/treat3.jpg'),(6,'Shiro Abhyanga',10,15000,'Shiroabhyanga, a therapeutic head massage, is a traditional Ayurvedic therapy aimed at promoting relaxation, rejuvenation, and holistic well-being. This therapeutic practice involves gentle massage techniques applied to the scalp, neck, and shoulders using warm, medicated oils infused with herbs.','ayur/ayurvedic-treatment.png');
/*!40000 ALTER TABLE `treatment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatmentbooking`
--

DROP TABLE IF EXISTS `treatmentbooking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatmentbooking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` bigint DEFAULT NULL,
  `treatment` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `foreign_key_treatment_booking` (`uid`),
  CONSTRAINT `foreign_key_treatment_booking` FOREIGN KEY (`uid`) REFERENCES `account` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatmentbooking`
--

LOCK TABLES `treatmentbooking` WRITE;
/*!40000 ALTER TABLE `treatmentbooking` DISABLE KEYS */;
INSERT INTO `treatmentbooking` VALUES (1,6,'tachyonfiletransfer@gmail.com',9012345678,'Abhyanga'),(5,6,'tachyonfiletransfer@gmail.com',9012345678,'Abhyanga'),(6,6,'tachyonfiletransfer@gmail.com',9012345678,'Shirodhara'),(7,6,'tachyonfiletransfer@gmail.com',9012345678,'Shirodhara'),(8,6,'tachyonfiletransfer@gmail.com',9012345678,'Shirodhara'),(9,7,'sandrashaji19@gmail.com',8921476127,'Abhyanga'),(10,7,'sandrashaji19@gmail.com',8921476127,'Shirodhara'),(11,7,'sandrashaji19@gmail.com',8921476127,'Shirodhara'),(12,7,'sandrashaji196@gmail.com',8921476127,'Shirodhara'),(13,7,'sandrashaji196@gmail.com',8921476127,'Shirodhara'),(14,8,'sandra@gmail',3626718,'Udwarthanam'),(15,8,'mnnm@hbj',111,'Shiro Abhyanga'),(16,8,'mnnm@hbj',111,'Shiro Abhyanga'),(17,8,'mnnm@hbj',111,'Shiro Abhyanga'),(18,8,'hbhj@dfs.com',0,'Panchakarma'),(19,8,'hbhj@dfs.com',0,'Panchakarma'),(20,8,'hbhj@dfs.com',0,'Panchakarma'),(21,8,'jjjj@sf.com',0,'Shirodhara'),(22,8,'behera8024@lewenbo.com',0,'Shirodhara'),(23,8,'behera8024@lewenbo.com',900000000,'Abhyanga'),(24,8,'geethika@gmail.com',7857362920,'Abhyanga');
/*!40000 ALTER TABLE `treatmentbooking` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-08 18:47:33
