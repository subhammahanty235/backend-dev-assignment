
const User = require('../model/User.model')
const LastLogin = require('../model/UserActivity.model')
const UpdatedFields = require('../model/UserUpdatedData.model')
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

const logIn = async (req, res) => {
    const { email, password } = req.body
    try {

        const find_user_withemail = await User.findOne({ email: email })

        if (!find_user_withemail) {
            return res.status(404).json({ error: "Please try to log in with correct credentials" });
        }
        let compare_passwords = await bcrypt.compare(password, find_user_withemail.password)
        if (!compare_passwords) {
            return res.status(404).json({ error: "Please try to log in with correct credentials" });
        }

        const data = {
            user: {
                id: find_user_withemail.id           //only adding the id to the token
            }
        }
        // add login time to the Last Login data's database
        await LastLogin.updateOne({ _id: find_user_withemail.id }, { lastLoginTime: new Date() },
            { upsert: true, new: true })

        // generate token

        const generated_token = jwt.sign(data, process.env.JWT_SECRET)


        if (!generated_token) {
            return res.status(404).json({ error: "Error occured while generating your token , Try again later!" });
        }
        res.status(201).json({ message: "Login Successful", instruction: "Provide this token in the header which calling a API", authtoke: generated_token })
    } catch (error) {
        res.status(500).send("internal server error")
    }

}

const updateUser = async (req, res) => {

    try {
        const userId = req.params.id; // Get the user ID from the request parameters
        const currentUserId = req.user.id;
        const updatedata = req.body;
        const fieldstoUpdate = Object.keys(req.body);


        // Check if the current user is authorized to update the user
        const current_user_role = await User.findOne({ _id: currentUserId }).select("role")

        const userToUpdate = await User.findById(userId).select("-password");
        if (!userToUpdate) {
            return res.status(404).send({ message: 'User not found' });
        }
        if (current_user_role === 'User' && userToUpdate.role === 'Admin') {
            return res.status(403).send({ message: 'You are not authorized to update an Admin user' });
        }

        // Remove password field if present in the update fields
        if (updatedata.hasOwnProperty('password')) {
            delete updatedata.password;
        }

        // Update the user's information
        const updatedUser = await User.findByIdAndUpdate(userId, updatedata, { new: true });
        if (!updatedUser) {
            return res.status(404).send({ message: 'User not found' });
        }
        // add data to the Updatedata database collection
        const updatedField = new UpdatedFields({
            userId: userId,
            role: userToUpdate.role,
            email: userToUpdate.email,
            field: fieldstoUpdate,
            oldValue: userToUpdate,
            newValue: updatedata
        });
        updatedField.save();
        res.status(200).send(updatedUser);

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
};

const viewUsers = async (req, res) => {
    const userid = req.user.id

    const userrole = await User.Findone({ _id: userid }).select("role")

    if (userrole === "Admin") {
        const result = await LastLogin.aggregate([
            {
                $lookup: {
                    from: "updatedatas",
                    localField: "userId",
                    foreignField: "userId",
                    as: "UpdatedData"
                }
            },
            {
                $project: {
                    _id: 0,
                    userid: 1,
                    lastLoginTime: 1,
                    updatedData: {
                        $map: {
                            _id: 0,
                            userId: 1,
                            lastLoginTime: 1,
                            updatedData: {
                                $map: {
                                    input: "$inputData",
                                    as: "data",
                                    in: {
                                        email: "$$data.email",
                                        role: "$$data.role",
                                        fieldschanged: "$$data.fieldschanged",
                                        oldValue: "$$data.oldValue",
                                        newValue: "$$data.newValue",
                                        updatedTime: "$$data.updatedTime"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ]);

        res.send(result)


    }
    else{
        
    }

}



