-- MySQL dump 10.13  Distrib 8.0.31, for macos12.6 (arm64)
--
-- Host: localhost    Database: kakidb
-- ------------------------------------------------------
-- Server version	8.0.31

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
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add vocab item',7,'add_vocabitem'),(26,'Can change vocab item',7,'change_vocabitem'),(27,'Can delete vocab item',7,'delete_vocabitem'),(28,'Can view vocab item',7,'view_vocabitem'),(29,'Can add study item',8,'add_studyitem'),(30,'Can change study item',8,'change_studyitem'),(31,'Can delete study item',8,'delete_studyitem'),(32,'Can view study item',8,'view_studyitem'),(33,'Can add user',9,'add_user'),(34,'Can change user',9,'change_user'),(35,'Can delete user',9,'delete_user'),(36,'Can view user',9,'view_user');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$390000$rPNZdK83Ja8UXwhNw5yzoD$feQ6Z1DdoZ3Vl41PJDRtxSXV9ZNbaZRbwfDljZpyQJM=','2022-10-13 21:58:23.789000',1,'mathewajk','','','kaki@mathewkramer.io',1,1,'2022-09-22 13:56:13.985000');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2022-09-22 13:57:51.883000','1','柿 (かき) | 0',1,'[{\"added\": {}}]',7,1),(2,'2022-09-22 13:58:31.710000','2','牡蠣 (かき) | 1',1,'[{\"added\": {}}]',7,1),(3,'2022-10-06 18:52:46.375000','2','Mathew, 単語, 0',3,'',8,1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (4,'admin','logentry'),(6,'auth','group'),(5,'auth','permission'),(7,'auth','user'),(8,'contenttypes','contenttype'),(3,'kaki','studyitem'),(2,'kaki','user'),(1,'kaki','vocabitem'),(9,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2022-11-07 16:23:14.064793'),(2,'auth','0001_initial','2022-11-07 16:23:14.124618'),(3,'admin','0001_initial','2022-11-07 16:23:14.144456'),(4,'admin','0002_logentry_remove_auto_add','2022-11-07 16:23:14.147724'),(5,'admin','0003_logentry_add_action_flag_choices','2022-11-07 16:23:14.150838'),(6,'contenttypes','0002_remove_content_type_name','2022-11-07 16:23:14.165715'),(7,'auth','0002_alter_permission_name_max_length','2022-11-07 16:23:14.175416'),(8,'auth','0003_alter_user_email_max_length','2022-11-07 16:23:14.182707'),(9,'auth','0004_alter_user_username_opts','2022-11-07 16:23:14.186343'),(10,'auth','0005_alter_user_last_login_null','2022-11-07 16:23:14.195712'),(11,'auth','0006_require_contenttypes_0002','2022-11-07 16:23:14.196326'),(12,'auth','0007_alter_validators_add_error_messages','2022-11-07 16:23:14.199030'),(13,'auth','0008_alter_user_username_max_length','2022-11-07 16:23:14.209771'),(14,'auth','0009_alter_user_last_name_max_length','2022-11-07 16:23:14.220044'),(15,'auth','0010_alter_group_name_max_length','2022-11-07 16:23:14.226135'),(16,'auth','0011_update_proxy_permissions','2022-11-07 16:23:14.229054'),(17,'auth','0012_alter_user_first_name_max_length','2022-11-07 16:23:14.239408'),(18,'kaki','0001_initial','2022-11-07 16:23:14.242230'),(19,'kaki','0002_vocabitem_learned','2022-11-07 16:23:14.246039'),(20,'kaki','0003_user_studyitem','2022-11-07 16:23:14.263285'),(21,'kaki','0004_alter_studyitem_item','2022-11-07 16:23:14.264893'),(22,'kaki','0005_alter_studyitem_user','2022-11-07 16:23:14.282466'),(23,'kaki','0006_vocabitem_category_vocabitem_definition_and_more','2022-11-07 16:23:14.296498'),(24,'sessions','0001_initial','2022-11-07 16:23:14.301496');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('2filc3wmajrwby0tok5scqea7ew6ovoi','.eJxVjMsOwiAUBf-FtSFc3rh0328gXB5SNZCUdmX8d9ukC92emTlv4sO2Vr-NvPg5kSsBcvndMMRnbgdIj9Duncbe1mVGeij0pINOPeXX7XT_DmoYda-lZlmBUcgkd0wY5FoZXlBKK4WNioERggWtEBzayEVx0mQHuwpQoiKfL5TwNes:1ocumC:UD3KNSmxRAzzYdlcf4-msJ6_f0TI2yAFog0rX6X_Oic','2022-10-10 20:32:28.556000'),('dsh14eug6ymm43x7jvy7sztk2x6cq0ci','.eJxVjMsOwiAUBf-FtSFc3rh0328gXB5SNZCUdmX8d9ukC92emTlv4sO2Vr-NvPg5kSsBcvndMMRnbgdIj9Duncbe1mVGeij0pINOPeXX7XT_DmoYda-lZlmBUcgkd0wY5FoZXlBKK4WNioERggWtEBzayEVx0mQHuwpQoiKfL5TwNes:1obMhC:EULH3y9Jxvo_S_cY0a21nquDy-lCmzcxbNIFgoDXvKI','2022-10-06 13:56:54.001000'),('wfqn1dbvvae22citp1h9b5a1y9xgj0on','.eJxVjEEOwiAQRe_C2hCYFigu3fcMZIYBqRqalHZlvLtt0oVu_3vvv0XAbS1ha2kJE4ur0OLyuxHGZ6oH4AfW-yzjXNdlInko8qRNjjOn1-10_w4KtrLXMTtEIuLBRm1SZuJECD5BT50bfHbgrGGlo1OOdtTbbJQH7q0HgE58vihBOJE:1oj6Df:hh4iI-vLHXeDUB7bnwWHaygUla3Yz_7T1DOGlZCDheI','2022-10-27 21:58:23.790000');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kaki_studyitem`
--

DROP TABLE IF EXISTS `kaki_studyitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kaki_studyitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `priority` int NOT NULL,
  `item_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `kaki_studyitem_item_id_f03d0400_fk_kaki_vocabitem_id` (`item_id`),
  KEY `kaki_studyitem_user_id_7bd2a998` (`user_id`),
  CONSTRAINT `kaki_studyitem_item_id_f03d0400_fk_kaki_vocabitem_id` FOREIGN KEY (`item_id`) REFERENCES `kaki_vocabitem` (`id`),
  CONSTRAINT `kaki_studyitem_user_id_7bd2a998_fk_kaki_user_id` FOREIGN KEY (`user_id`) REFERENCES `kaki_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kaki_studyitem`
--

LOCK TABLES `kaki_studyitem` WRITE;
/*!40000 ALTER TABLE `kaki_studyitem` DISABLE KEYS */;
INSERT INTO `kaki_studyitem` VALUES (1,0,3,1),(3,0,8,1),(4,0,12,1),(5,0,13,1),(6,0,14,1),(7,0,15,1),(8,0,17,1),(9,0,18,1),(10,0,19,1),(11,0,20,1),(12,0,21,1),(14,0,23,1);
/*!40000 ALTER TABLE `kaki_studyitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kaki_user`
--

DROP TABLE IF EXISTS `kaki_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kaki_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kaki_user`
--

LOCK TABLES `kaki_user` WRITE;
/*!40000 ALTER TABLE `kaki_user` DISABLE KEYS */;
INSERT INTO `kaki_user` VALUES (1,'Mathew'),(2,'Ed'),(3,'Lauretta');
/*!40000 ALTER TABLE `kaki_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kaki_vocabitem`
--

DROP TABLE IF EXISTS `kaki_vocabitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kaki_vocabitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `tango` varchar(50) NOT NULL,
  `yomi` varchar(50) NOT NULL,
  `pitch` int NOT NULL,
  `learned` tinyint(1) NOT NULL,
  `category` varchar(50) NOT NULL,
  `definition` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kaki_vocabitem`
--

LOCK TABLES `kaki_vocabitem` WRITE;
/*!40000 ALTER TABLE `kaki_vocabitem` DISABLE KEYS */;
INSERT INTO `kaki_vocabitem` VALUES (3,'単語','たんご',0,0,'',''),(8,'犬','いぬ',2,0,'',''),(12,'豆','まめ',2,0,'',''),(13,'前','まえ',1,0,'',''),(14,'柿','かき',0,0,'',''),(15,'牡蠣','かき',1,0,'',''),(17,'猫','ねこ',1,0,'',''),(18,'コーヒー','コーヒー',3,0,'',''),(19,'一生懸命','いっしょうけんめい',5,0,'',''),(20,'始める','はじめる',0,0,'',''),(21,'先生','せんせい',3,0,'',''),(23,'日本語','にほんご',0,0,'',''),(24,'文書','もんじょ',1,0,'N1','document, writing, paperwork'),(25,'打撃','だげき',0,0,'N1','blow, shock, strike'),(26,'報酬','ほうしゅう',0,0,'N1','remuneration, recompense, reward'),(27,'移民','いみん',0,0,'N1','emigration, immigration'),(28,'依然','いぜん',0,0,'N1','still; as yet; as it has been'),(29,'持続','じぞく',0,0,'N1','continuation; persisting; lasting; sustaining; enduring'),(30,'傾ける','かたむける',4,0,'N1','to incline, to lean, to tilt'),(31,'好意','こうい',1,0,'N1','good will, favor, courtesy'),(32,'購入','こうにゅう',0,0,'N1','purchase, buy'),(33,'明瞭','めいりょう',0,0,'N1','clear; plain; distinct; obvious; evident; articulate'),(34,'理論','りろん',1,0,'N1','theory'),(35,'設立','せつりつ',0,0,'N1','establishment, founding'),(36,'視野','しや',1,0,'N1','field of vision; view; one’;s outlook'),(37,'少数','しょうすう',3,0,'N1','minority; few'),(38,'募る','つのる',2,0,'N1','to grow violent, to become stronger'),(39,'余地','よち',1,0,'N1','place, room, margin'),(40,'財政','ざいせい',0,0,'N1','public finance, financial affairs'),(41,'圧力','あつりょく',2,0,'N1','pressure, stress'),(42,'挑戦','ちょうせん',0,0,'N1','challenge, defiance, dare'),(43,'不当','ふとう',0,0,'N1','injustice, impropriety, unfair'),(44,'軍事','ぐんじ',1,0,'N1','military affairs'),(45,'課題','かだい',0,0,'N1','subject; theme; issue; matter; homework; assignment; task; challenge; problem; question'),(46,'機構','きこう',0,0,'N1','mechanism, organization'),(47,'競う','きそう',2,0,'N1','to compete; to contend; to vie; to contest'),(48,'強烈','きょうれつ',0,0,'N1','strong, intense, severe'),(49,'理性','りせい',1,0,'N1','reason, reasoning power'),(50,'領域','りょういき',0,0,'N1','area; domain; territory; field; range; region; regime'),(51,'戦闘','せんとう',0,0,'N1','battle, fight, combat'),(52,'指示','しじ',1,0,'N1','instructions, directions, indication'),(53,'資格','しかく',0,0,'N1','qualifications; requirements; capabilities'),(54,'思考','しこう',0,0,'N1','thought; consideration; thinking'),(55,'照明','しょうめい',0,0,'N1','illumination; lighting'),(56,'奨励','しょうれい',0,0,'N1','encouragement, promotion'),(57,'勝利','しょうり',1,0,'N1','victory, triumph, win'),(58,'乏しい','ともしい',3,0,'N1','meagre; meager; scarce; limited; destitute; hard up; lacking; scanty; poor'),(59,'増強','ぞうきょう',0,0,'N1','augment, reinforce, increase'),(60,'過ち','あやまち',3,0,'N1','fault, error, indiscretion'),(61,'独裁','どくさい',0,0,'N1','dictatorship, despotism'),(62,'自覚','じかく',0,0,'N1','self-consciousness; self-awareness'),(63,'事前','じぜん',0,0,'N1','prior; beforehand; in advance; before the fact; ex ante'),(64,'監視','かんし',0,0,'N1','monitoring, watching, observation'),(65,'資金','しきん',2,0,'N1','funds, capital'),(66,'所有','しょゆう',0,0,'N1','one’;s possessions; ownership'),(67,'染まる','そまる',0,0,'N1','to be dyed; to be tainted; to be infected; to be stained; to be steeped'),(68,'大衆','たいしゅう',0,0,'N1','general public, the masses'),(69,'動き','うごき',3,0,'N1','movement; move; motion; trend; development; change; fluctuation'),(70,'融資','ゆうし',1,0,'N1','financing, loan'),(71,'絶望','ぜつぼう',0,0,'N1','despair, hopelessness'),(72,'貧乏','びんぼう',1,0,'N1','poverty, destitute, poor'),(73,'防衛','ぼうえい',0,0,'N1','defense, protection'),(74,'動員','どういん',0,0,'N1','mobilization'),(75,'背後','はいご',1,0,'N1','back, rear, background'),(76,'反応','はんのう',0,0,'N1','reaction, response'),(77,'率いる','ひきいる',3,0,'N1','to lead, to command'),(78,'本質','ほんしつ',0,0,'N1','essence, true nature'),(79,'移住','いじゅう',0,0,'N1','migration, immigration'),(80,'意欲','いよく',1,0,'N1','will; desire; ambition; urge'),(81,'肝心','かんじん',0,0,'N1','essential, fundamental, crucial'),(82,'規制','きせい',0,0,'N1','regulation, control, restriction'),(83,'熱意','ねつい',1,0,'N1','zeal, enthusiasm'),(84,'進展','しんてん',0,0,'N1','progress, development'),(85,'高まる','たかまる',3,0,'N1','to rise; to swell; to be promoted'),(86,'適応','てきおう',0,0,'N1','adaptation, accommodation'),(87,'罠','わな',1,0,'N1','snare, trap'),(88,'欲望','よくぼう',0,0,'N1','desire, appetite, lust'),(89,'赤字','あかじ',0,0,'N1','deficit'),(90,'着手','ちゃくしゅ',1,0,'N1','to start work'),(91,'概念','がいねん',1,0,'N1','general idea, concept'),(92,'業績','ぎょうせき',0,0,'N1','achievement, performance, results'),(93,'破壊','はかい',0,0,'N1','destruction, disruption'),(94,'反乱','はんらん',0,0,'N1','insurrection, rebellion'),(95,'兵器','へいき',1,0,'N1','arms, weapons, ordnance'),(96,'貧困','ひんこん',0,0,'N1','poor, needy'),(97,'固める','かためる',0,0,'N1','to harden, to solidify'),(98,'興奮','こうふん',0,0,'N1','excitement, stimulation, agitation'),(99,'大幅','おおはば',0,0,'N1','big; large; drastic; substantial'),(100,'楽観','らっかん',0,0,'N1','optimism; taking an optimistic view'),(101,'良心','りょうしん',1,0,'N1','conscience'),(102,'制服','せいふく',0,0,'N1','uniform'),(103,'成果','せいか',1,0,'N1','fruits'),(104,'専用','せんよう',0,0,'N1','exclusive use; personal use; dedicated'),(105,'処分','しょぶん',1,0,'N1','disposal, dealing'),(106,'推進','すいしん',0,0,'N1','propulsion, drive, promotion'),(107,'手遅れ','ておくれ',2,0,'N1','being'),(108,'扉','とびら',0,0,'N1','door, gate, opening'),(109,'特権','とっけん',0,0,'N1','privilege, special right'),(110,'優先','ゆうせん',0,0,'N1','preference; priority; precedence'),(111,'調達','ちょうたつ',0,0,'N1','supply, provision'),(112,'紛争','ふんそう',0,0,'N1','dispute, trouble, strife'),(113,'幻想','げんそう',0,0,'N1','fantasy; illusion; vision; dream'),(114,'犠牲','ぎせい',0,0,'N1','victim, sacrifice, scapegoat'),(115,'施す','ほどこす',3,0,'N1','to give, to do, to conduct'),(116,'保護','ほご',1,0,'N1','care, protection, shelter'),(117,'上陸','じょうりく',0,0,'N1','landing; disembarkation; landfall'),(118,'改革','かいかく',0,0,'N1','reform, reformation'),(119,'明白','めいはく',0,0,'N1','obvious, clear, plain'),(120,'認識','にんしき',0,0,'N1','recognition; awareness; perception; understanding; knowledge; cognition; cognizance; cognisance'),(121,'覚え','おぼえ',3,0,'N1','memory, sense, experience'),(122,'企む','たくらむ',3,0,'N1','to scheme, to plan, to conspire');
/*!40000 ALTER TABLE `kaki_vocabitem` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-07 11:50:42
