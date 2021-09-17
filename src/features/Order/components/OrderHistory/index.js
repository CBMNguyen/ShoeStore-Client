import orderApi from "api/order";
import Loading from "components/Loading";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Badge } from "reactstrap";
import { capitalizeFirstLetter } from "utils/common";
import "./orderhistory.scss";

function OrderHistory() {
  const [order, setOrder] = useState([]);
  const [increase, setIncrease] = useState(1);
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchOrder = async () => {
      const Order = await orderApi.get(user._id);
      if (Order.length !== 0) {
        setOrder(Order.order);
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
      <header>
        <div>Purchase history 💳</div>
        <i
          onClick={() => setIncrease(increase * -1)}
          className={increase === 1 ? "bx bx-chevron-down" : "bx bx-chevron-up"}
        />
      </header>

      {sortOrderByDate.length !== 0 &&
        sortOrderByDate.map((od) => (
          <div
            key={od.createdAt}
            className="OrderHistory__box shadow p-3 mb-4 bg-white rounded"
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
                <div key={product.name} className="OrderHistory__products">
                  <div>{product.name}</div>
                  <div>{product.selectedSize}</div>
                  <div>{product.selectedColor}</div>
                  <div>{product.selectedQuantity}</div>
                  <div>{product.originalPrice}$</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      {order.length === 0 && <Loading />}
    </div>
  );
}

export default OrderHistory;
