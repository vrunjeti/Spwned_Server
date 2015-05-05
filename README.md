# Spwned_Server
Backend for Spwned, CS498RK Final Project

Authentication
=============

### Registration
    
    POST /api/register
    

**Input**

|   Name   |  Type  | Description | Example |
|:--------:|:------:|:-----------:|:-----------:|
| firstname | string |   **Required** | Alex
| lastname | string |   **Required** | Duh
| email | string |   **Required** | ripped@math.com
| password | string |   **Required** | luigi1234


**Response**

    {
        "message": "register OK",
        "data": {
            "__v": 0,
            "firstname": "Alex",
            "lastname": "Duh",
            "email": "ripped@math.com",
            "password": "$2a$10$gg4Gt7E8yNAYNQipFgS8seuuEKRWNkk7K8Npnho5UMklDabHLiTwW",
            "_id": "554805f504331bad19972f81",
            "dateCreated": "2015-05-04T23:51:17.863Z"
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
            "_id": "554861e03f4f26151c70843d",
            "firstname": "Alex",
            "lastname": "Duh",
            "email": "ripped@math.com",
            "password": "$2a$10$6dGMUplL6.zb7qWwYp7pQ.dzwwTFeljgDCPMerYh7.K.u9wjle81i",
            "__v": 0,
            "dateCreated": "2015-05-05T06:23:28.680Z"
        }
    }

Game - TODO
=============

### Game List
    
    GET /api/game
    
**Response**

    {
        TBD
    }
    
### Create Game
    
    POST /api/game
    

**Input**

|   Name   |  Type  | Description | Example |
|:--------:|:------:|:-----------:|:-----------:|
| title | string |   **Required** | Brawl Related Spwned
| description | string |   **Required** | Kill your enemies with GCN Controllers
| admin_id | string |   **Required** | 554861e03f4f26151c70843d 
| start_date | string |   **Required** | TBD
| end_date | string |   **Required** | TBD
| capacity | number |   **Required** | 15


**Response**

    {
        TBD
    }
    
### Delete Game
    
    DELETE /api/game
    

**Input**

|   Name   |  Type  | Description | Example |
|:--------:|:------:|:-----------:|:-----------:|
| - | - |   No Expected Inputs  | -



**Response**

    {
        TBD
    }
    
### Game Info
    
    GET /api/game/:id
    
**Response**

    {
        TBD
    }
    
### Join Game
    
    POST /api/game/:id
    

**Input**

|   Name   |  Type  | Description | Example |
|:--------:|:------:|:-----------:|:-----------:|
| user_id | string |   **Required** | 554861e03f4f26151c70843d 

**Response**

    {
        TBD
    }
