import React from "react";
import {
  Button,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { total } from "utils/common";
import OrderItem from "../OrderItem";

function OrderDetail({
  cart,
  totalFeeShip,
  discount,
  discountCode,
  setDiscountCode,
}) {
  return (
    <Container>
      <div className="w-75 m-auto">
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
            <Button className="w-100 h-75 bg-info border-0">Apply</Button>
          </Col>
        </Row>

        <Row style={{ borderBottom: "1px solid #dedede" }}>
          <div className="py-3">
            <div className="d-flex justify-content-between text-secondary">
              <div>Provisional Price</div>
              <div>${total(cart).toFixed(2)}</div>
            </div>
            <div className="d-flex justify-content-between my-2 text-secondary">
              <div>Transport Fee</div>
              <div>${totalFeeShip}</div>
            </div>
            <div className="d-flex justify-content-between text-secondary">
              <div>Discount</div>
              <div>${discount}</div>
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
