import {
  LeftArrowDirection,
  RightArrowDirection,
} from "components/ArrowDirection";
import { STYLE_MODEL } from "constants/globals";
import PropTypes from "prop-types";
import React from "react";
import Slider from "react-slick";
import "./imagemodel.scss";

ImageModel.propTypes = {
  product: PropTypes.object.isRequired,
  closeModel: PropTypes.func.isRequired,
};

function ImageModel(props) {
  const { product, closeModel } = props;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    centerMode: true,
    prevArrow: <LeftArrowDirection />,
    nextArrow: <RightArrowDirection />,
  };

  return (
    <div className="ImageModel animation-fade-in" style={STYLE_MODEL}>
      <i onClick={() => closeModel()} className="bx bx-x" />

      <Slider className="ImageModel__list" {...settings}>
        {product.productDetail[0].images.map((img) => (
          <img key={img} src={img} alt={img} />
        ))}
      </Slider>
    </div>
  );
}

export default ImageModel;
