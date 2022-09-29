import { PRODUCT_TOAST_OPTIONS } from "constants/globals";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Badge, Button, Container, Form, Input, Spinner } from "reactstrap";

function FeedbackForm({
  showFeedbackForm,
  setShowFeedbackForm,
  onAddFeedback,
  onUpdateFeedback,
  feedbackLoading,
  feedback,
  isNested,
  isEditUpdateFeedbackForm,
}) {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (isEditUpdateFeedbackForm) {
      setContent(feedback.content);
    } else {
      setContent("");
    }
  }, [isEditUpdateFeedbackForm, feedback.content]);

  const handleAddFeedback = async (e) => {
    e.preventDefault();
    if (content.trim().length === 0) {
      toast("Please check feedback content...", { ...PRODUCT_TOAST_OPTIONS });
      return;
    }
    if (!isEditUpdateFeedbackForm) {
      let data;
      if (isNested) {
        data = { content, feedbackId: feedback._id };
      } else {
        data = { content };
      }
      await onAddFeedback(data);
    }

    if (isEditUpdateFeedbackForm) {
      await onUpdateFeedback({ content });
    }

    setShowFeedbackForm(false);
    setContent("");
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {showFeedbackForm && (
        <Container className="px-0">
          <Form
            onSubmit={handleAddFeedback}
            className="mt-2 shadow p-4 rounded"
          >
            <h5>
              {!isEditUpdateFeedbackForm ? (
                <div>
                  <code className="text-dark fw-bold me-2">Reply</code>
                  <Badge className="bg-dark">
                    {" "}
                    <code className="text-white">
                      {feedback?.userId
                        ? `@${feedback?.userId?.firstname} ${feedback?.userId?.lastname}`
                        : `@${feedback?.employeeId?.firstname} ${feedback?.employeeId?.lastname}`}
                    </code>
                  </Badge>
                </div>
              ) : (
                <code className="text-dark fw-bold me-2">Update Feedback</code>
              )}
            </h5>
            <Input
              required
              type="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your feedback..."
            />

            <div className="ms-auto mt-4 d-flex justify-content-end">
              <Button
                disabled={feedbackLoading}
                type="submit"
                className="btn btn-dark btn-sm"
              >
                {isEditUpdateFeedbackForm ? "Update Feedback" : "Send Feedback"}
                {feedbackLoading && <Spinner size="sm">Loading</Spinner>}
              </Button>
              <Button
                disabled={feedbackLoading}
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
