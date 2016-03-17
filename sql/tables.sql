CREATE TABLE FOOD (
  ID BIGINT(20) NOT NULL AUTO_INCREMENT,
  TYPE TINYINT(2) NULL DEFAULT NULL,
  NAME VARCHAR(125) NULL DEFAULT NULL,
  DESCRIPTION TEXT NULL DEFAULT NULL,
  PRICE DECIMAL(10,2) NULL DEFAULT NULL,
  IMAGE_URL TINYTEXT NULL DEFAULT NULL,
  ACTIVE TINYINT(1) NOT NULL DEFAULT 1 ,
  PRIMARY KEY (ID),
  INDEX ACTIVE_IDX (ACTIVE ASC)  );
