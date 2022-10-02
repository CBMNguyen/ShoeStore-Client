import React from "react";
import {
  Button,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import { total } from "utils/common";
import OrderItem from "../OrderItem";

function OrderDetail({
  cart,
  totalFeeShip,
  discount,
  discountCode,
  discountLoading,
  setDiscountCode,
  onDiscountApplyClick,
}) {
  return (
    <Container>
      <div className="w-75 m-auto Checkout__detail">
        <Row className="mt-3">
          {cart.map((cartItem) => (
            <OrderItem key={cartItem._id} order={cartItem} />
          ))}
        </Row>

        <Row
          className="my-3 pb-4"
          style={{ borderBottom: "1px solid #dedede" }}
        >
          <Col md={9}>
            <FormGroup floating>
              <Input
                id="discountCode"
                name="discountCode"
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <Label for="discountCode">Discount code</Label>
            </FormGroup>
          </Col>
          <Col md={3}>
            <Button
              onClick={onDiscountApplyClick}
              className="w-100 bg-info border-0"
              style={{ height: "60px" }}
              disabled={discountLoading}
            >
              Apply
              {discountLoading && (
                <Spinner className="ms-2" size="sm">
                  {" "}
                </Spinner>
              )}
            </Button>
          </Col>
        </Row>

        <Row style={{ borderBottom: "1px solid #dedede" }}>
          <div className="py-3">
            <div className="d-flex justify-content-between text-secondary">
              <div>Provisional Price</div>
              <code className="text-warning fw-bold">
                ${total(cart).toFixed(2)}
              </code>
            </div>
            <div className="d-flex justify-content-between my-2 text-secondary">
              <div>Transport Fee</div>
              <code className="fw-bold" style={{ color: "cyan" }}>
                ${totalFeeShip}
              </code>
            </div>
            <div className="d-flex justify-content-between text-secondary">
              <div>Discount</div>
              <code className="fw-bold">${discount}</code>
            </div>
          </div>
        </Row>
        <div className="d-flex justify-content-between mt-3 text-secondary fs-5">
          <div>Total Amount:</div>
          <div className="text-dark fw-bold">
            $
            {cart.length
              ? (total(cart) + Number(totalFeeShip) - Number(discount)).toFixed(
                  2
                )
              : 0}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default OrderDetail;
