import userModel from "../model/userModel.js";
import hashPassword, { comparePassword } from "../helper/authhelper.js";
import JWT from "jsonwebtoken";
import orderModel from "../model/orderModel.js";

export const registerController = async (req, res) => {
  try {
    const { name, password, email, address, phone, answer } = req.body;

    //Validation
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone Number is Required" });
    }
    if (!answer) {
      return res.send({ message: "Please Tell us your favourite song" });
    }

    //Existing
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(201).send({
        success: false,
        message: " User Already Exist",
      });
    }

    // Registration
    const hashedPassword = await hashPassword(password);

    //Save User
    const user = await new userModel({
      name,
      email,
      address,
      phone,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: " User Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(`Error in Registration ${error}`);
    res.status(500).send({
      success: false,
      message: "Error in Registration ppp",
      error,
    });
  }
};

// Login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    //user validation
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User doesnot Exist",
      });
    }

    //Matching Password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Incorrect Password",
      });
    }
    //Next Token creation
    const token = await JWT.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "User Loged in Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(`Error in Login ${error}`);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

/*forgotPasswordController */

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({
        message: "Email is Required to change Password ",
      });
    }
    if (!answer) {
      res.status(400).send({
        message: "Answer is Required to change Password ",
      });
    }
    if (!newPassword) {
      res.status(400).send({
        message: "Enter New Password ",
      });
    }

    //Validation

    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Invalid Email or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

/*Test middleware */
export const testController = (req, res) => {
  console.log("Protected ");
};

//Profile Update
export const updateProfile = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);

    if (password && password.length < 1) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updateUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        address: address || user.address,
        phone: phone || user.phone,
        password: hashedPassword || user.password,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "User Updated Successfully",
      updateUser,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in Update Profile Controller",
    });
  }
};

/*Order Controller */
export const orderController = async (req, res) => {
  try {
    const order = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(order);
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in Order Controller",
    });
  }
};

export const AllorderController = async (req, res) => {
  try {
    const order = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(order);
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in Admin Order Controller",
    });
  }
};

//Upadte Status
export const updateOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

//export default { registerController, loginController };
