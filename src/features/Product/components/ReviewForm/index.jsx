import { PRODUCT_TOAST_OPTIONS } from "constants/globals";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, Input, Spinner } from "reactstrap";
import Rating from "../Rating";

ReviewForm.propTypes = {};

function ReviewForm({
  onReviewFormSubmit,
  onReviewUpdateFormSubmit,
  addReviewLoading,
  setShowReviewForm,
  product,
  review,
}) {
  const [star, setStar] = useState(review?.star || 4);
  const [content, setContent] = useState(() => {
    return review?.content || "";
  });
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (content.trim().length === 0) {
      toast("Please check review content...", { ...PRODUCT_TOAST_OPTIONS });
      return;
    }

    if (onReviewFormSubmit) {
      await onReviewFormSubmit({ star, content });
    } else {
      await onReviewUpdateFormSubmit({ star, content });
    }
    setContent("");
  };

  return (
    <Form
      onClick={(e) => e.stopPropagation()}
      onSubmit={handleFormSubmit}
      className="mt-4 shadow p-4 rounded"
    >
      <div className="my-2">
        <code className="text-dark fs-6">Review for product: </code>
        <code>#{product.name}</code>
        <Rating setStar={setStar} stars={star} />
      </div>
      <Input
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
        type="textarea"
        placeholder="Enter your review..."
      />

      <div className="ms-auto mt-4 d-flex justify-content-end">
        <Button
          type="submit"
          disabled={addReviewLoading}
          className="btn btn-dark btn-sm shadow"
        >
          {!review?.content ? "Send Review" : "Update Review"}{" "}
          {addReviewLoading && <Spinner size="sm">Loading</Spinner>}
        </Button>
        <Button
          disabled={addReviewLoading}
          onClick={() => setShowReviewForm(false)}
          className="btn btn-dark btn-sm ms-2 shadow"
        >
          Close
        </Button>
      </div>
    </Form>
  );
}

export default ReviewForm;
