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
  }, [dispatch, loginModel]);

  const Home = React.lazy(() => import("./features/Home"));
  const Cart = React.lazy(() => import("./features/Cart"));
  const Order = React.lazy(() => import("./features/Order"));
  const ResetPassWord = React.lazy(() => import("./components/ResetPassWord"));

  return (
    <div className="App">
      <Suspense fallback={<Loading />}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/cart" component={Cart} />
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
