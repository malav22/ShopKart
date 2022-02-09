import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import InstagramIcon from "@material-ui/icons/Instagram";
import GitHubIcon from "@material-ui/icons/GitHub";

const About = () => {
  const visitInstagram = () => {
    window.location = "https://instagram.com/malavthakkar22";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Me</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://media-exp1.licdn.com/dms/image/C4E03AQFrQp-alrukFA/profile-displayphoto-shrink_800_800/0/1620045214901?e=1649894400&v=beta&t=eyWUkGVgW7QvTHFalqdu6-IU_2gDXireKwq8h2S49UQ"
              alt="Founder"
            />
            <Typography>Malav Thakkar</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              This is an eCommerce website based on MERN Stack.
            </span>
            <span>  
              I am a 2nd year undegraduate student, pursuing Bachelor of Technology in Computer Science and Engineering at IIT(ISM) Dhanbad.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Connect with me</Typography>
            <a
              href="https://www.linkedin.com/in/malav-thakkar-011517200/"
              target="blank"
            >
              <LinkedInIcon className="SvgIcon"/>
            </a>

            <a href="https://instagram.com/malavthakkar22" target="blank">
              <InstagramIcon className="SvgIcon" />
            </a>
            <a href="https://github.com/malav22" target="blank">
              <GitHubIcon className="SvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;