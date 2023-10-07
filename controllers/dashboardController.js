const Complaint = require('../models/complaint');
const { classifier, preprocessText } = require('../training/model_training');
const nodemailer = require('nodemailer');
const userController = require('./userController');
const User = require('../models/user');
const Swal = require('sweetalert2');
const sentEmailModel = require('../models/sentEmail');

const dashboardView = async (req, res) => {
  try {
    // Authenticate user first (using protectRoute middleware or any other method you use)
    // ...

    // Call getAllComplaints to fetch the complaints data
    const complaints = await getAllComplaints();
    const users = await userController.getAllUsers();
    const sentEmailsLog = await sentEmailModel.find({});
    
    res.render("dashboard", {

      complaints: complaints,  
      dashboardTableData: users,
      sentEmailsLog: sentEmailsLog, // Include any user data you want to pass to the view
         // Pass the fetched complaints data to the view
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const getAllComplaints = async () => {
  const complaints = await Complaint.find({});
  return complaints;
};

const deleteComplaint = async (req, res) => {
  const complaintId = req.params.id;

  try {
    await Complaint.findByIdAndDelete(complaintId);
    res.redirect("/dashboard?section=complaints");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const logout = (req, res) => {
  req.logout();
  res.redirect("/login");
};
const sendEmail = async (req, res) => {
  const { email, subject, description, complaintId } = req.body;
  // console.log('Email:', email);
  // console.log('Subject:', subject);
  // console.log('Description:', description);

  try {
   
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "bryantrakotoarimanana18@gmail.com",
        pass: "bhjuhammijwvdfkr",
        authMethod: 'PLAIN',
      },
    });

    // Define the email options
    const mailOptions = {
      from: "bryantrakotoarimanana18@gmail.com",
      to: email,
      subject: subject,
      text: description,
    };
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    await Complaint.findByIdAndUpdate(
       complaintId,
      {
        status: "Sent",
      },
      { new: true }
    );
    const sentEmail = new sentEmailModel( {
      email,
      subject,
      description,
      timestamp: new Date(), // Add a timestamp for reference
    });
  

    await sentEmail.save();
    res.redirect("/dashboard?section=complaints");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

// controllers/dashboardController.js
const deleteSentEmail = async (req, res) => {
  const sentEmailId = req.params.id;

  try {
    // Find the sent email in the database based on the provided ID
    const sentEmail = await sentEmailModel.findById(sentEmailId);

    if (!sentEmail) {
      return res.status(404).json({ error: 'Sent email not found' });
    }
    //console.log('Found sent email:', sentEmail);
    const result = await sentEmailModel.deleteOne({ _id: sentEmailId });
    // Delete the sent email from the database
    console.log('Delete result:', result);

    req.flash('success_msg', 'Sent email deleted successfully');

    res.redirect('/dashboard?section=inbox');
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the sent email' });
  }
};

const solveComplaint = async (req, res) => {
  const complaintId = req.params.id;
  console.log('Complaint ID:', complaintId);
  try {
    await Complaint.findByIdAndUpdate(
      complaintId,
      {
        solved: true,
      },
      { new: true }
    );
    res.redirect("/dashboard?section=complaintStatusTable");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
  
};

const updateUser = async (req, res) => {
  // Extract the updated user data from the form submission
  const { name, email, password } = req.body;

  try {
    // Find the user in the database based on the provided ID
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's name, email, and password (if provided)
    user.name = name;
    user.email = email;
    if (password) {
      user.password = password;
    }

    // Save the updated user to the database
    await user.save();

    req.flash('success_msg', 'User updated successfully');

    res.redirect('/dashboard?section=users');
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the user' });
    }
};


module.exports = {
  dashboardView,
  deleteComplaint,
  sendEmail,
  logout,
  updateUser,
  deleteSentEmail,
  solveComplaint
};