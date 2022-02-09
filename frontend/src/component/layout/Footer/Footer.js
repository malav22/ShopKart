import React, { Component }  from 'react';
import playStore from "../../../images/playstore.png";
// import appStore from "../../../images/appstore.png";
import "./footer.css";

const Footer = () => {
    return (
        <div>
            <footer id="footer">
                <div className="leftFooter">
                    <h4>Download our APP</h4>
                    <p>Download our app for Android and IOS platform.</p> 
                    <img src={playStore} alt="playstore"/>
                    {/* <img src={appStore} alt="appstore"/> */}
                </div>
                <div className="midFooter">
                    <h1>ShopKart.com</h1>
                    <p>High Quality is our first priority.</p>
                    <p>Copyrights 2022 &copy; Malav Thakkar</p>
                </div>
                <div className="rightFooter">
                    <h4>Follow Us</h4>
                    <a target="_blank" href="https://www.linkedin.com/in/malav-thakkar-011517200/">LinkedIn</a>
                    <a target="_blank" href="https://twitter.com/Malavthakkar22">Twitter</a>
                </div>
            </footer>
        </div>
    )
}

export default Footer
