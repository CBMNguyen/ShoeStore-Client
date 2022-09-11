import NotFound from "components/NotFound";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import MainPage from "./pages/MainPage";

function Favourite(props) {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route exact path={match.url + "/:userId"} component={MainPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default Favourite;
