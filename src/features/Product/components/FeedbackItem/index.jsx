import { useState } from "react";
import { Badge } from "reactstrap";
import { format } from "timeago.js";
import FeedbackForm from "../FeedbackForm";

function FeedbackItem({
  review,
  feedback,
  user,
  setRemoveConfirmModal,
  setSelectedFeedback,
  feedbackLoading,
  onAddFeedback,
  onUpdateFeedback,
  isEditUpdateFeedbackForm,
  setIsEditUpdateFeedbackForm,
}) {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const toggleFeedBackForm = (e) => {
    e.stopPropagation();
    setIsEditUpdateFeedbackForm(false);
    setShowFeedbackForm(!showFeedbackForm);
  };

  const toggleFeedBackUpdateForm = (e) => {
    e.stopPropagation();
    setIsEditUpdateFeedbackForm(true);
    setShowFeedbackForm(!showFeedbackForm);
    setSelectedFeedback(feedback);
  };

  const handleRemoveFeedback = (e) => {
    e.stopPropagation();
    setSelectedFeedback(feedback);
    setRemoveConfirmModal(true);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div
        className="d-flex mt-2 pb-2"
        style={{ marginLeft: "80px", borderBottom: "1px solid #dedede" }}
      >
        <div>
          {(feedback?.userId?.image || feedback?.employeeId?.image) && (
            <img
              width={60}
              height={60}
              className="rounded-circle"
              style={{ objectFit: "cover" }}
              src={feedback?.userId?.image || feedback?.employeeId?.image}
              alt={feedback?.userId?.image || feedback?.employeeId?.image}
            />
          )}

          {!feedback?.userId?.image && !feedback?.employeeId?.image && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#000",
                color: "#fff",

                fontWeight: "bolder",
                fontSize: "38px",
              }}
            >
              <code className="text-white">
                {feedback?.userId?.firstname[0]}
              </code>
            </div>
          )}
        </div>

        <div className="ms-3">
          {review?.userId &&
            !feedback?.employeeId &&
            review?.userId?._id !== feedback?.userId?._id && (
              <div>
                <code className="fw-bold text-dark">{`${feedback?.userId?.firstname} ${feedback?.userId?.lastname}`}</code>
                <code className="text-secondary ms-2">
                  {format(feedback?.updatedAt)}
                </code>
              </div>
            )}

          {feedback?.employeeId && (
            <div>
              <code className="fw-bold text-dark">{`${feedback?.employeeId?.firstname} ${feedback?.employeeId?.lastname}`}</code>
              <code className="text-secondary ms-2">
                {format(feedback?.updatedAt)}
              </code>
            </div>
          )}

          {review?.userId?._id === feedback?.userId?._id && (
            <div>
              <Badge>{`${feedback?.userId?.firstname} ${feedback?.userId?.lastname}`}</Badge>
              <code className="text-secondary ms-2">
                {format(feedback?.updatedAt)}
              </code>
            </div>
          )}

          {feedback.employeeId && (
            <code className="fw-bold">
              <i className="bx bxs-face text-dark"></i> Administrators
            </code>
          )}

          {review.userId && !feedback.employeeId && (
            <div className="text-success">
              <i className="bx bx-check"></i>{" "}
              <code className="text-success">Đã mua hàng</code>
            </div>
          )}

          <div>
            <code
              className="fw-bold text-primary me-2 position-relative"
              style={{ top: "-1px" }}
            >
              {feedback?.feedbackId?.userId &&
                `@${
                  feedback?.feedbackId
                    ? feedback?.feedbackId?.userId?.firstname +
                      " " +
                      feedback?.feedbackId?.userId?.lastname
                    : feedback?.reviewId?.userId?.firstname +
                      " " +
                      feedback?.reviewId?.userId?.lastname
                }`}

              {feedback?.feedbackId?.employeeId &&
                `@${
                  feedback?.feedbackId
                    ? feedback?.feedbackId?.employeeId?.firstname +
                      " " +
                      feedback?.feedbackId?.employeeId?.lastname
                    : feedback?.reviewId?.employeeId?.firstname +
                      " " +
                      feedback?.reviewId?.employeeId?.lastname
                }`}
            </code>

            {feedback?.content}
          </div>
        </div>

        <div className="d-flex flex-grow-1 justify-content-end">
          <div className="ms-1">
            {user?._id && (
              <i
                onClick={toggleFeedBackForm}
                className="bx bx-message-dots text-dark me-1 fs-4"
              ></i>
            )}
            {user?._id && user?._id === feedback?.userId?._id && (
              <i
                onClick={toggleFeedBackUpdateForm}
                className="bx bx-edit text-info me-1 fs-4"
              ></i>
            )}
            {user?._id && user?._id === feedback?.userId?._id && (
              <i
                onClick={handleRemoveFeedback}
                className="bx bx-trash text-danger fs-4"
              />
            )}
          </div>
        </div>
      </div>
      <div style={{ marginLeft: "80px" }} onClick={(e) => e.stopPropagation()}>
        <FeedbackForm
          isNested={true}
          isEditUpdateFeedbackForm={isEditUpdateFeedbackForm}
          feedback={feedback}
          feedbackLoading={feedbackLoading}
          onAddFeedback={onAddFeedback}
          onUpdateFeedback={onUpdateFeedback}
          showFeedbackForm={showFeedbackForm}
          setShowFeedbackForm={setShowFeedbackForm}
        />
      </div>
    </div>
  );
}

export default FeedbackItem;
