
const User = require('../model/User.model')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")


const adduserorAdmin = async (req, res) => {

    // fetch user details(who is trying to add the user)
    const currentuserId = req.user.id

    // get user's current role

    const user_role = await User.findOne({ _id: currentuserId }).select("role")


    // All required fields are provided?
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password || !req.body.role) {
        return res.status(400).json({ message: 'All mandatory fields are required' });
    }

    // Length of password is correct?
    if (req.body.password.length < 6 || req.body.password.length > 12) {
        return res.status(400).json({ message: 'Password should have 6 to 12 characters' });
    }

    // User provided the confirm password?
    if (!req.body.confirmPassword) {
        return res.status(400).json({ message: 'Confirm password is required' });
    }

    // password and confirm password are same or not?
    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({ message: 'Password and confirm password do not match' });
    }

    // Check if user's role is 'User' and user is trying to add Admin , which is not allowed
    if (user_role === 'User' && req.body.role === 'Admin') {
        return res.status(403).json({ message: 'You are not authorized to add an Admin' });
    }


    // Create a new user object
    const newUser = new User({
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        department: req.body.department
    });

    // Save the new user to the database
    newUser.save((err, user) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(201).json({ message: 'User added successfully', user });
    });


};

// login function , to allow user or admin login with their credentials provided by the admin or Another User , and after login is successfull a token will generate which will allow them to perform other operations

