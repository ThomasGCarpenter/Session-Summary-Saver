# users
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `deletedTimestamp` bigint(13) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# campaigns
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `campaigns` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `dm` varchar(255) NOT NULL,
  `startDate` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `players` ENUM('DRAMA','THRILLER','COMEDY') DEFAULT NULL,
  `deletedTimestamp` bigint(13) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


# sessions
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `characters` varchar(255) NOT NULL,
  `startDate` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `genre` ENUM('DRAMA','THRILLER','COMEDY') DEFAULT NULL,
  `deletedTimestamp` bigint(13) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




-- model sessionData {
--   id         String  @id @default(auto()) @map("_id") @db.ObjectId
--   characters String
--   date       DateTime
--   knowledge  String
--   moments    String
--   campaign_id String? @db.ObjectId
--   title      String
-- }