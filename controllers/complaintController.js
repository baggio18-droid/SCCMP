const Complaint = require('../models/complaint');
const { classifier, preprocessText } = require('../training/model_training');

//const {preprocessText} = require('../training/model_training');


const complaintView = ( req, res) => {
    res.render("complaint",{} );
}


const complaintInput = (req, res) => {
    const { name, email, transactionNumber, complaintDescription } = req.body;

    
    const processedComplaintDescription = preprocessText(complaintDescription); 
    // Assuming you have a preprocessText function

  // Classify the complaint description using the trained model
    const predictedCategory = classifier.categorize(processedComplaintDescription);
  
    // Create a complaint object with the required fields
    const complaintData = {
      name,
      email,
      complaintDescription,
      predictedCategory
    };
  
    // Add the transactionNumber field if it exists and is not empty
    if (transactionNumber && transactionNumber.trim() !== '') {
      complaintData.transactionNumber = transactionNumber;
    }
  
    // Save the complaint to the "complaints" collection
    Complaint.create(complaintData)
      .then(() => {
        // Data successfully saved to the database
        res.render("results")
      })
      .catch((error) => {
        // Handle the error
        console.error(error);
        res.sendStatus(500);
      });
  };
  
  const getAllComplaints = async (req, res) => {
    console.log("getAllComplaints function called!"); // Add this line to check if the function is called
    const complaints = await Complaint.find({}, { _id: 0 });
    //console.log(complaints); // Output the fetched complaints to the console for debugging purposes
    res.render('dashboard', { complaints });
  };
  
 
 
  
  module.exports = {
    complaintView,
    complaintInput,
    getAllComplaints,
    //deleteComplaint,
    //sendEmail
};
  