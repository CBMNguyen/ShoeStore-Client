import { userLogin } from "app/userSlice";
import Loading from "components/Loading";
import NotFound from "components/NotFound";
import ProtectedRoute from "components/ProtectedRoute";
import firebase from "firebase";
import useModel from "hooks/useModel";
import React, { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { showToastError } from "utils/common";
import "./App.scss";

// Configure Firebase.
const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_DOMAIN_KEY,
  // ...
};

firebase.initializeApp(config);

function App() {
  const loginModel = useModel();
  const dispatch = useDispatch();
  // test login firebase remember remove
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(async (user) => {
        if (user) {
          try {
            dispatch(userLogin({ token: user.getIdToken() }));
            loginModel.closeModel();
          } catch (error) {
            showToastError(error);
          }
        }
      });
    return () => unregisterAuthObserver();
  }, []);

  // const Home = React.lazy(() => import("./features/Home"));
  const Home = React.lazy(() => import("./features/Home"));
  const Favourite = React.lazy(() => import("./features/Favourite"));
  const Cart = React.lazy(() => import("./features/Cart"));
  const Order = React.lazy(() => import("./features/Order/"));
  const Product = React.lazy(() => import("./features/Product"));
  const ResetPassWord = React.lazy(() => import("./components/ResetPassWord"));

  return (
    <div className="App">
      <Suspense fallback={<Loading />}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/products" component={Product} />
            <Route path="/cart" component={Cart} />
            <ProtectedRoute path="/favourite" component={Favourite} />
            <ProtectedRoute path="/order" component={Order} />
            <Route path="/resetpassword/:email" component={ResetPassWord} />
            <Route component={NotFound} />
          </Switch>
          <ToastContainer />
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;
