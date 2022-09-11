import NotFound from "components/NotFound";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import MainPage from "./pages/MainPage";
import ProductDetail from "./pages/ProductDetail";
import { fetchProduct } from "./productSlice";

function Product(props) {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  // fetch data for home page
  useEffect(() => {
    dispatch(fetchProduct());
  }, [dispatch]);
  return (
    <Switch>
      <Route exact path={match.url} component={MainPage} />
      <Route exact path={match.url + "/:productId"} component={ProductDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default Product;
