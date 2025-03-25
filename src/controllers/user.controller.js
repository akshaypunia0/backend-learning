import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const generateAccesAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}

const registerUser = asyncHandler(async (req, res) => {

    console.log("Register user running");


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

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with this email or username already exist")
    }



    // Checking for images and avatar

    // const avatarLocalPath = req.files?.avatar[0]?.path
    // let coverImageLocalPath = req.files?.coverImage[0]?.path

    let avatarLocalPath;

    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path
    }

    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }



    if (!avatarLocalPath || avatarLocalPath === undefined || avatarLocalPath === null) {
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


const loginUser = asyncHandler(async (req, res) => {

    console.log("Login user running");


    // extract data from req.body
    // username or email
    // find the user
    // check password
    // generate access and refresh token and send to user
    // send cookies
    // response success login


    const { email, userName, password } = req.body

    if (!userName || !email) {
        throw new ApiError(400, "email or username is requird")
    }

    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User not found with this email or username")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Password incorrect")
    }

    const {accessToken, refreshToken} = await generateAccesAndRefreshToken(user._id)
    
    const loggedInUser = await User.findOne(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,  accessToken, refreshToken
            },
            "User loggedin successfully"
        )
    )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged out")
    )
})





export {
    registerUser,
    loginUser,
    logoutUser
}