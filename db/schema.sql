DROP DATABASE IF EXISTS i28afnkoa6ycdj5c;
CREATE DATABASE i28afnkoa6ycdj5c;
USE i28afnkoa6ycdj5c;

CREATE TABLE
IF NOT EXISTS `Users`(
    `id` INTEGER NOT NULL auto_increment,
     `userName` VARCHAR (255) NOT NULL, 
     `homeTown` VARCHAR(255), 
     `favoriteActivity` VARCHAR(255), 
    `favoriteDestination` VARCHAR(255), 
    `milesTraveled` INTEGER DEFAULT 0, 
    `profilePicture` VARCHAR(255), 
    `createdAt` DATETIME NOT NULL, 
    `updatedAt` DATETIME NOT NULL, 
    PRIMARY KEY(`id`)
);
CREATE TABLE IF NOT EXISTS `Destinations`(
`id` INTEGER NOT NULL auto_increment , 
`departureCity` VARCHAR (255) NOT NULL, 
`departureState` VARCHAR (255) NOT NULL, 
`departureCountry` VARCHAR (255) NOT NULL, 
`arrivalCity` VARCHAR(255) NOT NULL, 
`arrivalState` VARCHAR (255) NOT NULL, 
`arrivalCountry` VARCHAR(255) NOT NULL, 
`tripDistance` INTEGER NOT NULL, 
`tripBlog` TEXT, 
`startDate` DATE NOT NULL, 
`endDate` DATE NOT NULL, 
`savedTrip` TINYINT(1) DEFAULT false, 
`createdAt` DATETIME NOT NULL, 
`updatedAt` DATETIME NOT NULL, 
`UserId` INTEGER NOT NULL, 
PRIMARY KEY(`id`), 
FOREIGN KEY (`UserId`) REFERENCES `Users`
(`id`) ON DELETE NO ACTION ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS `Activities`(
`id` INTEGER NOT NULL auto_increment , 
`activityName` VARCHAR (255) NOT NULL, 
`activityDescription` VARCHAR (255), 
`activityType` VARCHAR (255), 
`createdAt` DATETIME NOT NULL, 
`updatedAt` DATETIME NOT NULL, 
`DestinationId` INTEGER, 
`UserId` INTEGER, 
PRIMARY KEY (`id`), 
FOREIGN KEY (`DestinationId`) REFERENCES `Destinations`
(`id`) ON DELETE SET NULL ON UPDATE CASCADE, 
FOREIGN KEY (`UserId`) REFERENCES `Users`(`id`) ON
DELETE CASCADE ON UPDATE CASCADE
); 



