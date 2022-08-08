import orderApi from "api/order";
import Loading from "components/Loading";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Badge, Col, Row } from "reactstrap";
import { capitalizeFirstLetter } from "utils/common";
import noResultImg from "../../../../assets/images/noResultFound.png";
import "./orderhistory.scss";

function OrderHistory() {
  const [order, setOrder] = useState([]);
  const [increase, setIncrease] = useState(1);
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const Order = await orderApi.get(user._id);
        setLoading(false);
        if (Order.length !== 0) {
          setOrder(Order.order);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user._id]);

  const sortOrderByDate = order.sort((a, b) => {
    return increase === 1
      ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="OrderHistory">
      <header
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          backgroundColor: "#fff",
          color: "#000",
          padding: "1rem",
          paddingBottom: "0.4rem",
        }}
      >
        <div>Purchase history 🗃️</div>
        <i
          onClick={() => setIncrease(increase * -1)}
          className={increase === 1 ? "bx bx-chevron-down" : "bx bx-chevron-up"}
        />
      </header>

      {sortOrderByDate.length !== 0 &&
        sortOrderByDate.map((od) => (
          <div
            key={od.createdAt}
            className="OrderHistory__box shadow mx-3 p-3 mb-3 bg-white rounded"
          >
            <div className="OrderHistory__time">
              <div style={{ fontFamily: "Pacifico", color: "#bbb" }}>
                {new Date(od.createdAt).toDateString()}
              </div>
              <Badge
                style={{ width: "80px" }}
                className={
                  od.state === "pending"
                    ? "bg-primary"
                    : od.state === "processing"
                    ? "bg-danger"
                    : "bg-success"
                }
              >
                {capitalizeFirstLetter(od.state)}
              </Badge>
            </div>
            <div>
              {od.products.map((product) => (
                <Row key={product.name} className="OrderHistory__products">
                  <Col md="6">{product.name}</Col>
                  <Col md="1">{product.selectedSize}</Col>
                  <Col md="2">{product.selectedColor}</Col>
                  <Col md="1">{product.selectedQuantity}</Col>
                  <Col md="2">{product.originalPrice}$</Col>
                </Row>
              ))}
            </div>
          </div>
        ))}
      {loading && <Loading />}
      {order.length === 0 && !loading && (
        <div
          style={{ width: "100%", height: "100%" }}
          className="OrderHistory__noResult"
        >
          <img src={noResultImg} alt="noOrderFound" />
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
