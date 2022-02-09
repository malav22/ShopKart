import React, { Component }  from 'react';
import {ReactNavbar} from "overlay-navbar"
import logo from "../../../images/logo3.png";
const options = {
    burgerColor : '#ccc',
    burgerColorHover: "#eb4034",
    logo,
    logoWidth: "12vmax",
    navColor1: "white",
    logoHoverSize: "20px",
    logoHoverColor: "#eb4",
    logoBorderRadius: "50%",
    link1Text: "Home",
    link2Text: "Products",
    link3Text: "Contact",
    link4Text: "About",
    link1Url: "/",
    link2Url: "/products",
    link3Url: "/contact",
    link4Url: "/about",
    link1Size: "3vmax",
    link1Color: "rgba(35, 35, 35,0.8)",
    nav1justifyContent: "flex-end",
    nav2justifyContent: "flex-end",
    nav3justifyContent: "flex-start",
    nav4justifyContent: "flex-start",
    link1ColorHover: "#eb4034",
    link1Margin: "1vmax",
    profileIconUrl: "/login",
    profileIconColor: "rgba(35, 35, 35,0.8)",
    profileIconSize: "4vmax",
    searchIconColor: "rgba(35, 35, 35,0.8)",
    searchIconSize: "3vmax",
    cartIconColor: "rgba(35, 35, 35,0.8)",
    cartIconSize: "3vmax",
    profileIconColorHover: "#eb4034",
    searchIconColorHover: "#eb4034",
    cartIconColorHover: "#eb4034",
    cartIconMargin: "1vmax",
  };

const Header = () =>{
    return(<>
    <ReactNavbar  {...options}/>
      {/* {console.log("header working")} */}
    </>)
}

export default Header;