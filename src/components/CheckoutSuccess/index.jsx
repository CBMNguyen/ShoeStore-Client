import { Link } from "react-router-dom";
import { Button, Container } from "reactstrap";
import brandLogo from "../../assets/images/brandLogo.png";
import "./checkoutSuccess.scss";

function CheckoutSuccess({ user }) {
  return (
    <div className="CheckoutSuccess shadow">
      <Container className="d-flex flex-column align-items-center">
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

        <div className="my-3 text-center">
          <code className="text-secondary">
            Thank you so much for your order! We really appreciate it. Enjoy 10%
            off your next purchase with this coupon code: THANKYOU10.
          </code>
        </div>

        <div className="d-flex w-100 flex-column flex-lg-row justify-content-center align-items-center mt-4">
          <Button
            type="submit"
            style={{ backgroundColor: "deeppink", width: "240px" }}
            className="text-white rounded-1 border-0 shadow"
          >
            <Link to="/products" className="text-decoration-none">
              <code className="text-white fs-6 p-3 d-block w-100">
                Keep shopping
              </code>
            </Link>
          </Button>
          <div className="my-2 mx-4"></div>
          <Button
            type="submit"
            style={{ backgroundColor: "cyan", width: "240px" }}
            className="text-white rounded-1 border-0 shadow"
          >
            <Link
              to={`/order/${user?._id}`}
              className="text-decoration-none p-3 d-block w-100"
            >
              <code className="text-white fs-6">View orders</code>
            </Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default CheckoutSuccess;