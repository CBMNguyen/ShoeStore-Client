import NotFound from "components/NotFound";
import Cart from "features/Cart";
import Home from "features/Home";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/cart" component={Cart} />
          <Route component={NotFound} />
        </Switch>
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
