Here is back-end part

Required installation: Python3, MySQL

1. Start MySQL: 
```
mysql -u root -p
```

2. Reset and initialize sql: 
```
mysql>source SQLScripts/SQLReset.sql
```


3. Create Python virtual environment (skip if already done so)
```
python3 -m venv env
```

4. Activate Python virtual environment
```
source env/bin/activate
```

5. Install TCP local package
```
pip install .
```

6. Start backend server
```
python TCP/app.py
```
