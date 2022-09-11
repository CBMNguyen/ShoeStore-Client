function FeedbackItem({ feedback, feedbacks, index, setShowFeedbackForm }) {
  return (
    <div
      className="d-flex mt-2 pb-2"
      style={{ marginLeft: "100px", borderBottom: "1px solid #dedede" }}
    >
      <div>
        <img
          width={60}
          height={60}
          className="rounded-circle"
          style={{ objectFit: "cover" }}
          src={feedback.userId.image}
          alt={feedback.userId.image}
        />
      </div>

      <div className="ms-4">
        <div>{`${feedback.userId.firstname} ${feedback.userId.lastname}`}</div>
        <code className="">Administrators</code>

        <div>{feedback.content}</div>
      </div>

      {index + 1 === feedbacks.length && (
        <div className="d-flex flex-grow-1 justify-content-end">
          <div className="ms-1">
            <i
              onClick={() => setShowFeedbackForm(true)}
              className="bx bx-message-dots text-info me-1 fs-4"
            ></i>
            <i className="bx bx-trash text-danger fs-4" />
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackItem;
