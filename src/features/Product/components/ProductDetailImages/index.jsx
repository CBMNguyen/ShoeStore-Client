import Loading from "components/Loading";
import { PRODUCT_TOAST_OPTIONS } from "constants/globals";
import { addToCart, selectQuantity } from "features/Cart/cartSlice";
import {
  createFavourite,
  deleteFavourite,
} from "features/Favourite/FavouriteSlice";
import { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/scss/image-gallery.scss";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Col,
  Container,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import { capitalizeFirstLetter } from "utils/common";
import brandLogo from "../../../../assets/images/brandLogo.png";
import "./productDetailImage.scss";

function ProductDetailImage({
  product,
  showLoginModal,
  token,
  user,
  favourites,
  favouriteLoading,
}) {
  const [open, setOpen] = useState("");
  const [selectProductDetail, setSelectProductDetail] = useState({
    selectedSize: null,
    selectedColor: "",
    selectedQuantity: 1,
  });

  const [modal, setModal] = useState(false);
  useEffect(() => {
    if (!product) return;
    setSelectProductDetail({
      ...selectProductDetail,
      selectedColor: product.productDetail[0].color.color,
    });
  }, [product]);

  const handleQuantityChange = (quantity) => {
    setSelectProductDetail({
      ...selectProductDetail,
      selectedQuantity: quantity,
    });
  };

  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };
  const hasProductFavourite = () => {
    const favouriteList = favourites.filter(
      (favourite) => favourite.productId._id === product._id
    );
    return favouriteList.length > 0;
  };

  const handleProductFavouriteClick = async () => {
    if (!token) {
      showLoginModal();
    } else {
      try {
        if (hasProductFavourite()) {
          setModal(true);
        } else {
          await dispatch(
            createFavourite({
              userId: user._id,
              productId: product._id,
            })
          );
          toast("Product added to favorites.", {
            ...PRODUCT_TOAST_OPTIONS,
          });
        }
      } catch (error) {
        toast.error(error.message, {
          ...PRODUCT_TOAST_OPTIONS,
        });
      }
    }
  };

  const handleRemoveProductFavourite = async () => {
    try {
      const favourite = favourites.find(
        (item) => item.productId._id === product._id
      );
      try {
        await dispatch(deleteFavourite(favourite._id));
        toast("The product has been removed from favorites", {
          ...PRODUCT_TOAST_OPTIONS,
        });
      } catch (error) {}
      setModal(!modal);
    } catch (error) {
      toast.error(error.message, {
        ...PRODUCT_TOAST_OPTIONS,
      });
    }
  };

  const { cart } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  const handleAddtoCart = async (product) => {
    if (!selectProductDetail.selectedColor) {
      toast("Please select color.", {
        ...PRODUCT_TOAST_OPTIONS,
      });
      return;
    }

    if (!selectProductDetail.selectedSize) {
      toast("Please select size.", {
        ...PRODUCT_TOAST_OPTIONS,
      });
      return;
    }
    if (selectProductDetail.selectedQuantity <= 0) {
      toast("Please enter valid quantity", {
        ...PRODUCT_TOAST_OPTIONS,
      });
      return;
    }

    const { quantity } = product.productDetail
      .find((item) => item.color.color === selectProductDetail.selectedColor)
      .sizeAndQuantity.find(
        (item) => item.size.size === selectProductDetail.selectedSize
      );

    if (quantity === 0) {
      toast("Current size are currently out of stock", {
        ...PRODUCT_TOAST_OPTIONS,
      });
      return;
    }

    const cartItemIndex = cart.findIndex(
      (productItem) =>
        productItem._id === product._id &&
        productItem.selectedColor === selectProductDetail.selectedColor &&
        productItem.selectedSize === selectProductDetail.selectedSize
    );

    if (cartItemIndex >= 0) {
      const quantity =
        cart[cartItemIndex].selectedQuantity +
        selectProductDetail.selectedQuantity;
      dispatch(selectQuantity({ cartItemIndex, quantity }));
      toast("Product added to cart", {
        ...PRODUCT_TOAST_OPTIONS,
      });

      return;
    }
    await dispatch(addToCart({ ...product, ...selectProductDetail }));
    toast("Product added to cart", {
      ...PRODUCT_TOAST_OPTIONS,
    });
  };

  return (
    <div className="ProductDetailImage">
      <Container>
        {product && (
          <Row>
            <Col lg={8}>
              <div className="mt-5 position-relative" style={{ top: "-200px" }}>
                {selectProductDetail.selectedColor !== "" && (
                  <ImageGallery
                    items={
                      product.productDetail
                        .find(
                          ({ color }) =>
                            color.color === selectProductDetail.selectedColor
                        )
                        ?.images?.map((image) => ({
                          original: image,
                          thumbnail: image,
                        })) || []
                    }
                  />
                )}
              </div>
            </Col>
            <Col lg={4}>
              <div style={{ width: "90%", margin: "auto" }}>
                <Breadcrumb className="mt-2">
                  <BreadcrumbItem>
                    <Link to="/" className="text-decoration-none">
                      <code>Home</code>
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <Link className="text-decoration-none" to="/products">
                      <code>Products</code>
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem active>
                    <code>{product.name}</code>
                  </BreadcrumbItem>
                </Breadcrumb>
                {/* Product title */}

                <div className="ProductDetailImage__title">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>{capitalizeFirstLetter(product.category.name)}</div>
                    <i
                      onClick={handleProductFavouriteClick}
                      className={`bx ${
                        !user._id || (!hasProductFavourite() && !user?.id)
                          ? "bx-heart"
                          : "bxs-heart text-danger"
                      } me-4`}
                      style={{ cursor: "pointer" }}
                    ></i>
                  </div>
                  <div>{product.name}</div>
                </div>

                {/* Product color */}

                <div className="ProductDetailImage__color">
                  <header>Color</header>
                  <section>
                    {product.productDetail.map(({ color }) => (
                      <div
                        key={color.color}
                        className="shadow"
                        onClick={() =>
                          setSelectProductDetail({
                            ...selectProductDetail,
                            selectedColor: color.color,
                          })
                        }
                        style={
                          selectProductDetail.selectedColor === color.color
                            ? {
                                backgroundColor: color.color,
                                border:
                                  color.color === "orange"
                                    ? "2px solid black"
                                    : "2px solid orange",
                                transform: "scale(1.05)",
                              }
                            : { backgroundColor: color.color }
                        }
                      />
                    ))}
                  </section>
                </div>

                {/* Product size */}

                <div className="ProductDetailImage__size">
                  <header>Size</header>
                  <section>
                    {product?.productDetail
                      ?.find(
                        (item) =>
                          item.color.color === selectProductDetail.selectedColor
                      )
                      ?.sizeAndQuantity.map(({ size }) => (
                        <div
                          className="shadow"
                          key={size.size}
                          onClick={() =>
                            setSelectProductDetail({
                              ...selectProductDetail,
                              selectedSize: size.size,
                            })
                          }
                          style={
                            selectProductDetail?.selectedSize === size.size
                              ? {
                                  backgroundColor: "#000",
                                  color: "white",
                                  transform: "scale(1.08)",
                                }
                              : {}
                          }
                        >
                          {size.size}
                          <span className="icon">&nbsp;</span>
                        </div>
                      ))}
                  </section>
                </div>

                {/* Select quantity */}

                <div className="ProductDetailImage__quantity">
                  <header>Quantity</header>
                  <div className="d-flex align-items-center my-3">
                    <Button
                      onClick={() =>
                        handleQuantityChange(
                          selectProductDetail.selectedQuantity - 1
                        )
                      }
                      className="btn btn-light shadow-sm"
                    >
                      <i className="bx bx-minus"></i>
                    </Button>
                    <Input
                      type="number"
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      value={selectProductDetail.selectedQuantity}
                      className="w-25 border-1 mx-2 text-center"
                    />
                    <Button
                      onClick={() =>
                        handleQuantityChange(
                          selectProductDetail.selectedQuantity + 1
                        )
                      }
                      className="btn btn-light shadow-sm"
                    >
                      <i className="bx bx-plus"></i>
                    </Button>
                  </div>
                </div>

                <Accordion className="mt-4" flush open={open} toggle={toggle}>
                  <AccordionItem className="accordion-item">
                    <AccordionHeader targetId="1">Description</AccordionHeader>
                    <AccordionBody accordionId="1">
                      {product.description}
                    </AccordionBody>
                  </AccordionItem>
                  <AccordionItem className="accordion-item">
                    <AccordionHeader targetId="2">Material</AccordionHeader>
                    <AccordionBody accordionId="2">
                      <ul>
                        {product.material.split("-").map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </AccordionBody>
                  </AccordionItem>
                  <AccordionItem className="accordion-item">
                    <AccordionHeader targetId="3">
                      Time and method of payment
                    </AccordionHeader>
                    <AccordionBody accordionId="3">
                      Express delivery: from 2 - 5 working days Receive goods at
                      the store - Free: Within 24-72 hours
                    </AccordionBody>
                  </AccordionItem>
                  <AccordionItem className="accordion-item">
                    <AccordionHeader targetId="4">
                      Exchange policy
                    </AccordionHeader>
                    <AccordionBody accordionId="4">
                      Support online exchange within 14 days for full product
                      price.
                    </AccordionBody>
                  </AccordionItem>
                </Accordion>

                <div className="ProductDetailImage__button mb-2">
                  <button
                    className="shadow-lg"
                    onClick={() => handleAddtoCart(product)}
                  >
                    <div>
                      <i className="bx bx-basket" />
                      {`$${product.originalPrice} - Add to Cart`}
                    </div>
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        )}

        {/* Show loading when load product */}
        {!product && <Loading />}

        <div>
          <Modal isOpen={modal} toggle={() => setModal(!modal)}>
            <ModalHeader toggle={() => setModal(!modal)}>
              <div className="Header__logo">
                <h2 className="my-0">
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
              {`Are you sure you want to remove this product from favorites ?`}
            </ModalBody>
            <ModalFooter>
              <Button
                disabled={favouriteLoading}
                className="btn btn-sm"
                color="primary"
                onClick={handleRemoveProductFavourite}
              >
                Agree
                {favouriteLoading && (
                  <Spinner size="sm" className="ms-2">
                    Loading
                  </Spinner>
                )}
              </Button>{" "}
              <Button
                disabled={favouriteLoading}
                className="btn btn-sm"
                color="secondary"
                onClick={() => setModal(!modal)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </Container>
    </div>
  );
}

export default ProductDetailImage;
