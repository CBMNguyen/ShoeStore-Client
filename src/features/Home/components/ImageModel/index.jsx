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
  selectProductDetail: PropTypes.object.isRequired,
  closeModel: PropTypes.func.isRequired,
};

function ImageModel(props) {
  const { product, selectProductDetail, closeModel } = props;

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
        {product.productDetail
          .find(
            ({ color }) => color.color === selectProductDetail.selectedColor
          )
          .images.map((img) => (
            <img key={img} src={img} alt={img} />
          ))}
      </Slider>
    </div>
  );
}

export default ImageModel;
