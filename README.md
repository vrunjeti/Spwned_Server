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