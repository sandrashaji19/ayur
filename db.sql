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
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES
(60,'admin','C4Ko9ylY2wXdmAXNz2Y/nA==','admin@ayur.com',1234567890,NULL,'user','Administrator'),
(61,'sandra','ctXiqHa5eYGW+N3KEyvUNw==','sandra@gmail.com',1234567890,NULL,'user','Sandra Shaji');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `booking` (
  `bookingid` int(11) NOT NULL AUTO_INCREMENT,
  `pname` varchar(255) DEFAULT NULL,
  `pimage` blob DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  `pid` int(11) DEFAULT NULL,
  PRIMARY KEY (`bookingid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES
(1,'Brahmi','image/bb.png',8,3),
(2,'Brahmi','image/bb.png',8,3),
(3,'Abhayarist','ayur/product-2.png',8,5),
(4,'Brahmi','image/bb.png',8,3);
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctorbooking`
--

LOCK TABLES `doctorbooking` WRITE;
/*!40000 ALTER TABLE `doctorbooking` DISABLE KEYS */;
INSERT INTO `doctorbooking` VALUES
(71,'2024-05-16','08:00:00',2,61,'Sa');
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
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES
(1,'Dr.Tess','Doctorate (MD)','New York City, NY',8937829127,'tess@gmail.com','images/female_doctor.jpg'),
(2,'Dr.Geethika','Doctorate(MD)','Kottayam',9892637219,'geethika@gmail.com','images/female_doctor.jpg'),
(3,'Dr.Anjana','Cardiology','Ettumanoor',9463728325,'anjana@gmail.com','images/female_doctor.jpg');
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES
(1,'Ashwagandha',200,'images/cart-img-1.jpg','Ashwagandha, also known as Indian ginseng, is an ancient herb used in Ayurvedic medicine. It is known for its adaptogenic properties, helping the body manage stress and promoting overall well-being.',10),
(2,'Abhayarist',400,'images/product-2.png','Abhayarist is a traditional Ayurvedic tonic known for its digestive and detoxifying properties. It aids in digestion, improves appetite, and helps to eliminate toxins from the body.',10),
(3,'Brahmi',400,'images/bb.png','Brahmi, also known as Bacopa monnieri, is a renowned herb used in Ayurvedic medicine to enhance memory, cognitive function, and overall brain health. It is considered a potent nervine tonic and adaptogen.',10);
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
  `course` int(11) NOT NULL,
  `prize` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `image` text DEFAULT NULL,
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment`
--

LOCK TABLES `treatment` WRITE;
/*!40000 ALTER TABLE `treatment` DISABLE KEYS */;
INSERT INTO `treatment` VALUES
(1,'Abhyanga',7,1000,'Abhyanga is a traditional Ayurvedic full-body massage using warm herbal oils. It is believed to nourish the body, improve blood circulation, and promote relaxation.','/treatments/abhyanga.jpg'),
(2,'Shirodhara',7,7000,'Shirodhara is a therapeutic Ayurvedic treatment where warm oil is poured in a continuous stream onto the forehead, typically followed by a scalp massage. It is known for its calming effects and is often used to relieve stress and promote mental clarity.','/treatments/shirodhara.jpg'),
(3,'Udwarthanam',3,3000,'Udwarthanam is a therapeutic Ayurvedic massage using herbal powders. It is believed to improve skin texture, reduce cellulite, and promote weight loss.','/treatments/trat4.jpg'),
(4,'Panchakarma',5,5000,'Panchakarma is a comprehensive Ayurvedic detoxification and cleansing therapy that involves various treatments like massage, herbal steam, and purgation. It aims to balance the doshas and eliminate toxins from the body, thereby promoting overall health and well-being.','/treatments/treat2.jpg'),
(5,'Nasya',2,3000,'Nasya is a nasal administration of medicated oils or powders. It is commonly used to treat respiratory conditions, sinusitis, and promote mental clarity.','/treatments/treat3.jpg'),
(6,'Shiro Abhyanga',10,15000,'Shiroabhyanga, a therapeutic head massage, is a traditional Ayurvedic therapy aimed at promoting relaxation, rejuvenation, and holistic well-being. This therapeutic practice involves gentle massage techniques applied to the scalp, neck, and shoulders using warm, medicated oils infused with herbs.','/treatments/ayurvedic-treatment.png');
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
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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

-- Dump completed on 2024-05-16  0:01:12
