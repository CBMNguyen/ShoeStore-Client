import { createUser, updateUser, userLogin } from "app/userSlice";
import Footer from "components/Footer";
import Header from "components/Header";
import LoginModel from "components/LoginModel";
import Profile from "components/Profile";
import SignUpModel from "components/SignUpModel";
import ProductItem from "features/Product/components/ProductItem";
import { fetchProduct } from "features/Product/productSlice";
import useModel from "hooks/useModel";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Button,
  Carousel,
  CarouselControl,
  CarouselIndicators,
  CarouselItem,
  Col,
  Container,
  Row,
} from "reactstrap";
import { showToastError, showToastSuccess } from "utils/common";
import "./home.scss";
import slider1 from "../../assets/images/slider1.webp";
import slider2 from "../../assets/images/slider_2.jpg";
import slider3 from "../../assets/images/slider3.webp";

function Home(props) {
  const dispatch = useDispatch();

  // fetch data for home page
  useEffect(() => {
    dispatch(fetchProduct());
  }, [dispatch]);

  // Scroll To Top

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { products } = useSelector((state) => state.products);
  const { loading } = useSelector((state) => state.user);

  const [showInputMobile, setShowInputMobile] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(
    products[0]?._id || ""
  );

  const loginModel = useModel();
  const signupModel = useModel();
  const profileModel = useModel();

  const items = [
    {
      src: slider1,
      key: 1,
    },
    {
      src: slider2,
      key: 2,
    },
    {
      src: slider3,
      key: 3,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = items.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      >
        <Link to="/products">
          <img src={item.src} alt={item.altText} className="img-fluid" />
        </Link>
      </CarouselItem>
    );
  });

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

  return (
    <div className="Home">
      <Header
        showModel={loginModel.showModel}
        showProfileModel={profileModel.showModel}
        showInputMobile={showInputMobile}
        setShowInputMobile={setShowInputMobile}
      />

      {/* Slider */}

      <Carousel
        className="Home__carousel"
        activeIndex={activeIndex}
        next={next}
        previous={previous}
      >
        <CarouselIndicators
          items={items}
          activeIndex={activeIndex}
          onClickHandler={goToIndex}
        />
        {slides}
        <CarouselControl
          direction="prev"
          directionText="Previous"
          onClickHandler={previous}
        />
        <CarouselControl
          direction="next"
          directionText="Next"
          onClickHandler={next}
        />
      </Carousel>

      {/* Contact */}
      <div className="bg-light">
        <Container>
          <Row className="py-5">
            <Col>
              <div className="text-center">
                <div>
                  <i className="bx bxl-sketch fs-1"></i>
                </div>
                <h3 className="text-uppercase text-warning">
                  Genuine commitment
                </h3>
                <code className="text-dark">100% Authentic</code>
                <p className="mt-2">
                  Committed to genuine products from Europe, America...
                </p>
              </div>
            </Col>
            <Col>
              <div className="text-center">
                <div>
                  <i className="bx bxs-truck fs-1"></i>
                </div>
                <h3 className="text-uppercase text-warning">
                  Express delivery
                </h3>
                <code className="text-dark">very fast</code>
                <p className="mt-2">SHIP speed 1 hour to receive goods</p>
              </div>
            </Col>
            <Col>
              <div className="text-center">
                <div>
                  <i className="bx bx-phone-call fs-1"></i>
                </div>
                <h3 className="text-uppercase text-warning">
                  Supporting 24/24
                </h3>
                <code className="text-dark">0362446521</code>
                <p className="mt-2">Call now</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Feature Product */}

      <Container>
        <h3 className="text-uppercase text-center my-5 Home__title">
          Featured products
        </h3>
        <Row>
          {products
            .slice()
            .filter((item) => item.promotionPercent === 0 && !item.state)
            .slice(0, 8)
            .map((product) => (
              <ProductItem
                key={product._id}
                product={product}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
              />
            ))}
        </Row>

        <Button className="btn bg-dark btn-sm mt-4 d-block m-auto">
          <Link className="text-decoration-none text-white" to="/products">
            View All
          </Link>
        </Button>
      </Container>

      {/* Discount Products */}

      <Container>
        <h3 className="text-uppercase text-center my-5 Home__title">
          Discount products
        </h3>
        <Row>
          {products
            .slice()
            .filter((item) => item.promotionPercent !== 0 && !item.state)
            .slice(0, 8)
            .map((product) => (
              <ProductItem
                key={product._id}
                product={product}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
              />
            ))}
        </Row>

        <Button className="btn bg-dark btn-sm my-4 d-block m-auto">
          <Link className="text-decoration-none text-white" to="/products">
            View All
          </Link>
        </Button>
      </Container>

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
      <Footer />
    </div>
  );
}

export default Home;
