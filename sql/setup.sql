##################################################
#
# Creates tables needed.
#
##################################################

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS challenge;

CREATE TABLE challenge(
    id INT NOT NULL AUTO_INCREMENT,
    text VARCHAR(200) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    createdTime TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3),
    lastModifiedTime TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id)
);

INSERT INTO challenge(text) VALUES ('She had the gift of being able to paint songs.'), ('Giving directions that the mountains are to the west only works when you can see them.'), ('Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin'), ('The most disastrous thing that you can ever learn is your first programming language. - Alan Kay');

DROP TABLE IF EXISTS competition;
CREATE TABLE competition(
    id INT NOT NULL AUTO_INCREMENT,
    url VARCHAR(200) NOT NULL,
    fkChallengeId INT DEFAULT NULL,
    maxCount INT DEFAULT 2,
    status ENUM('Registered', 'In Progress', 'Completed') DEFAULT 'Registered',
    createdTime TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3),
    lastModifiedTime TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    CONSTRAINT fkChallengeId FOREIGN KEY(fkChallengeId) REFERENCES challenge(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

DROP TABLE IF EXISTS user;
CREATE TABLE user(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(100) DEFAULT NULL,
    identifier VARCHAR(100) DEFAULT NULL,
    active BOOLEAN DEFAULT TRUE,
    createdTime TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3),
    lastModifiedTime TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE KEY (email), 
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS user_competition;
CREATE TABLE user_competition(
    id INT NOT NULL AUTO_INCREMENT,
    fkUserId INT NOT NULL,
    fkCompetitionId INT NOT NULL,
    startTime TIMESTAMP(3) DEFAULT NULL,
    endTime TIMESTAMP(3) DEFAULT NULL,
    gameTime INT DEFAULT NULL,
    winner BOOLEAN DEFAULT FALSE,
    lastModifiedTime TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY (fkUserId, fkCompetitionId),
    CONSTRAINT fkUserId FOREIGN KEY(fkUserId) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT fkCompetitionId FOREIGN KEY(fkCompetitionId) REFERENCES competition(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_INSERT_USER_FOR_COMPETITION;
CREATE PROCEDURE sp_INSERT_USER_FOR_COMPETITION (
	userId INT,
    competitionId INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
		ROLLBACK;
        RESIGNAL;
	END;

	DECLARE EXIT HANDLER FOR SQLWARNING 
    BEGIN
		ROLLBACK;
        RESIGNAL;
	END;

    START TRANSACTION;
    INSERT INTO user_competition(fkUserId, fkCompetitionId) VALUES (userId, competitionId);
    SET @userCompetitionCount := (SELECT COUNT(id) FROM user_competition WHERE fkCompetitionId = competitionId);
    SET @maxCompetitionUserCount := (SELECT maxCount FROM competition WHERE id = competitionId);
        
    IF @userCompetitionCount <= @maxCompetitionUserCount
    THEN
        SET @userRegisteredForCompetition = 1;
        COMMIT;
    ELSE
        SET @userRegisteredForCompetition = 0;
        ROLLBACK;
    END IF;

    SELECT @userCompetitionCount, @maxCompetitionUserCount, @userRegisteredForCompetition;
END;
$$

SET FOREIGN_KEY_CHECKS = 1;
