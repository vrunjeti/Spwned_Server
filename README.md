# Spwned_Server
Backend for Spwned, CS498RK Final Project

- [Authentication](#authentication)
  - [Registration](#registration)
  - [Sign In](#sign-in)
- [Game](#game)
  - [Game List](#game-list)
  - [Specific Game](#specific-game)
  - [Create Game](#create-game)
  - [Join Game](#join-game)
  - [Start Game](#start-game)
  - [Delete Game](#delete-game)
- [Player](#player)
  - [Player List](#player-list)
  - [Specific Player](#specific-player)

 
Authentication
=============

### Registration
    
    POST /api/register
    

**Input**

|   Name   |  Type  | Description | Example |
|:--------:|:------:|:-----------:|:-----------:|
| first_name | string |   **Required** | Alex
| last_name | string |   **Required** | Duh
| email | string |   **Required** | ripped@math.com
| password | string |   **Required** | luigi1234


**Response**

    {
        "message": "register OK",
        "data": {
            "__v": 0,
            "first_name": "Alex",
            "last_name": "Duh",
            "email": "ripped@math.com",
            "password": "$2a$10$.ykPNx3Gq/rcAAuQtjHmIu8roUIS03vjgExKeK4HWSakUJOxlp0LS",
            "_id": "55487085a0608480245f0693",
            "dateCreated": "2015-05-05T07:25:57.186Z"
        }
    }

### Sign In
    
    POST /api/signin
    

**Input**

|   Name   |  Type  | Description | Example |
|:--------:|:------:|:-----------:|:-----------:|
| email | string |   **Required** | ripped@math.com
| password | string |   **Required** | luigi1234


**Response**

    {
        "message": "signin OK",
        "data": {
            "_id": "55487085a0608480245f0693",
            "first_name": "Alex",
            "last_name": "Duh",
            "email": "ripped@math.com",
            "password": "$2a$10$.ykPNx3Gq/rcAAuQtjHmIu8roUIS03vjgExKeK4HWSakUJOxlp0LS",
            "__v": 1,
            "games": [
                "554ab75a9dfab5b206f15cdd"
            ],
            "dateCreated": "2015-05-05T07:25:57.186Z"
        }
    }

Game
=============

### Game List
    
    GET /api/game
    
**Supported Parameters**

|   Name   | Description | Example |
|:--------:| :-----------:|:-----------:|
| where |Game ID|where={"_id":"554ab58e9dfab5b206f15cdc"}
| count |True/False| count=true
    
**Response**

    {
        "message": "game list OK",
        "data": [
            {
                "_id": "554ab2479dfab5b206f15cdb",
                "admin_id": "55487085a0608480245f0693",
                "start_date": "1970-01-01T00:00:01.234Z",
                "end_date": "1970-01-01T00:00:01.234Z",
                "capacity": 15,
                "title": "Brawl Related Spwned",
                "description": "Kill your enemies with GCN Controllers",
                "__v": 0,
                "dateCreated": "2015-05-07T00:31:03.177Z",
                "messages": [],
                "all_kills": [],
                "players": []
            },
            {
                "_id": "554ab58e9dfab5b206f15cdc",
                "admin_id": "55487085a0608480245f0693",
                "start_date": "1970-01-01T00:00:01.234Z",
                "end_date": "1970-01-01T00:00:01.234Z",
                "capacity": 15,
                "title": "Ice Breaker",
                "description": "Meet your roommates at GT",
                "__v": 0,
                "dateCreated": "2015-05-07T00:45:02.075Z",
                "messages": [],
                "all_kills": [],
                "players": []
            }
        ]
    }
    
### Create Game
    
    POST /api/game
    

**Input**

|   Name   |  Type  | Description | Example |
|:--------:|:------:|:-----------:|:-----------:|
| title | string |   **Required** | Brawl Related Spwned
| description | string |   **Required** | Kill your enemies with GCN Controllers
| admin_id | string |   **Required** | 55487085a0608480245f0693 
| start_date | string |   **Required** | TBD
| end_date | string |   **Required** | TBD
| capacity | number |   **Required** | 15


**Response**

    {
        "message": "game creation OK",
        "data": {
            "__v": 0,
            "admin_id": "55487085a0608480245f0693",
            "start_date": "1970-01-01T00:00:01.234Z",
            "end_date": "1970-01-01T00:00:01.234Z",
            "capacity": 15,
            "title": "Brawl Related Spwned",
            "description": "Kill your enemies with GCN Controllers",
            "_id": "554ab75a9dfab5b206f15cdd",
            "dateCreated": "2015-05-07T00:52:42.760Z",
            "messages": [],
            "all_kills": [],
            "players": []
        }
    }
    
### Specific Game
    
    GET /api/game/:id
    
**Supported Parameters**

|   Name   | Description | Example |
|:--------:| :-----------:|:-----------:|
| none |none|none
    
**Response**

    {
        "message": "game ID OK",
        "data": {
            "_id": "554ab75a9dfab5b206f15cdd",
            "admin_id": "55487085a0608480245f0693",
            "start_date": "1970-01-01T00:00:01.234Z",
            "end_date": "1970-01-01T00:00:01.234Z",
            "capacity": 15,
            "title": "Brawl Related Spwned",
            "description": "Kill your enemies with GCN Controllers",
            "__v": 6,
            "dateCreated": "2015-05-07T00:52:42.760Z",
            "messages": [],
            "all_kills": [],
            "players": [
                {
                    "killed": [],
                    "isAlive": true,
                    "dateCreated": "2015-05-08T04:37:45.815Z",
                    "_id": "554c3d9980f70334099d27b9",
                    "user_id": "55487085a0608480245f0693"
                }
            ]
        }
    }
    
### Join Game
    
    PUT /api/game/:id/join  
    

**Input**

|   Name   |  Type  | Description | Example |
|:--------:|:------:|:-----------:|:-----------:|
| user_id | string |   **Required** | 55487085a0608480245f0693 

**Response**

    {
        "message": "game join OK",
        "data": {
            "user_id": "55487085a0608480245f0693",
            "player_id": "554c3d9980f70334099d27b9",
            "game_id": "554ab75a9dfab5b206f15cdd"
        }
    }
    
### Start Game
    
    PUT /api/game/:id/start
    

**Input**

|   Name   |  Type  | Description | Example |
|:--------:|:------:|:-----------:|:-----------:|
| none | none |   none | none

**Response**

    {
        "message": "game start OK",
        "data": {
            "game_id": "554ab75a9dfab5b206f15cdd"
        }
    }



### Delete Game
    
    DELETE /api/game/:id

**Response**

    {
        TBD
    }
    
Player
=============

### Player List
    
    GET /api/player/
    
**Supported Parameters**

|   Name   | Description | Example |
|:--------:| :-----------:|:-------------:|
| where |User ID + Game ID|where={"user_id":"554ab15cdc","game_id":"55415cdd"}
| count |True/False| count=true
    
**Response**

    {
        "message": "player list OK",
        "data": [
            {
                "_id": "554cdaea7685f0154f471807",
                "user_id": "554cd2279f6de9303d1a4310",
                "game_id": "554ab75a9dfab5b206f15cdd",
                "__v": 0,
                "dateCreated": "2015-05-08T15:48:58.732Z",
                "isAlive": true,
                "killed": [],
                "killer": null,
                "target": null
            }
        ]
    }
   
### Specific Player
    
    GET /api/player/:id
    
**Supported Parameters**

|   Name   | Description | Example |
|:--------:| :-----------:|:-----------:|
| none |none|none
    
**Response**

    {
        "message": "player ID OK",
        "data": {
            "_id": "554cdaea7685f0154f471807",
            "user_id": "554cd2279f6de9303d1a4310",
            "game_id": "554ab75a9dfab5b206f15cdd",
            "__v": 0,
            "dateCreated": "2015-05-08T15:48:58.732Z",
            "isAlive": true,
            "killed": [],
            "killer": null,
            "target": null
        }
    }