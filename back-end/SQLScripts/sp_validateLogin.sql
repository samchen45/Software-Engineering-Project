DELIMITER $$
DROP PROCEDURE IF EXISTS sp_validateLogin;
CREATE DEFINER=`TCPAdmin`@`localhost` PROCEDURE `sp_validateLogin`(
IN p_email VARCHAR(20)
)
BEGIN
    select * from users where email = p_email;
END$$
DELIMITER ;