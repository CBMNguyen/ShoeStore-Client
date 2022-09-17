import { Badge } from "reactstrap";
import { capitalizeFirstLetter } from "utils/common";

function OrderItem({ order }) {
  return (
    <div
      className="d-flex  pb-4 mb-4"
      style={{ borderBottom: "1px solid #dedede" }}
    >
      <div className="position-relative">
        <img
          className="rounded-2 img-thumbnail img-fluid"
          style={{
            width: "80px",
            height: "80px",
            objectFit: "cover",
          }}
          src={
            order.productDetail.find(
              ({ color }) => color.color === order.selectedColor
            ).images[0]
          }
          alt="img"
        />

        <Badge
          className="bg-secondary rounded-pill position-absolute"
          style={{ top: "-10px", right: "-10px" }}
        >
          {order.selectedQuantity}
        </Badge>
      </div>
      <div className="flex-grow-1 ms-4">
        <Badge className="bg-secondary">{order.name}</Badge>
        <h6>
          <Badge className="bg-dark">
            {capitalizeFirstLetter(order.category.name)}
          </Badge>
        </h6>
        <div>
          <Badge className="bg-success">{order.selectedSize}</Badge>
        </div>
      </div>
      <div className="my-auto">
        <Badge className="bg-warning">
          $
          {order.salePrice *
            (1 - order.promotionPercent / 100) *
            order.selectedQuantity}
        </Badge>
      </div>
    </div>
  );
}

export default OrderItem;
