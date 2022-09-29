import reviewApi from "api/review";
import {
  ORDER_STATE,
  PRODUCT_TOAST_OPTIONS,
  STAR_MEANINGS,
} from "constants/globals";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import { getAverageStar } from "utils/common";
import ReviewForm from "../ReviewForm";
import ReviewItem from "../ReviewItem";
import ReviewProgressItem from "../ReviewProgressItem";
import brandLogo from "../../../../assets/images/brandLogo.png";

function ProductReview({ product, user, order }) {
  const [reviews, setReview] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const [addReviewLoading, setAddReviewLoading] = useState(false);

  const [showReviewUpdateForm, setShowReviewUpdateForm] = useState(false);
  const [updateReviewLoading, setUpdateReviewLoading] = useState(false);

  const [modal, setModal] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [selectedReView, setSelectedReview] = useState();

  const toggle = () => setModal(!modal);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!product?._id) return;
        const data = await reviewApi.get(product._id);
        setReview(data.reviews);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReviews();
  }, [product]);

  const handleReviewFormSubmit = async (data) => {
    data.userId = user._id;
    data.productId = product._id;
    try {
      setAddReviewLoading(true);
      const { newReview } = await reviewApi.post(data);
      setReview(reviews.concat(newReview));
      setAddReviewLoading(false);
      setShowReviewForm(false);
      toast("Add review successful", { ...PRODUCT_TOAST_OPTIONS });
    } catch (error) {
      setAddReviewLoading(false);
      setShowReviewForm(false);
      toast.error(error.message);
    }
  };

  const handleReviewUpdateFormSubmit = async (data) => {
    try {
      setUpdateReviewLoading(true);
      await reviewApi.patch(selectedReView._id, data);
      setReview(
        reviews.map((review) => {
          if (review.userId._id === user?._id) {
            return { ...review, ...data };
          } else {
            return review;
          }
        })
      );
      setUpdateReviewLoading(false);
      setShowReviewUpdateForm(false);
      toast("Update review successful", { ...PRODUCT_TOAST_OPTIONS });
    } catch (error) {
      setUpdateReviewLoading(false);
      setShowReviewUpdateForm(false);
      toast.error(error.message);
    }
  };

  const handleRemoveReview = async () => {
    try {
      setReviewLoading(true);
      await reviewApi.remove(selectedReView._id);
      setReview(reviews.filter((review) => review._id !== selectedReView._id));
      setReviewLoading(false);
      setModal(false);
      toast("Delete review successfully.", { ...PRODUCT_TOAST_OPTIONS });
    } catch (error) {
      console.log(error);
      setReviewLoading(false);
      setModal(false);
      toast.error(error.message);
    }
  };

  return (
    <Container>
      <Row>
        <h3 className="text-uppercase my-5">Rate & comment</h3>

        <h5>Product Review</h5>
        <div className="d-flex mb-4">
          {Math.trunc(Math.round(getAverageStar(reviews))) !== 0 && (
            <h3>{getAverageStar(reviews).toFixed(1)}</h3>
          )}
          <div className="mx-2 mt-1">
            <div>
              {Array.from(
                Array(Math.trunc(Math.round(getAverageStar(reviews)))).keys()
              ).map((key) => (
                <i key={key} className="bx bxs-star fs-3 text-warning"></i>
              ))}
            </div>
            <code className="text-dark">{reviews.length} reviews</code>
          </div>
          {Math.trunc(Math.round(getAverageStar(reviews))) !== 0 && (
            <div className="mt-2">
              <code className="text-dark">
                {STAR_MEANINGS[Math.trunc(Math.round(getAverageStar(reviews)))]}
              </code>
            </div>
          )}
        </div>
        <div className="mb-4">
          {Array.from(Array(5).keys())
            .reverse()
            .map((key) => (
              <ReviewProgressItem
                key={key}
                starNumber={key + 1}
                reviews={reviews}
              />
            ))}
        </div>

        <Container className="px-0">
          <h5 className="mb-0">New Reviews</h5>
          <code className="text-secondary">
            Only the people who bought the product can rate the product
          </code>
          <Button
            disabled={
              !user?._id ||
              !order.find(
                (orderItem) =>
                  orderItem.user === user?._id &&
                  orderItem.state === ORDER_STATE.delivered &&
                  orderItem.products.some(
                    (productItem) => productItem?._id?._id === product?._id
                  )
              )
            }
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="btn btn-dark border-5 d-block mt-2 shadow"
          >
            Create a review
          </Button>

          {showReviewForm && (
            <ReviewForm
              product={product}
              setShowReviewForm={setShowReviewForm}
              addReviewLoading={addReviewLoading}
              onReviewFormSubmit={handleReviewFormSubmit}
            />
          )}
        </Container>

        {reviews
          .filter((review) => review.userId._id === user?._id || review.state)
          .map((review) => (
            <ReviewItem
              key={review._id}
              review={review}
              user={user}
              product={product}
              setSelectedReview={setSelectedReview}
              setModal={setModal}
              updateReviewLoading={updateReviewLoading}
              setUpdateReviewLoading={setUpdateReviewLoading}
              showReviewUpdateForm={showReviewUpdateForm}
              setShowReviewUpdateForm={setShowReviewUpdateForm}
              onReviewUpdateFormSubmit={handleReviewUpdateFormSubmit}
            />
          ))}
      </Row>

      <Button
        outline
        color="primary"
        disabled
        className="d-block mx-auto my-4 shadow"
      >
        View more previews
      </Button>

      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={() => setModal(!modal)}>
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
              Are you sure you want to remove this review ?
            </code>
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={reviewLoading}
              className="btn btn-sm"
              color="primary"
              onClick={handleRemoveReview}
            >
              Agree
              {reviewLoading && <Spinner size="sm ms-2">Loading</Spinner>}
            </Button>{" "}
            <Button
              disabled={reviewLoading}
              className="btn btn-sm"
              color="secondary"
              onClick={() => setModal(false)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Container>
  );
}

export default ProductReview;
