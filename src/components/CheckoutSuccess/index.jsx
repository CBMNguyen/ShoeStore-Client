import React from "react";
import PropTypes from "prop-types";
import { Button, Container } from "reactstrap";
import { Link } from "react-router-dom";
import brandLogo from "../../assets/images/brandLogo.png";
import "./checkoutSuccess.scss";

CheckoutSuccess.propTypes = {};

function CheckoutSuccess({ user }) {
  return (
    <div className="CheckoutSuccess shadow">
      <div className="d-flex flex-column align-items-center">
        <i
          className="bx bx-check-circle"
          style={{ fontSize: "100px", color: "#63C000" }}
        ></i>
        <div className="CheckoutSuccess__logo">
          <h2>
            <Link to="/">
              Shoes Store{" "}
              <img className="img-fluid" src={brandLogo} alt="brandLogo" />
            </Link>
          </h2>
        </div>
        <h3 className="my-3">Checkout Successfully</h3>

        <p className="mt-2">
          <code className="text-secondary">
            Thank you so much for your order! We really appreciate it. Enjoy 10%
            off your next purchase with this coupon code: THANKYOU10.
          </code>
        </p>

        <div className="d-flex w-100 justify-content-center mt-4">
          <Button
            type="submit"
            style={{ backgroundColor: "deeppink" }}
            className="text-white rounded-1 float-end p-3 border-0 w-25 me-5 shadow"
          >
            <Link to="/products" className="text-decoration-none">
              <code className="text-white fs-6">Keep shopping</code>
            </Link>
          </Button>
          <Button
            type="submit"
            style={{ backgroundColor: "cyan" }}
            className="text-white rounded-1 float-end p-3 border-0 w-25 shadow"
          >
            <Link to={`/order/${user?._id}`} className="text-decoration-none">
              <code className="text-white fs-6">View orders</code>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccess;
