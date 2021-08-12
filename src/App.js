import NotFound from "components/NotFound";
import ProtectedRoute from "components/ProtectedRoute";
import Cart from "features/Cart";
import Home from "features/Home";
import Order from "features/Order";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.scss";

import firebase from "firebase";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fakeUpdateUser } from "app/userSlice";

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
        const token = await user.getIdToken();
        const image = user.photoURL;
        dispatch(fakeUpdateUser({ token, user: { image, test: "test" } }));
      });
    return () => unregisterAuthObserver();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/cart" component={Cart} />
          <ProtectedRoute path="/order" component={Order} />
          <Route component={NotFound} />
        </Switch>
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
