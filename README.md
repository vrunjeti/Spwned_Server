# Spwned_Server
Backend for Spwned, CS498RK Final Project

- [Setting Up](#setting-up)
- [Authentication](#authentication)
  - [Registration](#registration)
  - [Sign In](#sign-in)
- [Game](#game)
  - [Game List](#game-list)
  - [Create Game](#create-game)
  - [Specific Game](#specific-game)
  - [Join Game](#join-game)
- [Player](#player)
  - [Player List](#player-list)
  - [Specific Player](#specific-player)
  - [Report Kill](#report-kill)
- [Admin](#admin)
  - [Start Game](#start-game)
  - [Delete Game](#delete-game)
  - [Remove Player](#remove-player)
- [Message](#message)
  - [Message List](#message-list)
- [Kill](#kill)
  - [Kill List](#kill-list)
- [User Account](#user-account)
  - [Specific User Account](#specific-user-account)


Setting Up
=============
**Install Dependencies**

    npm install

**Run Server**

    nodemon server.js



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
                "_id": "554ea771748f8ea47c0eac7e",
                "start_date": "1970-01-01T00:00:01.234Z",
                "end_date": "1970-01-01T00:00:01.234Z",
                "capacity": 15,
                "title": "Brawl Related Spwned",
                "description": "Kill your enemies with GCN Controllers",
                "__v": 13,
                "admin_id": "554ea771748f8ea47c0eac7f",
                "isFinished": false,
                "hasStarted": true,
                "winners": [],
                "dateCreated": "2015-05-10T00:33:53.503Z",
                "players": [
                    "554ede92257f221f2e9892c4",
                    "554eb3c2c737d5ce161feee6",
                    "554ee14756319e64341e1200"
                ]
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
| user_id | string |   **Required** | 55487085a0608480245f0693
| capacity | number |   **Required** | 15


**Response**

    {
        "message": "game creation OK",
        "data": {
            "admin_id": "554fc9a0e94dafc55c7bf866",
            "__v": 0,
            "capacity": 2,
            "title": "Annie's big Day",
            "description": "Tag each other with pillows!",
            "_id": "554fc9a0e94dafc55c7bf865",
            "isFinished": false,
            "hasStarted": false,
            "winners": [],
            "dateCreated": "2015-05-10T21:12:00.198Z",
            "players": []
        }
    }

### Specific Game

    GET /api/game/:id

**Supported Parameters**

|   Name   | Description | Example |
|:--------:| :-----------:|:-----------:|
| user_id |**Required**| 55487085a0608480245f0693

**Response**

    {
        "message": "game select admin OK",
        "data": {
            "_id": "554ea771748f8ea47c0eac7e",
            "start_date": "1970-01-01T00:00:01.234Z",
            "end_date": "1970-01-01T00:00:01.234Z",
            "capacity": 15,
            "title": "Brawl Related Spwned",
            "description": "Kill your enemies with GCN Controllers",
            "__v": 1,
            "admin_id": "554ea771748f8ea47c0eac7f",
            "isFinished": false,
            "hasStarted": false,
            "winners": [],
            "dateCreated": "2015-05-10T00:33:53.503Z",
            "players": [
                "554eb3c2c737d5ce161feee6"
            ],
            "admin_token": "554ea771748f8ea47c0eac7f",
            "player_token": null
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

Player
=============

### Player List

    GET /api/:game_id/players

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
                "_id": "554eb3c2c737d5ce161feee6",
                "user_id": "554eb3a3c737d5ce161feee5",
                "game_id": "554ea771748f8ea47c0eac7e",
                "__v": 3,
                "dateCreated": "2015-05-10T01:26:26.465Z",
                "secret_code": "EIEG",
                "isAlive": true,
                "killed": [
                    "554eeb27053466ef47061c14",
                    "554eebd172aa85ef480c4d66",
                    "554eec1672aa85ef480c4d67"
                ],
                "killer_id": null,
                "target_id": "554eb3c2c737d5ce161feee6"
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
            "_id": "554d1e383bad7b454a9a7259",
            "user_id": "55487085a0608480245f0693",
            "game_id": "554d1e0d3bad7b454a9a7258",
            "__v": 4,
            "dateCreated": "2015-05-08T20:36:08.361Z",
            "secret_code": "HI8H",
            "isAlive": true,
            "killed": [
                "554d20f7da2240bf507c6dc9",
                "554d212fda2240bf507c6dca",
                "554d21e0e9c013ba522df532",
                "554d21e7e9c013ba522df533"
            ],
            "killer_id": null,
            "target_id": "554d1e433bad7b454a9a725a"
        }
    }

### Report Kill

    PUT /api/player/report

**Input**

|   Name   | Description | Example |
|:--------:| :-----------:|:-----------:|
| player_id | **required** | 55487085a0608480245f0693
| game_id | **required** | 554d1e0d3bad7b454a9a7258 
| secret_code |string|GYPB


**Response**

    {
        "message": "player Report OK",
        "data": {
            "killer_id": "554d1e383bad7b454a9a7259",
            "target_id": "554d1e433bad7b454a9a725a",
            "game_id": "554d1e0d3bad7b454a9a7258",
            "_id": "554d21e7e9c013ba522df533",
            "dateCreated": "2015-05-08T20:51:51.759Z",
            "timeOfKill": "2015-05-08T20:51:51.759Z"
        }
    }

Admin
=============

### Start Game

    PUT api/admin/start

**Input**

|   Name   |  Type  | Description | Example |
|:--------:|:------:|:-----------:|:-----------:|
| admin_id | _id |   **Required** | 55487085a0608480245f0693
| game_id | _id |   **Required** | 554d1908d3317a9b11a1a34c

**Response**

    {
        "message": "game start OK",
        "data": {
            "game_id": "554ea771748f8ea47c0eac7e"
        }
    }


### Delete Game

    DELETE api/admin/delete_game

**Input**

|   Name   |  Type  | Description | Example |
|:--------:|:------:|:-----------:|:-----------:|
| admin_id | _id |   **Required** | 55487085a0608480245f0693
| game_id | _id |   **Required** | 554d1908d3317a9b11a1a34c

**Response**

    {
        "message": "Game deleted",
        "data": "1"
    }

### Remove Player

    DELETE api/admin/remove_player

**Input**

|   Name   |  Type  | Description | Example |
|:--------:|:------:|:-----------:|:-----------:|
| admin_id | _id |   **Required** | 55487085a0608480245f0693
| player_id | _id |   **Required** | 554d2b488277a3ca39b354be
| game_id | _id |   **Required** | 554d1908d3317a9b11a1a34c

**Response**

    {
        "message": "Player removed",
        "data": "1"
    }


Message
=============
### Message List

    GET /api/p/:id  // where id refers to playerid

**Supported Parameters**

|   Name   |  Type  | Description | Example |
|:--------:|:------:|:-----------:|:-----------:|
| recipient_id | Player ID or NULL |   **Required** | 55487085a0608480245f0693
| sender_id | Player ID |   **Required** | 554d1908d3317a9b11a1a34c
| body | String |   **Required** | "hello world"
| predecessor | Message ID |   **Required** | 554d2b488277a3ca39b354be

**Response**

    {
        "message": "message OK",
        "data": {
            "__v": 0,
            "sender_id": "554d1908d3317a9b11a1a34c",
            "body": "testing with id",
            "_id": "554d2b488277a3ca39b354be",
            "predecessor": null,
            "dateCreated": "2015-05-08T21:31:52.583Z",
            "recipient_id": "554ab75a9dfab5b206f15cdd"
        }
    }

Kill
=============
### Kill List

    GET /api/kills

**Supported Parameters**

|   Name   |  Type  | Description | Example |
|:--------:|:------:|:-----------:|:-----------:|
| recipient_id | game_id |   Filter by game ID | 554ab75a9dfab5b206f15cdd 


**Response**

    {
        "message": "kill list OK",
        "data": [
            {
                "_id": "554eeb27053466ef47061c14",
                "killer_id": "554eb3c2c737d5ce161feee6",
                "target_id": "554ee14756319e64341e1200",
                "game_id": "554ea771748f8ea47c0eac7e",
                "__v": 0,
                "dateCreated": "2015-05-10T05:22:47.598Z",
                "timeOfKill": "2015-05-10T05:22:47.598Z"
            }
        ]
    }

User Account
=============
### Specific User Account

    GET /api/user/:id

**Supported Parameters**

|   Name   |  Type  | Description | Example |
|:--------:|:------:|:-----------:|:-----------:|
| none | none |   none | none 


**Response**

    {
        "message": "user ID OK",
        "data": {
            "_id": "554ede7a257f221f2e9892c3",
            "first_name": "Annie",
            "last_name": "Wu",
            "email": "anniewu@gt.com",
            "password": "$2a$10$ebJar7CLndpY5Y91tmih/uedMeeNhA5AdIMcqSVyKyoqhIk5PVt7.",
            "__v": 12,
            "games": [
                "554fc9a0e94dafc55c7bf865"
            ],
            "dateCreated": "2015-05-10T04:28:42.872Z"
        }
    }