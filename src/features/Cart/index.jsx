import NotFound from "components/NotFound";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import MainPage from "./pages/MainPage";

function Cart(props) {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route exact path={match.url} component={MainPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default Cart;
