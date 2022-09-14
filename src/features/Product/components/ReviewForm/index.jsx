import { useState } from "react";
import { Button, Container, Form, Input } from "reactstrap";
import Rating from "../Rating";

ReviewForm.propTypes = {};

function ReviewForm(props) {
  const [showReviewForm, setShowReviewForm] = useState(false);

  return (
    <Container className="px-0">
      <h5 className="mb-0">New Reviews</h5>
      <code className="text-secondary">
        Only the people who bought the product can rate the product
      </code>
      <Button
        onClick={() => setShowReviewForm(true)}
        className="btn btn-dark border-5 d-block mt-2 shadow"
      >
        Create a review
      </Button>

      {showReviewForm && (
        <Form className="mt-4 shadow p-4 rounded">
          <div className="my-2">
            Select evaluation <Rating stars={4} />
          </div>
          <Input type="textarea" placeholder="Enter your review..." />

          <div className="ms-auto mt-4 d-flex justify-content-end">
            <Button className="btn btn-dark btn-sm shadow">Send Review</Button>
            <Button
              onClick={() => setShowReviewForm(false)}
              className="btn btn-dark btn-sm ms-2 shadow"
            >
              Close
            </Button>
          </div>
        </Form>
      )}
    </Container>
  );
}

export default ReviewForm;
