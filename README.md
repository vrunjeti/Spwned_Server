# Spwned_Server
Backend for Spwned, CS498RK Final Project

Authentication
=============

Registration
	
    POST /api/register
    

Input

|   Name   |  Type  | Description |
|:--------:|:------:|:-----------:|
|   name   | string |   **Required** |
| password | string |   **Required** |



Example

    {
        "message": "OK",
        "data": {
                    "_id": "55099652e5993a350458b7b7",
                    "email": "sid.sethupathi@gmail.com",
                    "name": "Sid Sethupathi"
                }
    }
Response


    {
        "message": "OK",
        "data": {
                    "_id": "55099652e5993a350458b7b7",
                    "email": "sid.sethupathi@gmail.com",
                    "name": "Sid Sethupathi"
                }
    }