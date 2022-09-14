import axios from "axios";
import AddressForm from "components/AddressForm";
import {
  EXCHANGE_RATE,
  PRODUCT_TOAST_OPTIONS,
  STYLE_MODEL,
} from "constants/globals";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Col, Container, Row } from "reactstrap";
import { total } from "utils/common";
import brandLogo from "../../../../assets/images/brandLogo.png";
import OrderDetail from "../components/OrderDetail";
import OrderForm from "../components/OrderForm";
import pavementApi from "api/payment";

import "./order.scss";
import Loading from "components/Loading";
import { toast } from "react-toastify";
import useQuery from "hooks/useQuery";
import { createOrder } from "features/Order/orderSlice";
import CheckoutSuccess from "components/CheckoutSuccess";

function MainPage(props) {
  const dispatch = useDispatch();
  const { order, id, loading, state } = useSelector((state) => state.order);

  const { user } = useSelector((state) => state.user);

  const { addresses } = useSelector((state) => state.address);
  const [selectedAddress, setSelectedAddress] = useState("");

  const [totalFeeShip, setTotalFeeShip] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [payment, setPayment] = useState(false);
  const [discountCode, setDiscountCode] = useState("");

  const [savedOrder, setSavedOrder] = useState(() =>
    JSON.parse(localStorage.getItem("orderData"))
  );

  // momo link
  const [linkMoMo, setLinkMoMo] = useState("");
  const checkoutLinkRef = useRef();
  const [loadingMoMo, setLoadingMoMo] = useState(false);

  const query = useQuery();

  useEffect(() => {
    if (query.get("resultCode")) {
      if (Number(query.get("resultCode")) === 0) {
        const createOrder = async () => {
          try {
            const orderData = JSON.parse(localStorage.getItem("orderData"));
            orderData.payment = true; // has payment
            delete orderData["provisionalPrice"];
            console.log(orderData);
            // await dispatch(createOrder(orderData));
            toast("Checkout successfully.", {
              ...PRODUCT_TOAST_OPTIONS,
            });
            localStorage.removeItem("orderData");
          } catch (error) {
            console.log(error);
          }
        };
        createOrder();
      } else {
        toast.error("There was an error while paying.", {
          ...PRODUCT_TOAST_OPTIONS,
        });
      }
    }
  }, [query]);

  const checkoutSuccess = query.get("resultCode");

  const [showAddressForm, setShowAddressForm] = useState(false);
  useEffect(() => {
    const fetchShipFee = async () => {
      let services;
      try {
        if (!selectedAddress) return;
        // fetch services
        services = await axios.get(
          `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services`,
          {
            headers: {
              token: process.env.REACT_APP_GHN_TOKEN,
            },
            params: {
              from_district: 2081, // Binh Tan District Code
              to_district: Number(selectedAddress.split("#")[1]),
              shop_id: process.env.REACT_APP_GHN_SHOP_ID,
            },
          }
        );

        const service_type = services.data.data[0].service_id; // get service type
        if (!service_type) return;

        const { data } = await axios.get(
          `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
          {
            headers: {
              token: process.env.REACT_APP_GHN_TOKEN,
              shop_id: process.env.REACT_APP_GHN_SHOP_ID,
            },
            params: {
              service_id: service_type, // service type
              insurance_value: total(order) * EXCHANGE_RATE, // total order
              coupon: null,
              from_district_id: 2081, // Binh Tan District Code
              to_district_id: Number(selectedAddress.split("#")[1]),
              to_ward_code: Number(selectedAddress.split("#")[2]),
              height: 15,
              length: 25,
              weight: 500,
              width: 10,
            },
          }
        );
        setTotalFeeShip((data.data.total / EXCHANGE_RATE).toFixed(2));
      } catch (error) {
        console.log(error);
      }
    };
    fetchShipFee();
  }, [selectedAddress]);

  const handleCheckoutSubmit = async (data) => {
    data.address = data.address.split("#")[0];
    data.paymentMethod = paymentMethod;
    data.discount = discount;
    data.payment = payment;
    data.transportFee = Number(totalFeeShip);
    data.discountCode = discountCode;
    data.total = total(order) + Number(totalFeeShip) - Number(discount);
    data.user = user._id;

    const orderData = { ...data };
    orderData.provisionalPrice = total(order);

    if (paymentMethod || savedOrder?.paymentMethod) {
      !savedOrder &&
        localStorage.setItem("orderData", JSON.stringify(orderData));

      try {
        setLoadingMoMo(true);
        const { shortLink } = await pavementApi.post({
          _id: Math.trunc(Math.random() * 100000000000).toString(),
          total: Math.trunc(data.total * EXCHANGE_RATE),
        });
        setLinkMoMo(shortLink);
        checkoutLinkRef.current.click();
        setLoadingMoMo(false);
      } catch (error) {
        localStorage.removeItem("orderData");
        console.log(error);
      }
    } else {
      console.log(data);
      toast("Checkout successfully.", {
        ...PRODUCT_TOAST_OPTIONS,
      });
    }
  };

  return (
    <div className="Order">
      <Container>
        {checkoutSuccess && <CheckoutSuccess user={user} />}
        {!checkoutSuccess && (
          <Row style={{ marginTop: "45px" }}>
            <Col lg={6}>
              <div className="Order__logo">
                <h2>
                  <Link to="/">
                    Shoes Store{" "}
                    <img
                      className="img-fluid"
                      src={brandLogo}
                      alt="brandLogo"
                    />
                  </Link>
                </h2>
              </div>

              {/* Navigate between pages */}
              <Breadcrumb>
                <BreadcrumbItem>
                  <Link to="/cart" className="text-decoration-none">
                    <code>Cart</code>
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                  <code>Order information</code>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <Link to="order" className="text-decoration-none">
                    <code>Payment method</code>
                  </Link>
                </BreadcrumbItem>
              </Breadcrumb>

              <h4 className="mb-3">
                <code className="text-secondary">Order Information</code>
              </h4>

              {/* Order form */}
              <OrderForm
                savedOrder={savedOrder}
                user={user}
                addresses={addresses}
                showAddressForm={showAddressForm}
                setPaymentMethod={setPaymentMethod}
                setShowAddressForm={setShowAddressForm}
                setSelectedAddress={setSelectedAddress}
                onCheckoutSubmit={handleCheckoutSubmit}
                loadingMoMo={loadingMoMo}
                paymentMethod={paymentMethod}
              />
            </Col>

            {/* Order Information side */}
            <Col lg={6}>
              <div
                style={{
                  borderLeft: "2px solid #dedede",
                  height: "88vh",
                  overflowY: "scroll",
                }}
              >
                <OrderDetail
                  order={order}
                  totalFeeShip={totalFeeShip}
                  discount={discount}
                  discountCode={discountCode}
                  setDiscountCode={setDiscountCode}
                  savedOrder={savedOrder}
                />
              </div>
            </Col>
          </Row>
        )}
      </Container>

      {/* address modal */}
      {showAddressForm && (
        <AddressForm
          user={user}
          addresses={addresses}
          showAddressForm={showAddressForm}
          setShowAddressForm={setShowAddressForm}
        />
      )}

      {/* link momo to redirect */}
      <a ref={checkoutLinkRef} style={{ display: "none" }} href={linkMoMo}>
        checkout momo
      </a>

      {loadingMoMo && (
        <div style={{ ...STYLE_MODEL }}>
          <Loading />
        </div>
      )}
    </div>
  );
}

export default MainPage;
