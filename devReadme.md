# Hello, fellow developers!

- My .env file

    ```env
    IP=http://localhost
    PORT=3009
    MONGODB_URL=mongodb://localhost:27017
    DB_NAME=DoseMinder
    ```

## Models

- Database Model

    ```database
    Import User, Profile, ABuddy, Drug, and Medication models

    Load environment variables from .env file

    Create a connection to MongoDB using the URL from environment variables

    Define models object with User, Profile, ABuddy, Drug, and Medication models

    Export models
    ```

- User Model

    ```user
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
    ```

- Profile Model

    ```profile
    Import mongoose for MongoDB interactions

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
    ```

- ABuddy Model

    ```aBuddy
    Import mongoose for MongoDB interactions

    Define a mongoose schema for aBuddy with the following fields:
    - aBuddyFirstName: a unique string that is required
    - aBuddyLastName: a unique string that is required
    - aBuddyRelation: a unique string that is required
    - aBuddyEmail: a unique string that is required
    - aBuddyNumber: a string that is required

    Define a mongoose model 'aBuddy' using aBuddySchema and 'aBuddy' collection
    ```

- Drug Model

    ```drug
    Import mongoose for MongoDB interactions

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
    ```

- Medication Model

    ```medication
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
    ```