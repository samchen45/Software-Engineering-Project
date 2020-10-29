Here is back-end part

Required installation: Python3, MySQL

pip3 install cryptography flask flask-mysql

1. Start MySQL: mysql -u root -p
2. Reset and initialize sql: mysql>source SQLScripts/SQLReset.sql
3. Create stored procedure(s): mysql>source SQLScripts/sp_createUser.sql
4. Navigate to localhost:5002
