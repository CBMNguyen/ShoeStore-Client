import { logOut } from "app/userSlice";
import { PRODUCT_TOAST_OPTIONS } from "constants/globals";
import jwt from "jsonwebtoken";
import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { toast } from "react-toastify";
import firebase from "firebase";

function ProtectedRoute(props) {
  const { token } = useSelector((state) => state.user);
  const { component: Component, ...rest } = props;
  const dispatch = useDispatch();

  return (
    <Route
      {...rest}
      render={(props) => {
        try {
          jwt.verify(token, process.env.REACT_APP_JWT_KEY);
          return <Component />;
        } catch (error) {
          toast.error("Please check login.", { ...PRODUCT_TOAST_OPTIONS });
          firebase.auth().signOut();
          dispatch(logOut());
          return (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          );
        }
      }}
    />
  );
}

export default ProtectedRoute;
