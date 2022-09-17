import feedbackApi from "api/feedback";
import { PRODUCT_TOAST_OPTIONS, STAR_MEANINGS } from "constants/globals";
import { useEffect, useState } from "react";
import FeedbackForm from "../FeedbackForm";
import FeedbackItem from "../FeedbackItem";
import { format } from "timeago.js";
import { toast } from "react-toastify";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import { Link } from "react-router-dom";
import brandLogo from "../../../../assets/images/brandLogo.png";
import ReviewForm from "../ReviewForm";

function ReviewItem({
  product,
  review,
  user,
  setSelectedReview,
  setModal,
  showReviewUpdateForm,
  setShowReviewUpdateForm,
  updateReviewLoading,
  onReviewUpdateFormSubmit,
}) {
  const [feedbacks, setFeedbacks] = useState([]);
  console.log(feedbacks);
  const [showFeedback, setShowFeedback] = useState(false);

  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const [removeConfirmModal, setRemoveConfirmModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState();

  const [isEditUpdateFeedbackForm, setIsEditUpdateFeedbackForm] =
    useState(false);

  const toggle = () => {
    setShowFeedback(!showFeedback);
  };

  const toggleFeedBackForm = (e) => {
    e.stopPropagation();
    setShowFeedbackForm(!showFeedbackForm);
  };
  const toggleReviewUpdateForm = (e) => {
    e.stopPropagation();
    setSelectedReview(review);
    setShowReviewUpdateForm(!showReviewUpdateForm);
  };

  const toggleRemoveModal = (e) => {
    e.stopPropagation();
    setRemoveConfirmModal(!removeConfirmModal);
  };

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

  const handleRemoveReview = (e) => {
    e.stopPropagation();
    setSelectedReview(review);
    setModal(true);
  };

  const handleAddReviewFeedback = async (data) => {
    data.userId = user._id;
    data.productId = product._id;
    data.reviewId = review._id;
    try {
      setFeedbackLoading(true);
      const { newFeedback } = await feedbackApi.post(data);
      setFeedbacks(feedbacks.concat(newFeedback));
      setFeedbackLoading(false);
      setShowFeedback(true);
      toast("Add feedback successful", { ...PRODUCT_TOAST_OPTIONS });
    } catch (error) {
      setFeedbackLoading(false);
      setShowFeedbackForm(false);
      toast.error(error.message);
    }
  };

  const handleUpdateReviewFeedback = async (data) => {
    try {
      setFeedbackLoading(true);
      await feedbackApi.patch(selectedFeedback._id, data);
      setFeedbacks(
        feedbacks.map((feedback) => {
          if (feedback._id === selectedFeedback._id) {
            return { ...feedback, ...data };
          } else {
            return feedback;
          }
        })
      );
      setFeedbackLoading(false);
      setIsEditUpdateFeedbackForm(false);
      setShowFeedback(true);
      toast("Update feedback successful", { ...PRODUCT_TOAST_OPTIONS });
    } catch (error) {
      setFeedbackLoading(false);
      setShowFeedbackForm(false);
      toast.error(error.message);
    }
  };

  const handleRemoveFeedback = async () => {
    try {
      setFeedbackLoading(true);
      await feedbackApi.remove(selectedFeedback._id);
      setFeedbacks(
        feedbacks.filter((feedback) => feedback._id !== selectedFeedback._id)
      );
      setFeedbackLoading(false);
      setRemoveConfirmModal(false);
      toast("Delete feedback successfully.", { ...PRODUCT_TOAST_OPTIONS });
    } catch (error) {
      console.log(error);
      setFeedbackLoading(false);
      setRemoveConfirmModal(false);
      toast.error(error.message);
    }
  };

  return (
    <div
      key={review._id}
      onClick={toggle}
      className="shadow-lg rounded-2 p-4 mt-4"
      style={{ cursor: "pointer" }}
    >
      <div className="d-flex">
        <div>
          <img
            width={68}
            height={68}
            className="rounded-circle"
            style={{ objectFit: "cover" }}
            src={review.userId.image}
            alt={review._id}
          />
        </div>

        <div className="ms-3">
          <code className="fw-bold text-dark">{`${review.userId.firstname} ${review.userId.lastname}`}</code>
          <code className="ms-2 text-secondary">
            {format(review.updatedAt)}
          </code>
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
          <code
            className="fw-bold"
            style={{ cursor: "pointer" }}
            onClick={toggle}
          >
            {showFeedback ? (
              <i className="bx bxs-up-arrow"></i>
            ) : (
              <i className="bx bxs-down-arrow"></i>
            )}{" "}
            <span style={{ position: "relative", top: "-1px" }}>
              Feedback {feedbacks.length}
            </span>
          </code>
        </div>

        <div className="d-flex flex-grow-1 justify-content-end">
          <div className="ms-1">
            {user?._id && (
              <i
                onClick={toggleFeedBackForm}
                className="bx bx-message-dots text-dark me-1 fs-4"
              ></i>
            )}

            {user?._id && user?._id === review.userId._id && (
              <i
                onClick={toggleReviewUpdateForm}
                className="bx bx-edit text-info me-1 fs-4"
              ></i>
            )}

            {(user?.role || user?._id === review.userId._id) && (
              <i
                onClick={handleRemoveReview}
                className="bx bx-trash text-danger fs-4"
              />
            )}
          </div>
        </div>
      </div>

      {showReviewUpdateForm && (
        <ReviewForm
          product={product}
          review={review}
          setShowReviewForm={setShowReviewUpdateForm}
          addReviewLoading={updateReviewLoading}
          onReviewUpdateFormSubmit={onReviewUpdateFormSubmit}
        />
      )}

      <FeedbackForm
        isNested={false}
        feedback={review}
        updateFeedback={selectedFeedback}
        feedbackLoading={selectedFeedback}
        onAddFeedback={handleAddReviewFeedback}
        onUpdateFeedback={handleUpdateReviewFeedback}
        showFeedbackForm={showFeedbackForm}
        setShowFeedbackForm={setShowFeedbackForm}
        isEditUpdateFeedbackForm={isEditUpdateFeedbackForm}
      />

      {showFeedback &&
        feedbacks.map((feedback, index) => (
          <FeedbackItem
            user={user}
            product={product}
            key={feedback._id}
            review={review}
            feedback={feedback}
            feedbacks={feedbacks}
            setSelectedFeedback={setSelectedFeedback}
            setRemoveConfirmModal={setRemoveConfirmModal}
            setShowFeedbackForm={setShowFeedbackForm}
            feedbackLoading={feedbackLoading}
            onAddFeedback={handleAddReviewFeedback}
            onUpdateFeedback={handleUpdateReviewFeedback}
            isEditUpdateFeedbackForm={isEditUpdateFeedbackForm}
            setIsEditUpdateFeedbackForm={setIsEditUpdateFeedbackForm}
          />
        ))}

      <Modal isOpen={removeConfirmModal} toggle={toggleRemoveModal}>
        <ModalHeader toggle={() => setModal(!toggleRemoveModal)}>
          <div className="Header__logo">
            <h2 className="my-0">
              <Link to="/">
                Shoes Store{" "}
                <img className="img-fluid" src={brandLogo} alt="brandLogo" />
              </Link>
            </h2>
          </div>
        </ModalHeader>
        <ModalBody>
          <code className="text-secondary fs-6">
            Are you sure you want to remove this feedback ?
          </code>
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={feedbackLoading}
            className="btn btn-sm"
            color="primary"
            onClick={handleRemoveFeedback}
          >
            Agree
            {feedbackLoading && (
              <Spinner className="ms-2" size="sm">
                Loading
              </Spinner>
            )}
          </Button>{" "}
          <Button
            disabled={feedbackLoading}
            className="btn btn-sm"
            color="secondary"
            onClick={toggleRemoveModal}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ReviewItem;
