import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import { total } from "utils/common";
import brandLogo from "../../../../assets/images/brandLogo.png";
import OrderItem from "../components/OrderItem";
import "./order.scss";
import cod from "../../../../assets/images/cod.svg";
import other from "../../../../assets/images/other.svg";
import Loading from "components/Loading";

function MainPage(props) {
  const { order, id, loading, state } = useSelector((state) => state.order);

  const { user } = useSelector((state) => state.user);

  // Set filter when change
  const [filter, setFilter] = useState({
    cityCode: null,
    districtCode: null,
  });

  const [city, setCity] = useState([]);
  const [district, setDistrict] = useState([]);
  const [commune, setCommune] = useState([]);
  const [loadAddress, setLoadAddress] = useState(false);

  // Fetch city on Province page
  useEffect(() => {
    const fetchCity = async () => {
      const City = await axios.get("https://provinces.open-api.vn/api/");
      const data = City.data || [];

      const cityOptions = data.map((ct) => ({
        label: ct.name,
        value: ct.code,
      }));

      setCity(cityOptions);
    };
    fetchCity();
  }, []);

  // Fetch district when city change
  useEffect(() => {
    const fetchDistrict = async () => {
      if (filter.cityCode === null) return;
      setLoadAddress(true);

      const District = await axios.get(
        `https://provinces.open-api.vn/api/p/${filter.cityCode}/?depth=2`
      );

      const data = District.data.districts || [];
      const districtOptions = data.map((ct) => ({
        label: ct.name,
        value: ct.code,
      }));

      setLoadAddress(false);
      setDistrict(districtOptions);
    };
    fetchDistrict();
  }, [filter]);

  // Fetch commune when district change
  useEffect(() => {
    const fetchCommune = async () => {
      if (filter.districtCode === null) return;
      setLoadAddress(true);
      const Commune = await axios.get(
        `https://provinces.open-api.vn/api/d/${filter.districtCode}/?depth=2`
      );

      const data = Commune.data.wards || [];
      const communeOptions = data.map((ct) => ({
        label: ct.name,
        value: ct.code,
      }));
      setLoadAddress(false);
      setCommune(communeOptions);
    };
    fetchCommune();
  }, [filter]);

  return (
    <div className="Order">
      <Container>
        <Row style={{ marginTop: "45px" }}>
          <Col lg={6}>
            <div className="Order__logo">
              <h2>
                <Link to="/">
                  Shoes Store{" "}
                  <img className="img-fluid" src={brandLogo} alt="brandLogo" />
                </Link>
              </h2>
            </div>

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
                <Link className="text-decoration-none">
                  <code>Payment method</code>
                </Link>
              </BreadcrumbItem>
            </Breadcrumb>

            <h4 className="mb-3">
              <code className="text-secondary">Order Information</code>
            </h4>

            <Form>
              <Row>
                <Col md={12}>
                  <FormGroup floating>
                    <Input id="fullname" name="fullname" type="text" />
                    <Label for="fullname">Full Name</Label>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={8}>
                  <FormGroup floating>
                    <Input id="email" name="email" type="email" />
                    <Label for="email">Email</Label>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup floating>
                    <Input id="number" name="number" type="number" />
                    <Label for="number">Number</Label>
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup floating>
                <Input id="address" name="address" />
                <Label for="address">Address</Label>
              </FormGroup>
              <Row className="position-relative">
                {loadAddress && (
                  <div className="position-absolute" style={{ top: "12px" }}>
                    <Loading />
                  </div>
                )}

                <Col md={4}>
                  {/* City */}
                  <FormGroup floating>
                    <Input
                      id="city"
                      name="city"
                      onChange={(e) =>
                        setFilter({ ...filter, cityCode: e.target.value })
                      }
                      type="select"
                    >
                      {!filter.cityCode && (
                        <option value="">Select Provice / City</option>
                      )}
                      {city.map((item) => (
                        <option value={item.value}>{item.label}</option>
                      ))}
                    </Input>
                    <Label for="city">City / Province</Label>
                  </FormGroup>
                </Col>

                {/* District */}
                <Col md={4}>
                  <FormGroup floating>
                    <Input
                      id="district"
                      name="district"
                      onChange={(e) =>
                        setFilter({ ...filter, districtCode: e.target.value })
                      }
                      type="select"
                    >
                      {!filter.cityCode && (
                        <option value="">Select District</option>
                      )}
                      {district.map((item) => (
                        <option value={item.value}>{item.label}</option>
                      ))}
                    </Input>
                    <Label for="district">District</Label>
                  </FormGroup>
                </Col>

                {/* Commune */}
                <Col md={4}>
                  <FormGroup floating>
                    <Input id="commune" name="select" type="select">
                      {!filter.districtCode && (
                        <option value="">Select Provice / City</option>
                      )}
                      {commune.map((item) => (
                        <option value={item.value}>{item.label}</option>
                      ))}
                    </Input>
                    <Label for="commune">Wards / Commune</Label>
                  </FormGroup>
                </Col>
              </Row>

              {/* Payment method */}
              <FormGroup row tag="fieldset">
                <h4 className="mb-3">
                  <code className="text-secondary">Payment Method</code>
                </h4>
                <FormGroup check>
                  <Input
                    defaultChecked
                    style={{ cursor: "pointer" }}
                    id="paymentMethodDelivery"
                    name="paymentMethod"
                    className="mt-3 me-4"
                    type="radio"
                  />
                  <Label
                    check
                    for="paymentMethodDelivery"
                    className="mt-1"
                    style={{ cursor: "pointer" }}
                  >
                    {" "}
                    <img src={cod} alt="cod" />
                    <code className="text-secondary fs-6 ms-3">
                      Payment on delivery
                    </code>
                  </Label>
                </FormGroup>

                {/* Payment online method */}
                <FormGroup check>
                  <Input
                    id="paymentMethodOnline"
                    name="paymentMethod"
                    className="mt-3 me-4"
                    type="radio"
                    style={{ cursor: "pointer" }}
                  />
                  <Label
                    check
                    for="paymentMethodOnline"
                    className="mt-1"
                    style={{ cursor: "pointer" }}
                  >
                    {" "}
                    <img src={other} alt="other" />
                    <code className="text-secondary fs-6 ms-3">
                      Online Payment
                    </code>
                  </Label>
                </FormGroup>
              </FormGroup>

              <Row className="mt-2">
                <Col md={2}>
                  <Link to="/cart" className="text-decoration-none fs-4">
                    <code>Cart</code>
                  </Link>
                </Col>
                <Col md={10}>
                  <Button
                    disabled={order.length === 0}
                    style={{ backgroundColor: "deeppink" }}
                    className="text-white rounded-1 float-end p-3 border-0"
                  >
                    Complete payment
                  </Button>
                </Col>
              </Row>
            </Form>
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
              <Container>
                <div className="w-75 m-auto">
                  <Row className="mt-3">
                    {order.map((orderItem) => (
                      <OrderItem order={orderItem} />
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
                        />
                        <Label for="discountCode">Discount code</Label>
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <Button className="w-100 h-75 bg-info border-0">
                        Apply
                      </Button>
                    </Col>
                  </Row>

                  <Row style={{ borderBottom: "1px solid #dedede" }}>
                    <div className="py-3">
                      <div className="d-flex justify-content-between text-secondary">
                        <div>Provisional Price</div>
                        <div>${total(order).toFixed(2)}</div>
                      </div>
                      <div className="d-flex justify-content-between my-2 text-secondary">
                        <div>Transport Fee</div>
                        <div>$5</div>
                      </div>
                      <div className="d-flex justify-content-between text-secondary">
                        <div>Discount</div>
                        <div>$5</div>
                      </div>
                    </div>
                  </Row>
                  <div className="d-flex justify-content-between mt-3 text-secondary fs-5">
                    <div>Total Amount:</div>
                    <div className="text-dark fw-bold">
                      ${total(order).toFixed(2)}
                    </div>
                  </div>
                </div>
              </Container>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MainPage;
