-- MariaDB dump 10.19-11.3.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: ayur
-- ------------------------------------------------------
-- Server version	11.3.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` bigint(20) DEFAULT NULL,
  `image` blob DEFAULT NULL,
  `mode` enum('admin','user') DEFAULT 'user',
  `realname` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES
(65,'admin','$argon2id$v=19$m=65536,t=3,p=4$jGIfcNpvirIX/r8AqPj3YA$DMykkCO+JtufuJDeiF2cEzJGwXA5W8uMxzsKDre0OWc','admin@ayur.com',1234567890,NULL,'admin','Administrator'),
(66,'sandra','$argon2id$v=19$m=65536,t=3,p=4$F8ykixAXLW+ligKt6sqU3w$srMJ46ud/Ue9TLID3Xld7ni3VkPwybn8S7JwvMBpjQY','sandr@gmail.com',1234567890,NULL,'user','Sandra Shaji'),
(67,'anjana','$argon2id$v=19$m=65536,t=3,p=4$YrjRE//RKzK0D0SQc/MXtw$Ok2/F0WoDTCZzMAch4w/TOZtubDFIvcWf2MujmYRtxc','anjana@gmail.com',1234567890,NULL,'user','Anjana Mano');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctorbooking`
--

DROP TABLE IF EXISTS `doctorbooking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doctorbooking` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bdate` date NOT NULL,
  `btime` time NOT NULL,
  `did` int(11) DEFAULT NULL,
  `uid` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `did` (`did`),
  KEY `uid` (`uid`),
  CONSTRAINT `doctorBooking_ibfk_1` FOREIGN KEY (`did`) REFERENCES `doctors` (`did`),
  CONSTRAINT `doctorBooking_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `account` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctorbooking`
--

LOCK TABLES `doctorbooking` WRITE;
/*!40000 ALTER TABLE `doctorbooking` DISABLE KEYS */;
/*!40000 ALTER TABLE `doctorbooking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doctors` (
  `did` int(11) NOT NULL AUTO_INCREMENT,
  `dname` varchar(255) NOT NULL,
  `qualification` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `contact` bigint(20) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `dimage` blob DEFAULT NULL,
  PRIMARY KEY (`did`)
) ENGINE=InnoDB AUTO_INCREMENT=149 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES
(1,'Dr.Tess','Doctorate (MD)','New York City, NY',8937829127,'tess@gmail.com','images/doctors/female_doctor.jpg'),
(2,'Dr.Geethika','Doctorate(MD)','Kottayam',9892637219,'geethika@gmail.com','images/doctors/female_doctor.jpg'),
(3,'Dr.Anjana','Cardiology','Ettumanoor',9463728325,'anjana@gmail.com','images/doctors/female_doctor.jpg');
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productbooking`
--

DROP TABLE IF EXISTS `productbooking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productbooking` (
  `bid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(20) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`bid`),
  KEY `pid` (`pid`),
  KEY `uid` (`uid`),
  CONSTRAINT `productbooking_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `products` (`pid`),
  CONSTRAINT `productbooking_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `account` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productbooking`
--

LOCK TABLES `productbooking` WRITE;
/*!40000 ALTER TABLE `productbooking` DISABLE KEYS */;
/*!40000 ALTER TABLE `productbooking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `pname` varchar(255) NOT NULL,
  `prize` int(11) NOT NULL,
  `image` blob DEFAULT NULL,
  `descrption` text DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES
(1,'Ashwagandha',200,'images/products/cart-img-1.jpg','Ashwagandha, also known as Indian ginseng, is an ancient herb used in Ayurvedic medicine. It is known for its adaptogenic properties, helping the body manage stress and promoting overall well-being.',10),
(2,'Abhayarist',400,'images/products/product-2.jpg','Abhayarist is a traditional Ayurvedic tonic known for its digestive and detoxifying properties. It aids in digestion, improves appetite, and helps to eliminate toxins from the body.',10),
(3,'Brahmi',400,'images/products/bb.png','Brahmi, also known as Bacopa monnieri, is a renowned herb used in Ayurvedic medicine to enhance memory, cognitive function, and overall brain health. It is considered a potent nervine tonic and adaptogen.',10);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatment`
--

DROP TABLE IF EXISTS `treatment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `treatment` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `tname` varchar(255) NOT NULL,
  `prize` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `image` text DEFAULT NULL,
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment`
--

LOCK TABLES `treatment` WRITE;
/*!40000 ALTER TABLE `treatment` DISABLE KEYS */;
INSERT INTO `treatment` VALUES
(1,'Abhyanga',1000,'Abhyanga is a traditional Ayurvedic full-body massage using warm herbal oils. It is believed to nourish the body, improve blood circulation, and promote relaxation.','/images/treatments/abhyanga.jpg'),
(2,'Shirodhara',7000,'Shirodhara is a therapeutic Ayurvedic treatment where warm oil is poured in a continuous stream onto the forehead, typically followed by a scalp massage. It is known for its calming effects and is often used to relieve stress and promote mental clarity.','/images/treatments/shirodhara.jpg'),
(3,'Udwarthanam',3000,'Udwarthanam is a therapeutic Ayurvedic massage using herbal powders. It is believed to improve skin texture, reduce cellulite, and promote weight loss.','/images/treatments/trat4.jpg'),
(4,'Panchakarma',5000,'Panchakarma is a comprehensive Ayurvedic detoxification and cleansing therapy that involves various treatments like massage, herbal steam, and purgation. It aims to balance the doshas and eliminate toxins from the body, thereby promoting overall health and well-being.','/images/treatments/treat2.jpg'),
(5,'Nasya',3000,'Nasya is a nasal administration of medicated oils or powders. It is commonly used to treat respiratory conditions, sinusitis, and promote mental clarity.','/images/treatments/treat3.jpg'),
(6,'Shiro Abhyanga',15000,'Shiroabhyanga, a therapeutic head massage, is a traditional Ayurvedic therapy aimed at promoting relaxation, rejuvenation, and holistic well-being. This therapeutic practice involves gentle massage techniques applied to the scalp, neck, and shoulders using warm, medicated oils infused with herbs.','/images/treatments/ayurvedic-treatment.png');
/*!40000 ALTER TABLE `treatment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatmentbooking`
--

DROP TABLE IF EXISTS `treatmentbooking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `treatmentbooking` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `treatment` varchar(200) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `foreign_key_treatment_booking` (`uid`),
  CONSTRAINT `foreign_key_treatment_booking` FOREIGN KEY (`uid`) REFERENCES `account` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatmentbooking`
--

LOCK TABLES `treatmentbooking` WRITE;
/*!40000 ALTER TABLE `treatmentbooking` DISABLE KEYS */;
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

-- Dump completed on 2024-06-22 15:41:29
