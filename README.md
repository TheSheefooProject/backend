# Safe Knight Backend code

As is stated above, this is the backend code for safe knight. Based of this repository the live version of the backend is built, as such do not force push/merge to the `production` branch, without going through the formal approach of getting approval for the given code addition, as it will lead to the live version of the app being rewritten.

Notes:

1. Remember that the codebase is using TypeScript, and as such should follow the appropriate patterns.
2. Not needed, but try to rebase and squash your PR's into one commit, it makes it easier to revert stuff if need be. As well as keep track. e.g `git rebase -i origin/main`
3. Documentation of endpoints can be found at:
   https://docs.google.com/document/d/164k7sPcKGX7cS_V6Ngwv4mZg234M4bJS_j2lqwtA4lA/edit

## Things you need to install

This project uses primarily nodejs, but the typescript version. But on top of that you also need some additional software:

1. Docker - Used for local development (whilst we wait for an azure account)
2. VScode - Uses Vscode plugins
   Install the following extensions for vscode
    1. `prettier`
    2. `eslint`
    3. `better comments`
    4. `azure app service`
    5. `sqltools` - > [Here](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools)
        1. After install, go to SQL tool extenstion, then go to top and click add db. Then click add driver. Search `sql server azure` install the plugin
        2. After that click create database again, select the azure sql server. Fill details, and select connection string-> And paste this in
            `Driver={ODBC Driver 13 for SQL Server};Server=tcp:safeknight.database.windows.net,1433;Database=SafeKnightAPI_DB;Uid=SafeKnightDB;Pwd=Flask8!!;Encrypt=yes;TrustServerCertificate=yes;Connection Timeout=30;`
           Note that whenever you are asked for azure password it is `Flask8!!`
    6. I also recommend going into vscode settings, and turning on format on save. It just makes everything neat.
3. Nodejs - So you can install the LTS version of node, but we wont depend on it that much, all we really need is npm. Node 10 is best tho. Then after install do `npm install -g typescript ts-node`. Make sure `ts-node -v` gives back 10.0.0 btw.
4. Clone the repo and do `npm install`
5. `npm run dev` -> This will start the server locally (eventually not currently setup :p, all you cna do is use the below)

## How to run a the database locally

NOTE! This is a temp solution, since we don't have access to Azure SQL, we are using MSSQL which should be similar to AZURE SQL. According to this: [Here](https://docs.microsoft.com/en-us/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview#:~:text=Learn%20how%20each,care%20about%20most.)
So to start it:

1. Run this command in one terminal `npm run local:db:server` then wait like 10 seconds
2. Run the command `npm run local:db:client` this opens up the db cmd. You can then execute commands! [Docs](https://docs.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker?view=sql-server-ver15&pivots=cs1-bash) Note that you need to write `go` to execute a command.

### SQL Helpful Docs

[Tutorial One](https://www.mysqltutorial.org/mysql-insert-statement.aspx)
[Tutorial Two](https://docs.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker?view=sql-server-ver15&pivots=cs1-bash)
[Tutorial Three](https://docs.microsoft.com/en-us/sql/t-sql/data-types/float-and-real-transact-sql?view=sql-server-ver15)

MSSQL NodeJS - Library [Here](https://github.com/tediousjs/node-mssql)

## Jwt notes

When a user logs in or signs up, we'll send their jwt token in the response
For authorization, we can stroe user's token in local storage on the browser, then whenever the user makes a request that needs authorisation, we send the users token in the request and then use jwt.verify on the backend to check its only the user with the correct priveleges who gets a response from their request. E.g.
//first param=users token sent that needs to be verified, 2nd param= private key, this returns the inital thing before encoding it so possible will return the username and see if that username has correct privilege to access data.
const decodedToken = jwt.verify(token, "my_secret_private_key");

## Code structure

To enable API versions, the server is currently setup such that in the `src` file there is a folder with say v1, this contains appropriate data for the v1 of the API. The `server.ts` file is the main startup file in the src folder, the `app.js` file configures the express server.

Folder structure within the src folder, generally tries to follow the MVC model structure:

**Routes**: Essentially where we define the different api endpoints. When the user wants to add in a new route and do some calculation it should go in here.

**Controller**: Put code here that has to do with working out what a user wants, and deciding what to give them, working out whether they are logged in, whether they should see certain data, etc. In the end, the controller looks at requests and works out what data (Models) to show. Keep your controllers skinny.

**Model**: Your model should be where all your code that relates to your data (the entities that make up your site e.g. Users, Post, Accounts, Friends etc.) lives. If code needs to save, update or summarise data related to your entities, put it here. It will be re-usable across your Views and Controllers. All the user data stuff should go in here.

**Helper**: The majority of the processing should be done within the model however if anything else is needed at it in here.
