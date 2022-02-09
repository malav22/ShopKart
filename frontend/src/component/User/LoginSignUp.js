import React, { Fragment, useRef, useState, useEffect } from "react";
import './LoginSignUp.css';
import Loader from '../layout/Loader/Loader';
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from 'react-alert';
import MetaData from '../layout/Header/MetaData';
import { Link } from "react-router-dom";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import { clearErrors, login ,register} from "../../actions/userAction";
import { useNavigate,useLocation } from 'react-router-dom';

const LoginSignUp = () => {

  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, loading, isAuthenticated,userName } = useSelector(
    (state) => state.user
  );
  
  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState("/Profile.png");
  const [avatarPreview, setAvatarPreview] = useState("../../images/profile.jpeg");
  const loginSubmit = (e) => {
    e.preventDefault();
    console.log("Login Form submitted");
    dispatch(login(loginEmail, loginPassword));
  };
  const registerSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("avatar", avatar);
    console.log("SignUp Form submitted");
    dispatch(register(myForm));
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  }
  // const  redirect = location.pathname ? location.pathname.split('=')[1] : "/account";
  // console.log(location.pathname.split('/')[1]);
  const redirect = location.search ? `/${location.search.split("=")[1]}` : "/account";
  let val = "Login - SignUp";

    useEffect(() => {
      // console.log(location.search.split("=")[1]);
      if (error) {
        alert.error(error);
        dispatch(clearErrors());
      }
      if (isAuthenticated) {
        if(redirect==='/account')alert.success(`Welcome :\n${userName}`);
        navigate(redirect);
        // const val = useSelector(
        //   (state) => state.user
        // );
        // { name, email, password } = user;
        // console.log(val);
      }
  
    }, [dispatch,error, alert, isAuthenticated, redirect,navigate,userName,val]);
  
  const switchTabs = (e, tab) => {
    if (tab === "login") {
      val = "Login";
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      val = "SignUp";
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  return (<Fragment>
    {loading?
    <Loader/>
    :(<Fragment>
          <MetaData title={val} />
          <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
              <div>
              <div className="login_signUp_toggle">
                <p onClick={(e)=>switchTabs(e,"login")}>Login</p>
                <p onClick={(e)=>switchTabs(e,"register")}>SignUp</p>
              </div>
              <button ref={switcherTab}></button>
              </div>
              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
              
                <div className="LoginEmail">
                  <MailOutlineIcon/>
                  <input
                    type="email"
                    placeholder="Email"
                    required={true}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                  </div>
                  
                  <div className="LoginPassword">
                    
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Enter Password"
                    required="true"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Link to="/password/forgot">Forget Password ?</Link>
                <input type="submit" value="Login" className="loginBtn" />
              </form>
              <form
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}
              >
                
                <div className="signUpName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                </div>

                <div id="registerImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    required={true}
                    onChange={registerDataChange}
                  />
                </div>
                <input type="submit" value="Register" className="signUpBtn" />
              </form>
            </div>
          </div>
          </Fragment>)}
  </Fragment>);
};


export default LoginSignUp;
