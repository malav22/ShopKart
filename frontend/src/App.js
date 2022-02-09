import './App.css';
import Header from './component/layout/Header/Header.js';
import { BrowserRouter , Route,Routes,Switch } from 'react-router-dom';
import webFont from 'webfontloader';
import React  from 'react';
import Footer from './component/layout/Footer/Footer.js';
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import { useAlert } from 'react-alert'
import Loader from './component/layout/Loader/Loader';
import Products from './component/Product/Products.js'
import Search from './component/Product/Search.js'
import LoginSignUp from './component/User/LoginSignUp.js'
import Profile from './component/User/Profile.js'
import store from "./store";
import { loadUser } from './actions/userAction';
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useSelector } from "react-redux";
import ProtectedRoute from "./component/Route/ProtectedRoute.js";
import UpdateProfile from './component/User/UpadteProfile.js';
import UpdatePassword from './component/User/UpadtePassword.js';
import ForgotPassword from './component/User/ForgotPassword.js';
import ResetPassword from "./component/User/ResetPassword";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import axios from "axios";
import { useEffect, useState } from "react";
import Payment from './component/Cart/Payment.js';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess.js"
import MyOrders from './component/Order/MyOrders.js';
import OrderDetails from './component/Order/OrderDetails.js';
import Dashboard from './component/Admin/Dashboard.js';
import ProductList from './component/Admin/ProductList.js';
import NewProduct from './component/Admin/NewProduct.js';
import UpdateProduct from "./component/Admin/UpdateProduct.js";
import OrderList from "./component/Admin/OrderList.js";
import ProcessOrder from "./component/Admin/ProcessOrder.js";
import UsersList from "./component/Admin/UsersList.js";
import UpdateUser from "./component/Admin/UpdateUser.js";
import ProductReviews from "./component/Admin/ProductReviews.js";
import Contact from "./component/layout/Contact/Contact.js";
import About from "./component/layout/About/About.js";
import NotFound from "./component/layout/Not Found/NotFound.js";


function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
  const { data } = await axios.get("/api/v1/stripeapikey");
  // console.log(data);
    setStripeApiKey(data.stripeApiKey);
  }
  const alert = useAlert()
  React.useEffect(()=>{
    webFont.load({
      google:{
        families: ["Roboto","Droid Sans","Chilanka"],
      }
    });

    store.dispatch(loadUser());
    getStripeApiKey();

  },[]);
  return (
    <BrowserRouter>
      <Header/>
      {isAuthenticated && <UserOptions user={user} />}

      <Routes>
      {isAuthenticated && stripeApiKey &&
            <Route path="/process/payment" element={
              <Elements stripe={loadStripe(stripeApiKey)}>
                <Payment/>
              </Elements>
            }>
            </Route>
        }
        <Route  path="/" element={<Home />}></Route>
        {/* <Route  path="/loader" element={<Loader />}></Route> */}
        <Route  path="/product/:id" element={<ProductDetails />}></Route>
        <Route  path="/products" element={<Products />}></Route>
        <Route  path="/products/:keyword" element={<Products />}></Route>
        <Route  path="/Search" element={<Search />}></Route>
        <Route  path="/login" element={<LoginSignUp />}></Route>

        {isAuthenticated && <Route  path="/account" element={<Profile />}></Route>}
        {isAuthenticated &&<Route  path="/me/update" element={<UpdateProfile />}></Route>}
        {isAuthenticated &&<Route  path="/password/update" element={<UpdatePassword />}></Route>}
        <Route  path="/password/forgot" element={<ForgotPassword />}></Route>
        <Route path="/password/reset/:token" element={<ResetPassword/>}></Route>
        <Route path="/cart" element={<Cart/>}></Route>
        <Route path="/shipping" element={<Shipping/>}></Route>
        {isAuthenticated && <Route path="/order/confirm" element={<ConfirmOrder/>}></Route>}
        {isAuthenticated && <Route path="/success" element={<OrderSuccess/>}></Route>}
        {isAuthenticated && <Route path="/orders" element={<MyOrders/>}></Route>}
        {isAuthenticated && <Route path="/order/:id" element={<OrderDetails/>}></Route>}
        {isAuthenticated && user.role === 'admin' && <Route path="/admin/dashboard" element={<Dashboard/>}></Route>}
        {isAuthenticated && user.role === 'admin' && <Route path="/admin/products" element={<ProductList/>}></Route>}
        {isAuthenticated && user.role === 'admin' && <Route path="/admin/product/:id" element={<UpdateProduct/>} ></Route>}
        {isAuthenticated && user.role === 'admin' && <Route path="/admin/product" element={<NewProduct/>}></Route>}
        {isAuthenticated && user.role === 'admin' && <Route path="/admin/orders" element={<OrderList/>}></Route>}
        {isAuthenticated && user.role === 'admin' && <Route path="/admin/order/:id" element={<ProcessOrder/>}/>}
        {isAuthenticated && user.role === 'admin' && <Route path="/admin/users" element={<UsersList/>} />}
        {isAuthenticated && user.role === 'admin' && <Route path="/admin/user/:id" element={<UpdateUser/>} />}
        {isAuthenticated && user.role === 'admin' && <Route path="/admin/reviews" element={<ProductReviews/>}/>}

        {/* <Route path="/admin/dashboard" element={
        <ProtectedRoute  isAdmin={true}>
          <Dashboard/>
        </ProtectedRoute>}></Route> */}
        

        <Route  path="/contact" element={<Contact/>} />

        <Route path="/about" element={<About/>} />
        <Route path="*" element={<NotFound/>}/>
      </Routes>
      <Footer/>      
    </BrowserRouter>
  );
}

export default App;
