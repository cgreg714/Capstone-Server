# Hello, fellow developers!

## My .env file

    ```env
    IP=http://localhost
    PORT=3009
    MONGODB=mongodb://localhost:27017
    DB_NAME=DoseMinder
    ```

## db.js
    Import the mongoose library
    Get the MONGODB and DB_NAME values from the environment variables

    Define an asynchronous function named db
        Try the following operations
            Use mongoose to connect to the MongoDB database
        If there's an error during the connection
            Throw a new Error with the error message

## index.js
    Load environment variables from .env file
    
    Import necessary modules and libraries

    Create an instance of express application

    Define configuration variables from environment variables

    Import data loading function

    Import route handlers

    Import error handling middleware

    Import database connection helper

    Connect to the database
        If connection is successful, log a success message and load data
        If connection fails, log the error

    Set up middleware to parse JSON

    Set up routes for different endpoints

    Set up error handling middleware

    Start the server and listen on the specified port
        Log a message indicating the server is running


## errorResponse helper

    - Define a function named errorResponse that takes two parameters: res and err
        - Set the HTTP status code of the response to 500 (Internal Server Error)
        - Send a response with the error message

    - Define a function named successResponse that takes two parameters: res and results
        - Set the HTTP status code of the response to 200 (OK)
        - Send a JSON response with the results

    - Define a function named incompleteResponse that takes one parameter: res
        - Set the HTTP status code of the response to 404 (Not Found)
        - Log the error to the console and send the response


## Models

### Database Model

    Import User, Profile, ABuddy, Drug, and Medication models

    Load environment variables from .env file

    Create a connection to MongoDB using the URL from environment variables

    Define models object with User, Profile, ABuddy, Drug, and Medication models

### User Model

    Import Joi for data validation
    Import mongoose for MongoDB interactions
    Import bcrypt for password hashing

    Define a Joi schema that requires:
        - a username that is alphanumeric, between 8 and 30 characters
        - a password that matches a specific pattern and is between 3 and 30 characters
        - an email that is a valid email format

    Define a mongoose schema for User with the following fields:
        - username: a unique string that is required
        - password: a string that is required
        - email: a unique string that is required
        - role: a string that can be 'admin', 'sponsor', or 'user', defaulting to 'user'
        - avatar: a string
        - resetPasswordToken: a string
        - resetPasswordExpires: a date

    Before saving a User document, if the password field has been modified:
        - hash the password using bcrypt with a salt round of 10
        - replace the plain text password with the hashed password

    Define a method 'verifyPassword' on UserSchema instances that:
        - takes a password as an argument
        - compares the hashed password in the database with the provided password using bcrypt

    Define a mongoose model 'User' using UserSchema and 'users' collection

### Profile Model

    Define a mongoose schema for Doctor with the following fields:
        - firstName: a string that is required
        - lastName: a string that is required

    Define a mongoose schema for Profile with the following fields:
        - firstName: a string that is not required
        - lastName: a string that is not required
        - email: a string
        - pharmacy: a string
        - doctor: an array of DoctorSchema
        - timezone: a string
        - profile_id: an ObjectId that references "profile"

    Define a mongoose model 'Profile' using ProfileSchema and 'profiles' collection

### ABuddy Model

    Define a mongoose schema for aBuddy with the following fields:
        - aBuddyFirstName: a unique string that is required
        - aBuddyLastName: a unique string that is required
        - aBuddyRelation: a unique string that is required
        - aBuddyEmail: a unique string that is required
        - aBuddyNumber: a string that is required

    Define a mongoose model 'aBuddy' using aBuddySchema and 'aBuddy' collection

### Drug Model

    Define a mongoose schema for DrugInteraction with the following fields:
        - 'drugbank-id': a string
        - name: a string
        - description: a string
    Disable automatic generation of _id field

    Define a mongoose schema for DrugProduct with the following fields:
        - name: a string
        - labeller: a string
        - 'dosage-form': a string
        - strength: a string
        - route: a string
        - country: a string
    Disable automatic generation of _id field

    Define a mongoose schema for DrugFoodInteraction with the following fields:
        - 'food-interaction': a string
    Disable automatic generation of _id field

    Define a mongoose schema for DrugExternalLink with the following fields:
        - resource: a string
        - url: a string
    Disable automatic generation of _id field

    Define a mongoose schema for Drug with the following fields:
        - 'drugbank-id': an object with keys '0', '1', '2' and values of type string
        - name: a string
        - description: a string
        - unii: a string
        - indication: a string
        - 'mechanism-of-action': a string
        - products: an array of DrugProductSchema
        - 'food-interactions': an array of DrugFoodInteractionSchema
        - 'drug-interactions': a map of DrugInteractionSchema
        - 'external-links': a map of DrugExternalLinkSchema

    Define a mongoose model 'Drug' using DrugSchema and 'drugDB' collection

### Medication Model

    Define a mongoose schema for Medication with the following fields:
        - name: a string that is required
        - description: a string
        - dosages: a string
        - frequency: a number that is required
        - quantity: a number that is required
        - dateAdded: a date that is required and defaults to the current date
        - prescriber: a string
        - timeOfDay: a string
        - associatedDrug: an array of objects

    Define a mongoose model 'Medication' using MedicationSchema and 'medications' collection