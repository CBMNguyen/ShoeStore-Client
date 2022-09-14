import reviewApi from "api/review";
import { STAR_MEANINGS } from "constants/globals";
import { useEffect, useState } from "react";
import { Button, Container } from "reactstrap";
import { capitalizeFirstLetter, getAverageStar } from "utils/common";
import ReviewForm from "../ReviewForm";
import ReviewItem from "../ReviewItem";
import ReviewProgressItem from "../ReviewProgressItem";

function ProductReview({ product }) {
  const [reviews, setReview] = useState([]);

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

  return (
    <Container>
      <h3 className="text-uppercase my-5">Rate & comment</h3>

      <h5>
        Product Reviews{" "}
        {`${capitalizeFirstLetter(product?.category?.name || "")} ${
          product?.name
        }`}
      </h5>
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

      <ReviewForm />

      {reviews.map((review) => (
        <ReviewItem key={review._id} review={review} />
      ))}

      <Button
        outline
        color="primary"
        disabled
        className="d-block mx-auto my-4 shadow"
      >
        View more previews
      </Button>
    </Container>
  );
}

export default ProductReview;
