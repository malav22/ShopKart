import React from "react";
import ErrorIcon from "@material-ui/icons/Error";
import "./NotFound.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useAlert } from 'react-alert'
import { useEffect } from "react";
import {useSelector} from "react-redux";

const NotFound = () => {
    const alert = useAlert();
    const { isAuthenticated, user } = useSelector((state) => state.user);
    useEffect(() => {
        if(isAuthenticated && user.role !== "admin"){
            alert.error("User is not an admin");
        }
    },[isAuthenticated]);
  return (
    <div className="PageNotFound">
      <ErrorIcon />

      <Typography>Page Not Found </Typography>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
    </div>
  );
};

export default NotFound;