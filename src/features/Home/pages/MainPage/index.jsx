import Header from "components/Header";
import Loading from "components/Loading";
import { fetchCategory } from "features/Home/categorySlice";
import { fetchColor } from "features/Home/colorSlice";
import Filter from "features/Home/components/Filter";
import ProductList from "features/Home/components/ProductList";
import { fetchProduct } from "features/Home/productSlice";
import { fetchSize } from "features/Home/sizeSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function MainPage(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchColor());
    dispatch(fetchCategory());
    dispatch(fetchProduct());
    dispatch(fetchSize());
  }, [dispatch]);

  const { color } = useSelector((state) => state.color);
  const { size } = useSelector((state) => state.size);
  const { category } = useSelector((state) => state.category);
  const { products } = useSelector((state) => state.products);

  const [filter, setFilter] = useState({
    category: "",
    color: "",
    size: "",
    name: "",
    price: {
      minPrice: 42.32,
      maxPrice: 1082.23,
    },
    isIncreasePrice: 0,
  });

  const filterProduct = products.filter(
    (product) =>
      (filter["color"] === ""
        ? true
        : product.color.findIndex((c) => c.color === filter["color"]) !== -1) &&
      (filter["size"] === ""
        ? true
        : product.size.findIndex((c) => c.size === filter["size"]) !== -1) &&
      product.originalPrice >= filter["price"]["minPrice"] &&
      product.originalPrice <= filter["price"]["maxPrice"] &&
      product.category.name.indexOf(filter["category"]) !== -1 &&
      product.name.toLowerCase().indexOf(filter["name"].toLowerCase()) !== -1
  );

  let sortProductByPrice = filterProduct;

  filter.isIncreasePrice === 1 &&
    (sortProductByPrice = filterProduct
      .slice()
      .sort((a, b) => a.originalPrice - b.originalPrice));

  filter.isIncreasePrice === -1 &&
    (sortProductByPrice = filterProduct
      .slice()
      .sort((a, b) => b.originalPrice - a.originalPrice));

  const handleColorChange = (color) => {
    setFilter({ ...filter, color });
  };

  const handleSizeChange = (size) => {
    setFilter({ ...filter, size });
  };

  const handlePriceChange = (price) => {
    setFilter({ ...filter, price });
  };

  const handleCategoryChange = (category) => {
    setFilter({ ...filter, category });
  };

  const handleNameChange = (name) => {
    setFilter({ ...filter, name });
  };

  const handleInCreasePriceChange = (isIncreasePrice) => {
    setFilter({ ...filter, isIncreasePrice });
  };

  return (
    <div>
      {products.length === 0 ? (
        <Loading />
      ) : (
        <div>
          <Header onNameChange={handleNameChange} />
          <Filter
            color={color}
            category={category}
            size={size}
            filter={filter}
            minPrice={42.32}
            maxPrice={1083}
            onColorChange={handleColorChange}
            onSizeChange={handleSizeChange}
            onCategoryChange={handleCategoryChange}
            onPriceChange={handlePriceChange}
          />
          <ProductList
            products={sortProductByPrice}
            filter={filter}
            onImage
            onInCreasePriceChange={handleInCreasePriceChange}
          />
        </div>
      )}
    </div>
  );
}

export default MainPage;
