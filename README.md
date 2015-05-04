# Spwned_Server
Backend for Spwned, CS498RK Final Project

Authentication
=============

### Registration
    
    POST /api/register
    

**Input**

|   Name   |  Type  | Description | Example |
|:--------:|:------:|:-----------:|:-----------:|
|   username   | string |   **Required** | PSICaramel
| firstname | string |   **Required** | Alex
| lastname | string |   **Required** | Duh
| email | string |   **Required** | ripped@math.com
| password | string |   **Required** | luigi1234


**Response**

    {
        "message": "OK",
        "data": {
            "__v": 0,
            "username": "PSICaramel",
            "firstname": "Alex",
            "lastname": "Duh",
            "email": "ripped@math.com",
            "password": "$2a$10$gg4Gt7E8yNAYNQipFgS8seuuEKRWNkk7K8Npnho5UMklDabHLiTwW",
            "_id": "554805f504331bad19972f81",
            "dateCreated": "2015-05-04T23:51:17.863Z"
        }
    }