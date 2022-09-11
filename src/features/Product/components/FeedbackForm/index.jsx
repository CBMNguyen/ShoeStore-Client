import React from "react";
import { Button, Container, Form, Input } from "reactstrap";

function FeedbackForm({ showFeedbackForm, setShowFeedbackForm }) {
  return (
    <div>
      {showFeedbackForm && (
        <Container className="px-0">
          <Form className="mt-4 shadow p-4 rounded">
            <h5>Add Feedback</h5>
            <Input type="textarea" placeholder="Enter your review..." />

            <div className="ms-auto mt-4 d-flex justify-content-end">
              <Button className="btn btn-dark btn-sm">Send Feedback</Button>
              <Button
                onClick={() => setShowFeedbackForm(false)}
                className="btn btn-dark btn-sm ms-2"
              >
                Close
              </Button>
            </div>
          </Form>
        </Container>
      )}
    </div>
  );
}

export default FeedbackForm;
