### Stack
- Sveltekit
- Typescript
- Prisma 

### Requirement
- Nodejs v20.x
- Mysql v8.x

### Instalation
- Clone the project :
```bash
# clone the project or fork the project
git clone https://github.com/fanboykun/backend-irfan-ramadhan.git

# go to the project directory
cd backend-irfan-ramadhan
```

- Install Dependency: 
```bash
# install dependency with npm or pnpm
npm install
```

- Create database with name: 'db-backend-irfan-ramadhan' 
    
    or: 
```bash
# login to your mysql user as root
mysql -u root

# create the database
CREATE DATABASE db-backend-irfan-ramadhan;
``` 

    or copy the db-backend-irfan-ramadhan.sql file and import it to your mysql client

- Setting Prisma
```bash
# migrate the schema to your db
npx prisma migrate dev

# (optional) generate the client
npx prisma generate

# run the database seeder (required)
npx prisma db seed
```


### Developing

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev --open
```
open the development server in browser (optional)
```bash
http://localhost:5173
```

### Testing API
- Import Postman collection 'backend-irfan-ramadhan.json' file into postman
- open api/auth folder
- use the login-customer request to login as customer with credential: email: "customer@gmail.com" password: "password"
- use the login-merchant request to login as merchant with credential: email: "merchant@gmail.com" password: "password"
- copy the token returned from the server
- set Authorization header as Bearer Token, paste the token to the place
- use other endpoints



##### Run the build version (optional)
```bash
#building process
npm run build

#run the server
node build/index.js

#then, test the app
```
