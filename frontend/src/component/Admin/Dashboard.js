import React, { useEffect } from "react";
import Sidebar from "./Sidebar.js";
import "./dashboard.css";
import { Typography } from "@material-ui/core";
import { Link ,useNavigate} from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProduct } from "../../actions/productAction";
import { getAllOrders } from "../../actions/orderAction.js";
import { getAllUsers } from "../../actions/userAction.js";
import MetaData from "../layout/Header/MetaData";
import {useAlert} from 'react-alert';
import {Chart, ArcElement,CategoryScale} from 'chart.js'
import {registerables } from 'chart.js';
Chart.register(ArcElement,CategoryScale);
Chart.register(...registerables);
const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();
  const {user,isAuthenticated} = useSelector((state) => state.user);
  // console.log(user.role);
 
  const { products } = useSelector((state) => state.products);

  const { orders } = useSelector((state) => state.allOrders);

  const { users } = useSelector((state) => state.allUsers);

  let outOfStock = 0;
  // console.log(products);
  let totalProducts = 0;
 if(products){
    totalProducts = products.length;
    products.forEach((item) => {
      if (item.stock <=0) {
        outOfStock += 1;
      }
    });
  }
    useEffect(() => {
      // if(isAuthenticated){
        // if(!isAuthenticated){
        //   // return <Navigate to="/login"/>
        //   navigate("/login");
        // }
        if(isAuthenticated && user.role !== "admin"){
          alert.error("You are not authorized to this resource.")
          navigate("/account");
          // }
        }
        dispatch(getAdminProduct());
    
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch,isAuthenticated]);

  let totalAmount = 0;
  orders &&
    orders.forEach((item) => {
      totalAmount += item.totalPrice;
    });

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, totalAmount],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["rgb(252, 45, 45)", "rgb(120, 255, 108)"],
        hoverBackgroundColor: ["rgb(252, 45, 45,0.7)", "rgb(120, 255, 108,0.7)"],
        data: [outOfStock,  totalProducts - outOfStock],
      },
    ],
  };

  return (
    <div className="dashboard">
      <MetaData title="Dashboard - Admin Panel" />
      <Sidebar />
      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>

        <div className="dashboardSummary">
          <div>
            <p>
              Total Amount <br /> ₹{totalAmount}
            </p>
          </div>
          <div className="dashboardSummaryBox2">
            <Link to="/admin/products">
              <p>Product</p>
              <p>{totalProducts}</p>
            </Link>
            <Link to="/admin/orders">
              <p>Orders</p>
              <p>{orders && orders.length}</p>
            </Link>
            <Link to="/admin/users">
              <p>Users</p>
              <p>{users && users.length}</p>
            </Link>
          </div>
          {/* <div className="dashboardSummaryBox3">
            <Link to="#">
              <p>Out of Stock</p>
              <p>{outOfStock}</p>
            </Link>
            <Link to="#">
              <p>In Stock</p>
              <p>{products && products.length - outOfStock}</p>
            </Link>
          </div> */}
        </div>

        <div className="lineChart">
          <Line data={lineState} />
        </div>
        <div className="doughnutChart">
          <Doughnut data={doughnutState} />
        </div>
       </div>
    </div>
  );
};

export default Dashboard;