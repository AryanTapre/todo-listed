**Technology used:**  ![postman](https://res.cloudinary.com/djmev9ppr/image/upload/v1705335363/icons/postman.png) ![nodeJS](https://res.cloudinary.com/djmev9ppr/image/upload/v1705335362/icons/nodejs.png) ![github](https://res.cloudinary.com/djmev9ppr/image/upload/v1705335362/icons/github.png) ![mongoDB](https://res.cloudinary.com/djmev9ppr/image/upload/v1705335362/icons/mongo%20db.png)  ![jwt](https://res.cloudinary.com/djmev9ppr/image/upload/v1705335362/icons/jwt.png)  ![ExpressJS](https://res.cloudinary.com/djmev9ppr/image/upload/v1705335362/icons/express%20js.png)  ![JavaScript](https://res.cloudinary.com/djmev9ppr/image/upload/v1705071655/icons/js.png) 

**Cool Name Be:** *TODO-BackendSystem*

---
> *Handling APIs*

** User signup **
- ` HTTP post request` URL: `http://localhost:5000/api/v1/signup`  with json body as:
    ```Json
        {
            "phoneNumber":"",
            "password":""
        }
    ```

** User signin **
- ` HTTP post request` URL: `http://localhost:5000/api/v1/signin`  with json body as:
    ```Json
        {
            "phoneNumber":"",
            "password":""
        }
    ```

** create task **
- ` HTTP post request` URL: `http://localhost:5000/api/v1/create-task`  with json body as:
    ```Json
        {
            "userTitle" : "",
            "userDescription": "" ,
            "userDueDate": "2024-03-04"
        }
    ```


** update task **
- ` HTTP post request` URL: `http://localhost:5000/api/v1/update-task/:taskID`  with json body as:
    ```Json
        {
            "status":"done",
            "dueDate":"2024-03-03"
        }
        
    ```

** create sub task **
- ` HTTP Get request` URL: `http://localhost:5000/api/v1/create-subtask/:taskID` 


** get sub task **
- ` HTTP Get request` URL: `http://localhost:5000/api/v1/get-subtask/:taskID`


** update sub task **
- ` HTTP post request` URL: `http://localhost:5000/api/v1/update-subtask`  with json body as:
    ```Json
       {
        "status":"1",
        "taskID":"65e42036eeeb71d2e7fdec98"
       }
        
    ``` 

  
** delete task **
- ` HTTP Get request` URL: `http://localhost:5000/api/v1/delete-task/:taskID`   

** delete sub task **
- ` HTTP Get request` URL: `http://localhost:5000/api/v1/delete-subtask/:taskID`  

** get user status **
- ` HTTP Get request` URL: `http://localhost:5000/api/v1/status`


** get all user task **
- ` HTTP Get request` URL: `http://localhost:5000/api/v1/get-tasks?page=1&limit=5&filter={priority/dueDate}`   



---
> *Initialization*
-   ```Javascript
        npm install 
    ```

> *To Start HTTP server*
- ```Javascript
        npm run dev 
    ``` 


