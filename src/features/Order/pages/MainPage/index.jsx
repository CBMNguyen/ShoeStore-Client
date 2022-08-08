import { yupResolver } from "@hookform/resolvers/yup";
import { createUser, getMe, updateUser, userLogin } from "app/userSlice";
import axios from "axios";
import Footer from "components/Footer";
import Header from "components/Header";
import LoginModel from "components/LoginModel";
import Profile from "components/Profile";
import SignUpModel from "components/SignUpModel";
import { resetCart } from "features/Cart/cartSlice";
import CheckoutModal from "features/Order/components/CheckoutModal";
import FieldList from "features/Order/components/FieldList";
import OrderHistory from "features/Order/components/OrderHistory";
import OrderList from "features/Order/components/OrderList";
import {
  createOrder,
  deleteOrder,
  getOrderById,
} from "features/Order/orderSlice";
import useModel from "hooks/useModel";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactLoading from "react-loading";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams, withRouter } from "react-router-dom";
import { Badge, Button, Col, Form, Row, Spinner, Table } from "reactstrap";
import {
  capitalizeFirstLetter,
  checkout,
  getMessageOrderByState,
  showToastError,
  showToastSuccess,
  total,
} from "utils/common";
import * as yup from "yup";
import "../../../Cart/components/CartList/cartlist.scss";
import "./order.scss";

function MainPage(props) {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const [showOrderHistory, setShowOrderHistory] = useState(!!userId);

  const { order, id, loading, state } = useSelector((state) => state.order);

  const { user } = useSelector((state) => state.user);
  const userState = useSelector((state) => state.user);

  // hanle fetch user and order when user login
  useEffect(() => {
    if (state) {
      dispatch(getMe(user._id));
      dispatch(getOrderById(user._id));
    }
  }, [dispatch, user._id, state]);

  const history = useHistory();

  const loginModel = useModel();
  const signupModel = useModel();
  const profileModel = useModel();
  const checkoutModal = useModel();

  const [city, setCity] = useState([]);
  const [district, setDistrict] = useState([]);
  const [commune, setCommune] = useState([]);

  // Set filter when change
  const [filter, setFilter] = useState({
    cityCode: null,
    districtCode: null,
  });

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

      const District = await axios.get(
        `https://provinces.open-api.vn/api/p/${filter.cityCode}/?depth=2`
      );

      const data = District.data.districts || [];
      const districtOptions = data.map((ct) => ({
        label: ct.name,
        value: ct.code,
      }));

      setDistrict(districtOptions);
    };
    fetchDistrict();
  }, [filter]);

  // Fetch commune when district change
  useEffect(() => {
    const fetchCommune = async () => {
      if (filter.districtCode === null) return;

      const Commune = await axios.get(
        `https://provinces.open-api.vn/api/d/${filter.districtCode}/?depth=2`
      );

      const data = Commune.data.wards || [];
      const communeOptions = data.map((ct) => ({
        label: ct.name,
        value: ct.code,
      }));

      setCommune(communeOptions);
    };
    fetchCommune();
  }, [filter]);

  // handle signup and add new user
  const handleCreateUser = async (data) => {
    try {
      await showToastSuccess(dispatch(createUser(data)));
      signupModel.closeModel();
      loginModel.showModel();
    } catch (error) {
      showToastError(error);
    }
  };

  // handle login
  const handleLogin = async (data) => {
    try {
      await showToastSuccess(dispatch(userLogin(data)));
      loginModel.closeModel();
    } catch (error) {
      showToastError(error);
    }
  };

  const defaultValues = {
    fullName: user.orderAddress.fullName,
    isFullDay: user.orderAddress.isFullDay,
    phone: user.orderAddress.phone,
    city: { label: user.orderAddress.city, value: 0 },
    district: { label: user.orderAddress.district, value: 0 },
    commune: { label: user.orderAddress.commune, value: 0 },
    description: user.orderAddress.description,
  };

  const schema = yup.object().shape({
    fullName: yup.string().required("This field is require."),
    isFullDay: yup.boolean().default(true),
    phone: yup.string().required("This field is require."),
    city: yup.object().required("This field is require.").nullable(),
    district: yup.object().required("This field is require.").nullable(),
    commune: yup.object().required("This field is require.").nullable(),
    description: yup.string().required("This field is require."),
  });

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(schema) });

  // handle form submit
  const onSubmit = async (Data) => {
    const cloneOrder = order.slice().map((item) => ({ ...item })); // clone order

    const orderAddress = {};
    orderAddress.city = Data.city.label;
    orderAddress.commune = Data.commune.label;
    orderAddress.description = Data.description;
    orderAddress.district = Data.district.label;
    orderAddress.fullName = Data.fullName;
    orderAddress.isFullDay = Data.isFullDay;
    orderAddress.phone = Data.phone;

    const data = {
      user: user._id,
      products: checkout(cloneOrder, order),
      total: parseFloat(total(order).toFixed(2)),
    };

    try {
      await dispatch(
        updateUser({
          _id: user._id,
          user: { orderAddress: orderAddress },
        })
      );
      await showToastSuccess(dispatch(createOrder(data)));
      dispatch(resetCart());
    } catch (error) {
      showToastError(error);
    }
  };

  // handle remove order
  const handleRemoveClick = async () => {
    try {
      await showToastSuccess(dispatch(deleteOrder(id)));
    } catch (error) {
      showToastError(error);
    }
  };

  // handle profile change
  const handleProfileChange = async (data) => {
    const formData = new FormData();
    formData.append("firstname", data.firstname);
    formData.append("lastname", data.lastname);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("password", data.password);
    formData.append("gender", data.gender.value);
    formData.append("image", data.image);
    formData.append("address", data.address);
    formData.append("birthdate", data.birthdate);
    try {
      await showToastSuccess(
        dispatch(
          updateUser({ _id: profileModel.model.data._id, user: formData })
        )
      );
      profileModel.closeModel();
    } catch (error) {
      showToastError(error);
    }
  };

  return (
    <div>
      <Header
        showModel={loginModel.showModel}
        showProfileModel={profileModel.showModel}
      />
      <Form onSubmit={handleSubmit(onSubmit)} className="Order">
        <Row className="Order__checkout shadow">
          <header>
            <h1>Check out 🗃️</h1>
            <i
              className="bx bxl-shopify"
              onClick={() => setShowOrderHistory(!showOrderHistory)}
            />
          </header>

          {/* render field list */}

          <Col md={5}>
            <FieldList
              defaultValues={defaultValues}
              register={register}
              control={control}
              errors={errors}
              filter={filter}
              setFilter={setFilter}
              setValue={setValue}
              selectedCity={defaultValues.city}
              selectedDistrict={defaultValues.district}
              selectedCommune={defaultValues.commune}
              city={city}
              district={district}
              commune={commune}
            />
          </Col>

          {/* Render product list */}
          <Col md={7}>
            {/* handle when order empty */}
            {order.length === 0 && !showOrderHistory ? (
              <div
                className="empty mt-0"
                style={{ backgroundColor: "transparent" }}
              >
                <i className="bx bx-basket animate__animated animate__swing">
                  <Badge className="bg-warning rounded-circle">0</Badge>
                </i>
                <div
                  onClick={() => history.push("/")}
                  className="button shadow-lg"
                >
                  Go Back Shop
                </div>
              </div>
            ) : (
              <div
                className="none-scroll"
                style={{
                  height: "100%",
                  backgroundColor: "#fff",
                  borderRadius: "1rem",
                  overflowY: "scroll",
                }}
              >
                {showOrderHistory && (
                  <OrderHistory showOrderHistory={showOrderHistory} />
                )}
                <div
                  className="Order__list"
                  style={
                    !state && !showOrderHistory
                      ? { height: "100% !important" }
                      : {}
                  }
                >
                  <div>
                    {/* Product List check out */}

                    {!showOrderHistory && (
                      <div>
                        {" "}
                        <Table className="table table-sm">
                          <thead>
                            <tr className="p-1">
                              <th>Product</th>
                              <th className="text-center">Size</th>
                              <th>Quantity</th>
                              <th>Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.map((product, index) => (
                              <OrderList key={index} product={product} />
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </div>
                </div>
                {!showOrderHistory && (
                  <div>
                    {/* Total */}
                    <footer className="mt-4">
                      <div>Total:</div>
                      <div>${total(order).toFixed(2)}</div>
                    </footer>

                    {!state && (
                      /* Check out button */
                      <Button style={{ position: "relative" }} type="submit">
                        Check out
                        {loading && (
                          <Spinner
                            style={{
                              position: "absolute",
                              bottom: "4px",
                              right: "4px",
                            }}
                            color="light"
                            size="sm"
                          >
                            {" "}
                          </Spinner>
                        )}
                      </Button>
                    )}
                    {/* Button when await check out */}
                    {state && (
                      <section
                        onClick={state === "pending" ? handleRemoveClick : null}
                        style={{
                          backgroundColor:
                            state === "pending"
                              ? "#f72a8d"
                              : state === "processing"
                              ? "cyan"
                              : "green",
                          color: "white",
                          cursor:
                            state === "processing" || state === "delivered"
                              ? "default"
                              : "pointer",
                        }}
                      >
                        <div>
                          {capitalizeFirstLetter(state)}
                          {/* React loading */}

                          {state !== "delivered" && (
                            <ReactLoading
                              type="balls"
                              color="white"
                              width="30px"
                              height="30px"
                            />
                          )}
                        </div>

                        <small>{getMessageOrderByState(state)}</small>
                      </section>
                    )}
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Form>

      {/* handle show login model */}
      {loginModel.model.show && (
        <LoginModel
          onLogin={handleLogin}
          closeModel={loginModel.closeModel}
          showModel={signupModel.showModel}
        />
      )}

      {/* handle show signup model */}
      {signupModel.model.show && (
        <SignUpModel
          onCreateUser={handleCreateUser}
          closeModel={signupModel.closeModel}
        />
      )}

      {/* handle show profile model */}
      {profileModel.model.show && (
        <Profile
          loading={userState.loading}
          onSubmit={handleProfileChange}
          model={profileModel.model}
          closeModel={profileModel.closeModel}
        />
      )}

      {/* handle show checkout modal */}
      {checkoutModal.model.show && (
        <CheckoutModal
          loading={false}
          onSubmit={() => {}}
          closeModel={profileModel.closeModel}
        />
      )}

      <Footer />
    </div>
  );
}

export default withRouter(MainPage);
