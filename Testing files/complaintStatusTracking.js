const request = require('supertest');
const app = require('../app'); 
const Complaint = require('../models/complaint'); 


const mockComplaints = [
  {
    email: 'user1@example.com',
    status: 'in-progress',
    response: null,
    category: 'Product Quality',
  },
  {
    email: 'user2@example.com',
    status: 'in-progress',
    response: null,
    category: 'Service',
  },
];

describe('Complaints Response Tracking Functionality', () => {
  
  beforeAll(async () => {
    await Complaint.deleteMany({}); 
    await Complaint.create(mockComplaints); 
  });

  // Test case: Fetch the dashboard view
  it('Should fetch the dashboard view', async () => {
    const response = await request(app).get('/dashboard');
    expect(response.status).toBe(200);
  });

  // Test case: Auto-update complaint status upon response submission
  it('Should auto-update complaint status upon response submission', async () => {
    const response = await request(app)
      .post('/dashboard/solve/:complaintId') // Replace :complaintId with a valid complaint ID
      .send({ response: 'Sample response content' });

    // Verify the response status is now "sent" in the database
    const updatedComplaint = await Complaint.findById(response.body.complaintId);
    expect(updatedComplaint.status).toBe('sent');
  });

  // Test case: Update complaint status when admin clicks "Update" button
  it('Should update complaint status when admin clicks "Update" button', async () => {
    const complaint = mockComplaints[0]; // Select a sample complaint to update

    const response = await request(app)
      .post(`/dashboard/solve/${complaint._id}`) // Replace ${complaint._id} with the complaint ID to update
      .send({ response: 'Sample response content' });

    // Verify the response status is now "solved" in the database
    const updatedComplaint = await Complaint.findById(complaint._id);
    expect(updatedComplaint.status).toBe('solved');
  });

  // Test case: Display correct data in the dashboard view
  it('Should display correct data in the dashboard view', async () => {
    const response = await request(app).get('/dashboard');

    // Verify if the data in the response matches the mockComplaints data
    expect(response.body.complaints).toEqual(mockComplaints);
  });

  // Test case: Handle incorrect routes and invalid input gracefully
  it('Should handle incorrect routes and invalid input gracefully', async () => {
    const invalidRouteResponse = await request(app).get('/invalidroute');
    const invalidInputResponse = await request(app).post('/dashboard/solve/invalidid');

    // Verify if the responses return the appropriate error status codes
    expect(invalidRouteResponse.status).toBe(404);
    expect(invalidInputResponse.status).toBe(500);
  });
});
