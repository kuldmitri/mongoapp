To start it is necessary 
1. To start Mongodb
2. Specify the environment variables in the .env file in the root of project:
    a. port - port number that will listen to the server    
    b. urlMongodb - server address specifying the database
3. Run node app.js in the terminal
4. Using the browser go to the port listening to the server

The application allows you to create and edit a database containing:
1. A collection of books stored in the library
2. A collection of users registered in the library

The application allows you to search for books by name and author, make a note in the database about the time of issue and the id of the reader who took the books. And also remove these marks when you return the book.

To start app use:
1. Node.js version 6.11.5
2. MongoDB version 3.4.9
3. npm version 3.10.10