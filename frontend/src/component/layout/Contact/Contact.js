import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";
import hello from "../../../images/1.gif";
const Contact = () => {
  return (
    <div className="contactContainer">
    <img src={hello}/>
      <a className="mailBtn" href="mailto:malavakhani58@gmail.com">
        <Button>E-Mail: malavakhani58@gmail.com</Button>
      </a>
    </div>
  );
};

export default Contact;