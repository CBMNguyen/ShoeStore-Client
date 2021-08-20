import { fakeUpdateUser } from "app/userSlice";
import Loading from "components/Loading";
import NotFound from "components/NotFound";
import ProtectedRoute from "components/ProtectedRoute";
import firebase from "firebase";
import React, { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.scss";

// Configure Firebase.
const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_DOMAIN_KEY,
  // ...
};

firebase.initializeApp(config);

function App() {
  const dispatch = useDispatch();
  // test login firebase remember remove
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(async (user) => {
        if (user) {
          const token = await user.getIdToken();
          const image = user.photoURL;
          dispatch(fakeUpdateUser({ token, user: { image, test: "test" } }));
        }
      });
    return () => unregisterAuthObserver();
  }, [dispatch]);

  const Home = React.lazy(() => import("./features/Home"));
  const Cart = React.lazy(() => import("./features/Cart"));
  const Order = React.lazy(() => import("./features/Order"));

  return (
    <div className="App">
      <Suspense fallback={<Loading />}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/cart" component={Cart} />
            <ProtectedRoute path="/order" component={Order} />
            <Route component={NotFound} />
          </Switch>
          <ToastContainer />
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;
