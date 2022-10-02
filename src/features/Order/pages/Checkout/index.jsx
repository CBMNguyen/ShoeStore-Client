import axios from "axios";
import AddressForm from "components/AddressForm";
import {
  DISCOUNT_TYPE,
  EXCHANGE_RATE,
  PRODUCT_TOAST_OPTIONS,
  STYLE_MODEL,
} from "constants/globals";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Col, Container, Row } from "reactstrap";
import { checkout, total } from "utils/common";
import brandLogo from "../../../../assets/images/brandLogo.png";
import pavementApi from "api/payment";

import "./checkout.scss";
import Loading from "components/Loading";
import { toast } from "react-toastify";
import useQuery from "hooks/useQuery";
import CheckoutSuccess from "components/CheckoutSuccess";
import orderApi from "api/order";
import { resetCart } from "features/Cart/cartSlice";
import { getOrderById } from "features/Order/orderSlice";
import OrderForm from "features/Order/components/CheckoutForm";
import OrderDetail from "features/Order/components/CheckoutDetail";
import discountApi from "api/discount";

function Checkout(props) {
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.cart);
  const { order } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const { addresses } = useSelector((state) => state.address);

  const orderData = JSON.parse(localStorage.getItem("orderData"));

  const [selectedAddress, setSelectedAddress] = useState(() => {
    if (orderData) return orderData?.address;
    return "";
  });
  const [totalFeeShip, setTotalFeeShip] = useState(0);

  const [discount, setDiscount] = useState(() => {
    return orderData?.discount || 0;
  });

  const [paymentMethod, setPaymentMethod] = useState(() => {
    return orderData?.paymentMethod || false;
  });

  const [discountCode, setDiscountCode] = useState(() => {
    return orderData?.discountCode || "";
  });

  const [discountLoading, setDiscountLoading] = useState(false);

  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

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
            setLoadingMoMo(true);
            await orderApi.create(orderData);
            setLoadingMoMo(false);
            localStorage.removeItem("orderData");
            dispatch(resetCart());
            setCheckoutSuccess(true);
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
  }, [query, dispatch]);

  useEffect(() => {
    const fetchOrderByUserId = async () => {
      try {
        const { payload } = await dispatch(getOrderById(user._id));
        if (payload.order.length > 0 && !orderData) {
          setSelectedAddress(payload.order[payload.order.length - 1].address);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrderByUserId();
  }, [dispatch, user._id]);
  console.log(selectedAddress);
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
              insurance_value: total(cart) * EXCHANGE_RATE, // total order
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
  }, [cart, selectedAddress]);

  const handleDiscountClick = async () => {
    if (!discountCode) {
      toast("Please enter discount code", {
        ...PRODUCT_TOAST_OPTIONS,
      });
      return;
    }
    setDiscountLoading(true);
    discountApi
      .get(discountCode)
      .then((data) => {
        setDiscountLoading(false);
        toast(
          data.discount.discountName + " discount code successfully applied",
          {
            ...PRODUCT_TOAST_OPTIONS,
          }
        );
        const discountType = data.discount.discountType.discountTypeName;
        if (discountType === DISCOUNT_TYPE.FREE_SHIP) {
          setDiscount(totalFeeShip);
        } else if (discountType === DISCOUNT_TYPE.DISCOUNT_BY_MONEY) {
          setDiscount(data.discount.value);
        } else {
          // discount by promotion percent
          setDiscount(
            Number((total(cart) * (data.discount.value / 100)).toFixed(2))
          );
        }
      })
      .catch((error) => {
        setDiscountLoading(false);
        setDiscountCode("");
        toast(error.message, {
          ...PRODUCT_TOAST_OPTIONS,
        });
      });
  };

  const handleCheckoutSubmit = async (data) => {
    if (cart.length === 0) return;

    data.paymentMethod = paymentMethod;
    data.discount = discount;
    data.payment = false;
    data.transportFee = Number(totalFeeShip);
    data.discountCode = discountCode;
    data.total = Number(
      (total(cart) + Number(totalFeeShip) - Number(discount)).toFixed(2)
    );
    data.user = user._id;
    data.products = cart.map((product) => ({
      _id: product._id,
      selectedColor: product.selectedColor,
      selectedQuantity: product.selectedQuantity,
      selectedSize: product.selectedSize,
      currentOriginalPrice: product.originalPrice,
      currentSalePrice: product.salePrice,
      currentPromotionPercent: product.promotionPercent,
    }));

    const cloneCart = cart.slice().map((item) => ({ ...item }));
    data.updateProduct = checkout(cloneCart, cart);

    if (paymentMethod || orderData?.paymentMethod) {
      localStorage.setItem("orderData", JSON.stringify(data));

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
        console.log(error);
      }
    } else {
      try {
        await orderApi.create(data);
        toast("Checkout successfully.", {
          ...PRODUCT_TOAST_OPTIONS,
        });
        localStorage.removeItem("orderData");
        dispatch(resetCart());
        setCheckoutSuccess(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="Checkout">
      <Container>
        {checkoutSuccess && <CheckoutSuccess user={user} order={order} />}
        {!checkoutSuccess && (
          <Row style={{ marginTop: "45px" }}>
            <Col lg={6}>
              <div className="Checkout__logo">
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
                user={user}
                cart={cart}
                order={order}
                orderData={orderData}
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
                  overflowY: "auto",
                }}
                className="Checkout__borderLeft"
              >
                <OrderDetail
                  cart={cart}
                  totalFeeShip={totalFeeShip}
                  discount={discount}
                  discountCode={discountCode}
                  discountLoading={discountLoading}
                  onDiscountApplyClick={handleDiscountClick}
                  setDiscountCode={setDiscountCode}
                />
              </div>
            </Col>
          </Row>
        )}
      </Container>

      {/* address modal */}
      <AddressForm
        user={user}
        addresses={addresses}
        showAddressForm={showAddressForm}
        setShowAddressForm={setShowAddressForm}
      />

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

export default Checkout;
