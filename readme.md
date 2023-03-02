<h1>API Reference</h1>

LogIn API : localhost:5000/api/v1/user/login
            body:{
                email , password
            }

create Admin or User API : localhost:5000/api/v1/user/createnewuser
            body{
                firstName , lastName , role(Admin/User) , email , password , confirmPassword
            }
            header{
                authtoken
            }

Update User API : localhost:5000/api/v1/user/updateuser/{id of the user}
            body{
                fields to update
            }
            header{
                authtoken
            }

View User API : localhost:5000/api/v1/user/viewdata
            header{
                authtoken
            }

