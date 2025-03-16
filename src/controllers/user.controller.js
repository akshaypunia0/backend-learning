import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const registerUser = asyncHandler( async (req, res) => {

    console.log("Register user file running");
    
    
    // get the user data from the frontend
    // Validations on password or .. not empty, username, email and more
    // Check if user already exist : username and email
    // ckeck for images, check for avatar
    // If available, upload to cloudnary, avatar 
    // create user object - create db entry
    // remove pass and refresh token field from response
    // check for user creation, if proper created user response sent to frontend
    // return response


    const { userName, email, fullName, password } = req.body   // getting data from frontend

    console.log("given Email is: ", email);


    // Checking if any required is empty

    // if (fullName === "") { //Best way for beginners but it requires lots of if statements
    //     throw new ApiError(400, "Fullname is required")
    // }


    if (
        [userName, email, fullName, password].some((field) => 
        field?.trim() === ""
        )  // some method return boolean, if it return true in any case means one of them field is empty
    ) {
        throw new ApiError(400, "Fullname is required")
    }



    // Checking if user already registered

    //User is created by mongoose so it can directly contact to db to check if any user exist with this username or email

    const existedUser = User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with this email or username already exist")
    }



    // Checking for images and avatar

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is compulsory")
    }



    // creating User object and create db entry

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        userName: userName.toLowerCase(),
        email,
        password
    })


    // // remove pass and refresh token field from response and checking if user successfully created

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering a user")
    }



    // returning the response

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )


})


export { registerUser }