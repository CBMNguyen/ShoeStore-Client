import { createUser, updateUser, userLogin } from "app/userSlice";
import Footer from "components/Footer";
import Header from "components/Header";
import Loading from "components/Loading";
import LoginModel from "components/LoginModel";
import Pagination from "components/Pagination";
import Profile from "components/Profile";
import SignUpModel from "components/SignUpModel";
import {
  getOrderById,
  updateOrder,
  updateStateOrder,
} from "features/Order/orderSlice";
import useModel from "hooks/useModel";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Col,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  Table,
} from "reactstrap";
import {
  capitalizeFirstLetter,
  formatDate,
  getColorByState,
  showToastError,
  showToastSuccess,
} from "utils/common";

import deliveredLogo from "../../../../assets/images/delivery-logo.png";
import momoImage from "../../../../assets/images/MoMo_Logo.png";
import brandLogo from "../../../../assets/images/brandLogo.png";

import "./order.scss";
import OrderDetailModal from "features/Order/components/OrderDetailModal";
import { ORDER_STATE, PRODUCT_TOAST_OPTIONS } from "constants/globals";
import { toast } from "react-toastify";

function MainPage(props) {
  const dispatch = useDispatch();
  const { loading, user } = useSelector((state) => state.user);
  const { order, loading: orderLoading } = useSelector((state) => state.order);

  const [showInputMobile, setShowInputMobile] = useState(false);
  const [modal, setModal] = useState(false);
  const [nestedModal, setNestedModal] = useState(false);
  const [closeAll, setCloseAll] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState();
  const [filter, setFilter] = useState({
    page: 1,
    limit: 5,
  });

  const toggle = () => setModal(!modal);

  const toggleNested = () => {
    setNestedModal(!nestedModal);
  };

  const toggleAll = () => {
    setNestedModal(!nestedModal);
    setCloseAll(true);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setNestedModal(true);
      await dispatch(updateOrder(orderId));
      toggleAll();
      toast("Your order has been cancelled.", { ...PRODUCT_TOAST_OPTIONS });
    } catch (error) {
      console.log(error);
    }
  };

  const handleReceivedOrder = async () => {
    try {
      await dispatch(updateStateOrder(selectedOrder));
      toggle();
      toast("ShoesStore thank you so much.", { ...PRODUCT_TOAST_OPTIONS });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchOrderByUserId = async () => {
      try {
        await dispatch(getOrderById(user._id));
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrderByUserId();
  }, [dispatch, user._id]);

  const loginModel = useModel();
  const signupModel = useModel();
  const profileModel = useModel();

  // handle sign up add user
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

  const handlePageChange = (page) => {
    setFilter({ ...filter, page });
  };

  const start = (filter["page"] - 1) * filter["limit"];
  const end = filter["page"] * filter["limit"];

  return (
    <div className="Order">
      <Header
        showModel={loginModel.showModel}
        showProfileModel={profileModel.showModel}
        showInputMobile={showInputMobile}
        setShowInputMobile={setShowInputMobile}
      />
      {!orderLoading && (
        <Container className="shadow rounded-1">
          <Row className="my-0 my-md-5">
            {/* handle when order empty */}
            {order.length === 0 && (
              <div className="Order__empty">
                <i className="bx bxl-shopify animate__animated animate__swing">
                  <Badge className="bg-warning rounded-circle">0</Badge>
                </i>
                <Row className="w-75">
                  <Col md={6}>
                    <Link
                      to="/"
                      className="button shadow-lg text-decoration-none"
                    >
                      Home
                    </Link>
                  </Col>
                  <Col md={6}>
                    <Link
                      to="/products"
                      className="button shadow-lg text-decoration-none"
                    >
                      See other products
                    </Link>
                  </Col>
                </Row>
              </div>
            )}

            {order.length !== 0 && (
              <div className="py-2">
                <header className="d-flex justify-content-between">
                  <h2 className="text-uppercase">My Shopping Order 🛒</h2>
                  {/* navigation */}
                  <Breadcrumb className="mt-2 me-2">
                    <BreadcrumbItem>
                      <Link style={{ textDecoration: "none" }} to="/">
                        Home
                      </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>Order</BreadcrumbItem>
                  </Breadcrumb>
                </header>
                <div className="table-responsive">
                  <Table>
                    <thead
                      className="text-white"
                      style={{ backgroundColor: "deeppink" }}
                    >
                      <tr>
                        <th>#</th>
                        <th>Address</th>
                        <th>State</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Method</th>
                        <th>Order Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order
                        .slice(start, end)
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                        )
                        .map((item, index) => (
                          <tr style={{ verticalAlign: "middle" }} key={index}>
                            <th scope="row">{index + 1}</th>
                            <td style={{ minWidth: "300px" }}>
                              <code className="text-dark">
                                {item.address.split("#")[0]}
                              </code>
                            </td>
                            <td>
                              <Badge className={getColorByState(item.state)}>
                                {capitalizeFirstLetter(item.state)}
                              </Badge>
                            </td>
                            <td>
                              <Badge className="bg-warning">
                                ${item.total.toFixed(2)}
                              </Badge>
                            </td>
                            <td>
                              {item.payment ? (
                                <i className="bx bx-check text-success fs-3 ms-3"></i>
                              ) : (
                                <i className="bx bx-x text-danger text-danger fs-3 ms-3"></i>
                              )}
                            </td>
                            <td>
                              {item.paymentMethod ? (
                                <img
                                  src={momoImage}
                                  className="ms-3 rounded"
                                  width={28}
                                  height={28}
                                  alt="momoLogo"
                                />
                              ) : (
                                <img
                                  src={deliveredLogo}
                                  className="ms-2"
                                  width={40}
                                  height={28}
                                  alt="deliveredLogo"
                                />
                              )}
                            </td>
                            <td>
                              <Badge className="bg-dark">
                                {formatDate(item.createdAt)}
                              </Badge>
                            </td>
                            <td>
                              <i
                                onClick={() => {
                                  setSelectedOrder(item);
                                  toggle();
                                }}
                                className="Order__viewIcon bx bx-show fs-3 ms-2 text-primary"
                              ></i>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>

                <div className="d-flex justify-content-center mt-2">
                  <Pagination
                    filter={filter}
                    onPageChange={handlePageChange}
                    totalRow={order.length}
                  />
                </div>
              </div>
            )}
          </Row>
        </Container>
      )}

      {orderLoading && <Loading />}

      {/* Show login model */}
      {loginModel.model.show && (
        <LoginModel
          onLogin={handleLogin}
          closeModel={loginModel.closeModel}
          showModel={signupModel.showModel}
        />
      )}
      {/* Show sign up model */}
      {signupModel.model.show && (
        <SignUpModel
          onCreateUser={handleCreateUser}
          closeModel={signupModel.closeModel}
        />
      )}
      {profileModel.model.show && (
        <Profile
          loading={loading}
          onSubmit={handleProfileChange}
          model={profileModel.model}
          closeModel={profileModel.closeModel}
        />
      )}

      {/* Order Detail Modal */}

      <Modal isOpen={modal} toggle={toggle} fullscreen>
        <ModalHeader toggle={toggle} className="py-2">
          <div className="Order__logo">
            <h2>
              <Link to="/">
                Shoes Store{" "}
                <img className="img-fluid" src={brandLogo} alt="brandLogo" />
              </Link>
            </h2>
          </div>
        </ModalHeader>
        <ModalBody className="py-0">
          <OrderDetailModal
            onRemoveOrderClick={toggleNested}
            order={selectedOrder}
          />

          {/* Coonfirm remove order */}

          <Modal
            isOpen={nestedModal}
            toggle={toggleNested}
            onClosed={closeAll ? toggle : undefined}
          >
            <ModalHeader>
              <div className="Order__logo py-0">
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
            </ModalHeader>
            <ModalBody>
              <code className="text-secondary fs-6">
                Are you sure you want to cancel this order?
              </code>
            </ModalBody>
            <ModalFooter>
              <Button
                disabled={orderLoading}
                color="primary"
                className="btn-sm"
                onClick={() => handleCancelOrder(selectedOrder._id)}
              >
                Confirm
                {orderLoading && (
                  <Spinner size="sm" className="ms-2">
                    Loading
                  </Spinner>
                )}
              </Button>{" "}
              <Button
                disabled={orderLoading}
                color="secondary"
                className="btn-sm"
                onClick={toggleNested}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </ModalBody>
        <ModalFooter className="py-2 d-block">
          <Row>
            <Col>
              <div className="d-flex flex-column flex-md-row align-items-center">
                <div className="d-flex align-items-center me-2">
                  <code className="text-secondary">Payment Method:</code>
                  {selectedOrder?.paymentMethod ? (
                    <img
                      src={momoImage}
                      className="ms-3 rounded"
                      width={28}
                      height={28}
                      alt="momoLogo"
                    />
                  ) : (
                    <img
                      src={deliveredLogo}
                      className="ms-2"
                      width={40}
                      height={28}
                      alt="deliveredLogo"
                    />
                  )}
                </div>
                <div className="d-flex align-items-center mx-2">
                  <code className="text-secondary">Payment Status:</code>
                  {selectedOrder?.payment ? (
                    <i className="bx bx-check text-success fs-3 ms-3"></i>
                  ) : (
                    <i className="bx bx-x text-danger text-danger fs-3 ms-3"></i>
                  )}
                </div>
                <div className="d-flex align-items-center mx-2">
                  <code className="text-secondary me-4">Delivery charges</code>{" "}
                  <code className="fw-bold">
                    ${selectedOrder?.transportFee.toFixed(2)}
                  </code>
                </div>
                <div className="d-flex align-items-center">
                  <code className="text-secondary mx-3">Discount Code</code>
                  <code className="fw-bold">{selectedOrder?.discountCode}</code>
                </div>
                <div className="d-flex align-items-center">
                  <code className="text-secondary mx-3">Discount</code>
                  <code className="fw-bold">${selectedOrder?.discount}</code>
                </div>
              </div>
            </Col>
            <Col md={2}>
              <div className="float-end">
                {selectedOrder?.state === ORDER_STATE.shipping && (
                  <Button
                    disabled={orderLoading}
                    color="success"
                    className="rounded-1 btn-sm mx-1 shadow"
                    onClick={handleReceivedOrder}
                  >
                    <code className="text-white text-uppercase">
                      successful delivery
                    </code>

                    {orderLoading && <Spinner size="sm"> </Spinner>}
                  </Button>
                )}
                {!selectedOrder?.payment && (
                  <Button
                    disabled={orderLoading}
                    color="danger"
                    className="rounded-1 btn-sm"
                    style={{
                      backgroundImage:
                        "linear-gradient(136deg) ,rgb(242, 113, 33) 0%,rgb(233, 64, 87) 50%,rgb(138, 35, 135) 100%",
                      display:
                        selectedOrder?.state !== ORDER_STATE.pending
                          ? "none"
                          : "inline-block",
                    }}
                    onClick={toggleNested}
                  >
                    <code className="text-white text-uppercase">
                      Cancel Order
                    </code>

                    {orderLoading && <Spinner size="sm"> </Spinner>}
                  </Button>
                )}{" "}
                <Button
                  color="dark"
                  className={
                    selectedOrder?.payment
                      ? "rounded-1 btn-sm"
                      : "rounded-1 btn-sm"
                  }
                  onClick={toggle}
                >
                  <code className="text-white text-uppercase">Close</code>
                </Button>
              </div>
            </Col>
          </Row>
        </ModalFooter>
      </Modal>

      <Footer />
    </div>
  );
}

export default MainPage;
