import feedbackApi from "api/feedback";
import { STAR_MEANINGS } from "constants/globals";
import { useEffect, useState } from "react";
import FeedbackForm from "../FeedbackForm";
import FeedbackItem from "../FeedbackItem";

function ReviewItem({ review }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const data = await feedbackApi.get(review._id);
        setFeedbacks(data.feedbacks);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFeedbacks();
  }, [review._id]);

  return (
    <div key={review._id} className="shadow-lg rounded p-4 mb-4 mt-4">
      <div className="d-flex">
        <div>
          <img
            width={80}
            height={80}
            className="rounded-circle"
            style={{ objectFit: "cover" }}
            src={review.userId.image}
            alt={review._id}
          />
        </div>

        <div className="ms-4">
          <div>{`${review.userId.firstname} ${review.userId.lastname}`}</div>
          <div className="d-flex align-items-center">
            {Array.from(Array(review.star).keys()).map((key) => (
              <i key={key} className="bx bxs-star fs-6 text-warning"></i>
            ))}
            <div className="ms-2">
              <code className="text-dark">{STAR_MEANINGS[review.star]}</code>
            </div>
          </div>
          <div className="text-success">
            <i className="bx bx-check"></i>{" "}
            <code className="text-success">Đã mua hàng</code>
          </div>
          <div>{review.content}</div>
        </div>

        <div className="d-flex flex-grow-1 justify-content-end">
          <div className="ms-1">
            {feedbacks.length === 0 && (
              <i
                onClick={() => setShowFeedbackForm(true)}
                className="bx bx-message-dots text-info me-1 fs-4"
              ></i>
            )}
            <i className="bx bx-trash text-danger fs-4" />
          </div>
        </div>
      </div>

      {feedbacks.map((feedback, index) => (
        <FeedbackItem
          key={feedback._id}
          feedback={feedback}
          feedbacks={feedbacks}
          index={index}
          setShowFeedbackForm={setShowFeedbackForm}
        />
      ))}

      <FeedbackForm
        showFeedbackForm={showFeedbackForm}
        setShowFeedbackForm={setShowFeedbackForm}
      />
    </div>
  );
}

export default ReviewItem;
