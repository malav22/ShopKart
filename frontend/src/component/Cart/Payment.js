import React, { Fragment, useEffect, useRef } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/Header/MetaData";
import { Typography } from "@material-ui/core";
import { useAlert } from "react-alert";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import axios from "axios";
import "./payment.css";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { createOrder, clearErrors } from "../../actions/orderAction";
import {useNavigate} from 'react-router-dom';

const Payment = ({ history }) => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);
 
  const {isAuthenticated} = useSelector((state) => state.user);
  const paymentData = {
      amount: Math.round(orderInfo.totalPrice * 100),
    };
    
    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice,
      };
      
      const submitHandler = async (e) => {
        e.preventDefault();
        alert.show("Please wait while we are processing your payment.");
        payBtn.current.disabled = true;
        if(!isAuthenticated){
          navigate("/login");
        }
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };
          const { data } = await axios.post(
            "/api/v1/payment/process",
            paymentData,
            config
            );
            
                const client_secret = data.client_secret;
            
                if (!stripe || !elements) return;
            
                const result = await stripe.confirmCardPayment(client_secret, {
                    payment_method: {
                        card: elements.getElement(CardNumberElement),
                        billing_details: {
                            name: user.name,
                            email: user.email,
                            address: {
                                line1: shippingInfo.address,
                                city: shippingInfo.city,
                                state: shippingInfo.state,
                                postal_code: shippingInfo.pinCode,
                                country: shippingInfo.country,
                              },
                            },
                          },
                        });
                    
                        if (result.error) {
                            payBtn.current.disabled = false;
                      
                            alert.error(result.error.message);
                          } else {
                              if (result.paymentIntent.status === "succeeded") {
                                  order.paymentInfo = {
                                      id: result.paymentIntent.id,
                                      status: result.paymentIntent.status,
                                    };
                                    order.paidAt = Date.now();
                                    dispatch(createOrder(order));
                                    navigate("/success");
                                    // localStorage.clear();
                                  } else {
                                      alert.error("There's some issue while processing payment ");
                                    }
                                  }
                            } catch (error) {
      payBtn.current.disabled = false;
      alert.error(error.response.data.message);
    }
  };
  
  
  useEffect(() => {
    alert.show("Please do not reload this page.");
    
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert,isAuthenticated]);

  return (
    <Fragment>
      <MetaData title="Payment" />
      <CheckoutSteps activeStep={2} />
      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
          <Typography>Card Info</Typography>
          <div>
            <CreditCardIcon />
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div>

          <input
            type="submit"
            value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>
    </Fragment>
  );
};

export default Payment;