const request = require("supertest");
const express = require("express");
const complaintsController = require("../controllers/complaintController");

const app = express();

// Mock the complaint model and other dependencies if needed

// Define test cases for the controller functions
describe("Complaint Controller Test", () => {
  it("should render the complaint view", async () => {
    const req = {};
    const res = { render: jest.fn() };

    await complaintsController.complaintView(req, res);

    expect(res.render).toHaveBeenCalledWith("complaint", {});
  });

  it("should handle complaint input and respond with appropriate status code", async () => {
    const mockComplaintData = {
      name: "John Doe",
      email: "john@example.com",
      transactionNumber: "12345",
      complaintDescription: "This is a test complaint",
    };

    const req = { body: mockComplaintData };
    const res = { render: jest.fn(), sendStatus: jest.fn() };

    // Mock the Complaint model's create method if needed

    await complaintsController.complaintInput(req, res);

    // Add your assertions here
    expect(res.sendStatus).toHaveBeenCalledWith(200);
  });

  it("should get all complaints and render the dashboard", async () => {
    const mockComplaints = [
      { name: "Jsmes", email: "james@gmail.com", complaintDescription: "Test complaint 1" },
      { name: "Jane Smith", email: "jane@gmail.com",transactionNumber:"123", complaintDescription: "Test complaint 2" },
    ];

    const req = {};
    const res = { render: jest.fn() };

    // Mock the Complaint model's find method to return the mock complaints

    await complaintsController.getAllComplaints(req, res);
    expect(res.render).toHaveBeenCalledWith("dashboard", { complaints: mockComplaints });
  });
});

module.exports = app;
