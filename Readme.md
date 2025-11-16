git clone https://github.com/chauhan13/useruploadservice.git
cd useruploadservice/

npm install
npm start

#login
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{
    "email" : "rajesh@gmail.com",
    "password" : "234567"
}'

#u will get the token and u have to pass it in other apis.


#upload
curl -X POST http://localhost:3000/files/upload \
-H "Authorization: Bearer your-jwt-token" \
-F "title=Sample File" \
-F "description=This is a sample file" \
-F "file=@/path/to/your/file.jpg"

#getlist 
curl -X GET http://localhost:3000/files/list \
-H "Authorization: Bearer your-jwt-token"

#shareFile
curl -X POST http://localhost:3000/files/1/share \
-H "Authorization: Bearer your-jwt-token"

#deletefile
curl -X DELETE http://localhost:3000/files/1 \
-H "Authorization: Bearer your-jwt-token"




