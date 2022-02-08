//will add a userservice class here that will have a create/sign in methods
//the create method will take in firstName, lastName, email, and password
//and will use bcrypt to pass the input password to the hashing algorithm
//then we'll call our user model, with the insert method, and create (then return) our user with the hashed password (NEVER store plain text passwords. EVER.)