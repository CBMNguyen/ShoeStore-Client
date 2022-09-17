import NotFound from "components/NotFound";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Checkout from "./pages/Checkout";
import MainPage from "./pages/MainPage";

function Order(props) {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route exact path={match.url} component={MainPage} />
      <Route path={`${match.url}/checkout`} component={Checkout} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default Order;
