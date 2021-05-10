/**
 * User Model
 * filename: User.js
 * Steps to create a model:
 * 1. call mongoose data modelling module
 * 2. call Schema object and create a schema object 
 * 3. declare the Schema as a model
 * 4. export it
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create a Schema 
const userSchema = new Schema({
    name: String,
    age: Number,
    email: String,
    gender: String,
    password: String, // 1234->hash(1234)->D128761872avsvasfcaD
    country: String,
    salary: Number,
    role: Boolean // true/false
})

// declare Schema as a model
const User = mongoose.model('User', userSchema) 
// users collection will create
// export User Model
module.exports = User; 

