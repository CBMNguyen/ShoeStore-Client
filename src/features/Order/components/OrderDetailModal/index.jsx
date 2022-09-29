import {
  Badge,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import {
  capitalizeFirstLetter,
  formatDate,
  getColorByState,
} from "utils/common";
import "./orderDetailModal.scss";
import GHNImage from "../../../../assets/images/GHN.webp";
import classNames from "classnames";
import { ORDER_STATE } from "constants/globals";

function OrderDetailModal({ order }) {
  return (
    <div className="OrderDetailModal">
      <Container className="p-2 rounded-1">
        <Row className="shadow py-3 mb-4 rounded-2 mt-3">
          <h4 className="text-uppercase mb-2">Contact Info</h4>
          <Col md={2}>
            <FormGroup floating>
              <Input value={order.fullname} readOnly valid />
              <Label>Full Name</Label>
            </FormGroup>
          </Col>

          <Col md={2}>
            <FormGroup floating>
              <Input readOnly value={order.email} valid />
              <Label>Email</Label>
            </FormGroup>
          </Col>

          <Col md={2}>
            <FormGroup floating>
              <Input readOnly value={order.phone} valid />
              <Label>Phone</Label>
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup floating>
              <Input readOnly value={order.address.split("#")[0]} valid />

              <Label>Address</Label>
            </FormGroup>
          </Col>
        </Row>

        {/* dasd */}

        <Row className="mb-4 pt-3 py-4 shadow rounded-2">
          <h4 className="text-uppercase mb-2">Order Info</h4>

          <Col md={3}>
            <div className="text-center mb-2">
              <i
                className="bx bx-calendar fs-1"
                style={{ color: "deeppink" }}
              ></i>
              <h4 className="text-uppercase text-secondary">Order Date</h4>

              <code
                className=" d-block mt-4 fs-6 fw-bold"
                style={{ color: "deeppink" }}
              >
                {formatDate(order.createdAt)}
              </code>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center mb-3">
              <i className="bx bxs-truck fs-1 text-success"></i>
              <h4 className="text-uppercase text-secondary">
                delivery service
              </h4>

              <img
                style={{
                  width: "100%",
                  height: "40px",
                  objectFit: "contain",
                  position: "relative",
                  top: "8px",
                }}
                src={GHNImage}
                alt="GHMAvatarPicture"
              />
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center mb-2">
              <i className="bx bxl-sketch fs-1 text-info"></i>

              <h4 className="text-uppercase text-secondary">Order State</h4>

              <code className="d-block mt-4 text-info fs-6 fw-bold">
                <Badge className={getColorByState(order.state)}>
                  {capitalizeFirstLetter(order.state)}
                </Badge>
              </code>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center mb-2">
              <i className="bx bxs-badge-dollar fs-1 text-warning"></i>

              <h4 className="text-uppercase text-secondary">Total Amount</h4>

              <code className="d-block mt-4 fs-6 text-warning fw-bold">
                ${order.total.toFixed(2)}
              </code>
            </div>
          </Col>
        </Row>

        <Row className="pt-3 pb-3 shadow rounded-2">
          <h4 className="text-uppercase mb-3">order process</h4>

          <Col md={3} className="px-0">
            <div
              className={classNames(
                "OrderDetailModal__stepContainer OrderDetailModal__stepContainer--first",
                {
                  "OrderDetailModal__stepContainer--active":
                    order.state !== ORDER_STATE.cancelled,
                }
              )}
            >
              <div className="OrderDetailModal__stepIcon">
                <i className="bx bx-loader text-white fs-4"></i>
              </div>
            </div>

            <h6 className="text-center mt-3">
              <code className="fs-6 text-secondary fw-bolder">Pending</code>
            </h6>
          </Col>
          <Col md={3} className="px-0">
            <div
              className={classNames("OrderDetailModal__stepContainer", {
                "OrderDetailModal__stepContainer--active":
                  order.state !== ORDER_STATE.cancelled &&
                  order.state !== ORDER_STATE.pending,
              })}
            >
              <div className="OrderDetailModal__stepIcon">
                <i className="bx bxs-calendar-check text-white fs-4"></i>
              </div>
            </div>

            <h6 className="text-center mt-3">
              <code className="fs-6 text-secondary fw-bolder">Confirmed</code>
            </h6>
          </Col>
          <Col md={3} className="px-0">
            <div
              className={classNames("OrderDetailModal__stepContainer", {
                "OrderDetailModal__stepContainer--active":
                  order.state === ORDER_STATE.shipping ||
                  order.state === ORDER_STATE.delivered,
              })}
            >
              <div className="OrderDetailModal__stepIcon">
                <i className="bx bxs-truck text-white fs-4"></i>
              </div>
            </div>

            <h6 className="text-center mt-3">
              <code className="fs-6 text-secondary fw-bolder">Shipping</code>
            </h6>
          </Col>
          <Col md={3} className="px-0">
            <div
              className={classNames(
                "OrderDetailModal__stepContainer OrderDetailModal__stepContainer--last",
                {
                  "OrderDetailModal__stepContainer--active":
                    order.state === ORDER_STATE.delivered,
                }
              )}
            >
              <div className="OrderDetailModal__stepIcon">
                <i className="bx bxs-gift text-white fs-4"></i>
              </div>
            </div>

            <h6 className="text-center mt-3">
              <code className="fs-6 text-secondary fw-bolder">Delivered</code>
            </h6>
          </Col>
        </Row>
        <Row className="pt-3 mt-4 shadow rounded-2">
          <h4 className="text-uppercase mb-3">order products</h4>

          {order.products.map((product, index) => (
            <div
              key={index}
              className="d-flex pb-4 mb-4"
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
                    order.updateProduct[index].productDetail.find(
                      ({ color }) => color.color === product.selectedColor
                    )?.images[0]
                  }
                  alt="img"
                />

                <Badge
                  className="bg-secondary rounded-pill position-absolute"
                  style={{ top: "-10px", right: "-10px" }}
                >
                  {product.selectedQuantity}
                </Badge>
              </div>
              <div className="flex-grow-1 ms-4">
                <Badge className="bg-secondary">{product._id.name}</Badge>
                <h6>
                  <Badge className="bg-dark">
                    {capitalizeFirstLetter(product._id.category.name)}
                  </Badge>
                </h6>
                <div>
                  <Badge className="bg-success">{product.selectedSize}</Badge>
                </div>
              </div>
              <div className="my-auto">
                <Badge className="bg-warning">
                  $
                  {product.currentSalePrice *
                    (1 - product.currentPromotionPercent / 100) *
                    product.selectedQuantity}
                </Badge>
              </div>
            </div>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default OrderDetailModal;
