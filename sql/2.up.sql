CREATE TABLE USER (
  ID BIGINT(20) NOT NULL AUTO_INCREMENT,
  NAME VARCHAR(45) NOT NULL,
  PASSWORD VARCHAR(45) NOT NULL,
  ACCESS_TOKEN VARCHAR(128) NULL,
  ACCESS_TOKEN_EXPIRES VARCHAR(45),
  REFRESH_TOKEN VARCHAR(128) NULL,
  REFRESH_TOKEN_EXPIRES VARCHAR(45),
  PRIMARY KEY (ID),
  UNIQUE INDEX NAME_UNIQUE (NAME ASC, PASSWORD ASC));

