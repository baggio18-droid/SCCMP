const request = require("supertest");
const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const app = express();

// Mock the Complaint model and other dependencies if needed
jest.mock("../models/complaint", () => ({
  find: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

// Define test cases for the controller functions
describe("Dashboard Controller Test", () => {
  it("should render the dashboard view", async () => {
    const req = {};
    const res = { render: jest.fn() };

    dashboardController.getAllComplaints = jest.fn().mockResolvedValue([]);

    await dashboardController.dashboardView(req, res);

    expect(res.render).toHaveBeenCalledWith("dashboard", {
      user: undefined, // Assuming no user data is passed for this test case
      complaints: [], // Assuming getAllComplaints returns an empty array for this test case
    });
  });

  it("should handle complaint deletion and redirect to dashboard", async () => {
    const complaintId = "test-complaint-id";
    const req = { params: { id: complaintId } };
    const res = { redirect: jest.fn() };

    const deleteMock = jest.fn().mockResolvedValue();
    require("../models/complaint").findByIdAndDelete = deleteMock;

    await dashboardController.deleteComplaint(req, res);

    expect(deleteMock).toHaveBeenCalledWith(complaintId);
    expect(res.redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("should send an email and redirect to dashboard", async () => {
    const mockRequestBody = {
      email: "test@example.com",
      subject: "Test Subject",
      description: "Test Description",
    };

    const req = { body: mockRequestBody };
    const res = { redirect: jest.fn() };
    const sendMailMock = jest.fn().mockResolvedValue();
    jest.mock("nodemailer", () => ({
      createTransport: jest.fn().mockReturnValue({
        sendMail: sendMailMock,
      }),
    }));

    await dashboardController.sendEmail(req, res);

    expect(sendMailMock).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("should handle errors in sendEmail function", async () => {
    const mockRequestBody = {
      email: "test@example.com",
      subject: "Test Subject",
      description: "Test Description",
    };

    const req = { body: mockRequestBody };
    const res = { sendStatus: jest.fn() };
    const sendMailMock = jest.fn().mockRejectedValue(new Error("Mock Error"));
    jest.mock("nodemailer", () => ({
      createTransport: jest.fn().mockReturnValue({
        sendMail: sendMailMock,
      }),
    }));

    await dashboardController.sendEmail(req, res);

    expect(sendMailMock).toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });
});
