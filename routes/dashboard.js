const express = require('express');
const router = express.Router();
const { getAllComplaints, dashboardView } = require('../controllers/dashboardController');
const { protectRoute } = require('../auth/protect');
const {         deleteComplaint,
        sendEmail, updateUser, deleteSentEmail,solveComplaint} = require("../controllers/dashboardController");



// Dashboard route, accessible only to authenticated users

//Dashboard
router.post("/delete-complaint/:id", protectRoute, deleteComplaint);
router.post('/send-email', protectRoute, sendEmail);
router.post('/update-user/:id', protectRoute, updateUser);
router.post('/delete-sent-email/:id', deleteSentEmail);
router.post('/solve/:id', protectRoute, solveComplaint);

router.get("/", protectRoute, async (req, res) => {
    try {
        const sentEmailsLog  = await SentEmail.find({ });
        dashboardView(req, res, sentEmailsLog );
    }catch (error) {
        console.error(error);
        res.sendStatus(500);
}
});

module.exports = router;