import React from "react";
import { faEnvelope, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Contact() {
  return (
    <section class="contact" id="contact">
      <h1 class="heading">
        <span>Contact</span> me
      </h1>
      <div class="row">
        <div class="content">
          <h3 class="title">CONTACT INFO</h3>
          <div class="info">
            <a href="" className="email-link">
              <FontAwesomeIcon icon={faEnvelope} className="email-icon" />
              <h3 className="email-text">terra@gmail.com</h3>
            </a>
            <div className="location">
              <FontAwesomeIcon icon={faLocationDot} className="location-icon" />
              <h3 className="location-text">Hyderabad, India</h3>
            </div>
          </div>
        </div>
        <form action="#" method="POST">
          <input type="text" name="Name" placeholder="name" class="box"></input>
          <input
            type="email"
            name="email"
            placeholder="email"
            class="box"
          ></input>
          <input
            type="text"
            name="subject"
            placeholder="subject"
            class="box"
          ></input>
          <textarea
            name="message"
            id=""
            cols="30"
            rows="10"
            class="box message"
            placeholder="message"
          ></textarea>
          <button type="submit" name="subject" class="btn">
            send
          </button>
        </form>
      </div>
    </section>
  );
}
