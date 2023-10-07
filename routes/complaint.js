const express = require("express");

const {
    complaintView,
    complaintInput,
    getAllComplaints,
   

} = require("../controllers/complaintController");




const router = express.Router();

router.get("/complaint", complaintView);
router.post("/submit-complaint", complaintInput);
router.get('/complaints', getAllComplaints);


//router.get("/dashboard", getAllComplaints);

module.exports = router;
