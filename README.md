The codebase for the API 

Application Code Structure
- Folder Structure
    - config 
        - folder has application config
    - server
        - has all server specific code
        - controller
            - keeps controller logic
        - service
            - keeps service logic
        - validator
            - keeps the request validation logic
    - test
        - contains all unit test specific code
    - sql
        - setup.sql
            - Contains database table/procedure schema
- Package Dependency
    - Dev Dependency
        - Mocha, Chai & Supertest
    - NPM Dependency
        - MySql, Express, Express validator
- routes
    - contains all application routes
- app.js
    - Main file which kickstarts the application

Application Information
    - Application Code flow
        - All opeeration will happen in the tables
    - How to Run
        - Update the database info in the config & run `npm start` to kickstart the application
    - Unit Testing
        - I have not made it comprehensive, 
        - Just gave few sample set which'll give an idea how unit testing can be structured
        - We can create test table such as competition, user, user_competition table on the fly
        - And all the CRUD operation & testing could happen in those table
        - Also can have the unit test run on pre-commit hook, so that no bad code can go w/o passing the unit-testing audit

Postman Collection
- https://www.getpostman.com/collections/2a38994c59b8bf5e29c6

API Overview
    - POST /competition
        - PARAM: url param in field identifier is must, userId is optional
        - Starts off the competition, insert data in to competition table, status of competition is Registered
        - Makes an entry in to user table, if userId not provided(i.e; guest rule)
        - Registers the user for the competition, keeps the user competition mapping in user_competition table
        - If there's more no. of request of user vs. max count the competition can have, then sends response as forbidden 
    - GET /challenge
        - Get a random challenge from the data we have in the table
        - Frontend can call this when user is clicking start
        - We can pass optional param challengeId & it should be able to update competition table with fkChallengeId, so that we can know what challenge was given(Not done)
    - PUT /competition
        - Requires both userId & competitionId
        - Frontend needs to have called POST /competition & got the competitionId, got the user registered for the competition
        - Frontend needs to make a call when competition kick starts
            - backend will update the startTime & marks the competition as In Progress  
        - Frontend needs to make a call when competition ends, i.e user make a successful submission
            - backend will update the endTime & computes the gameTime
            - also figures out whether user is a winner or loser & send back the same as part of API response 
            - Currently I am not valiadting the user input to the string given on the server, we should do it  
        - Currently once we have got the first response & winner is sorted, I am marking competition as Completed & not updating startTime again, we can handle it a bit better
    - GET /competition/status
        - An optional param competitionId can be given
        - We can use this API as a polling API
        - This can be called from browser every 1 or 2s & should update the loser incase the competitor is done, something like a Game Over indicator 

Unit Test preview attached
