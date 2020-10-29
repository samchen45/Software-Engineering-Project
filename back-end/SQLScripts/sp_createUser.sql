DELIMITER $$
DROP PROCEDURE IF EXISTS sp_createUser;
CREATE DEFINER=`TCPAdmin`@`localhost` PROCEDURE `sp_createUser`(
    IN p_fullname VARCHAR(20),
    IN p_username VARCHAR(20),
    IN p_password VARCHAR(100)
)
BEGIN
    if ( select exists (select 1 from users where username = p_username) ) THEN
     
        select 'Username Exists !!';
     
    ELSE
     
        insert into users
        (
            fullname,
            username,
            password
        )
        values
        (
            p_fullname,
            p_username,
            p_password
        );
     
    END IF;
END$$
DELIMITER ;
