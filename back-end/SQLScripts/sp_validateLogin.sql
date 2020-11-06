DELIMITER $$
DROP PROCEDURE IF EXISTS sp_validateLogin;
CREATE DEFINER=`TCPAdmin`@`localhost` PROCEDURE `sp_validateLogin`(
IN p_username VARCHAR(20)
)
BEGIN
    select * from users where username = p_username;
END$$
DELIMITER ;