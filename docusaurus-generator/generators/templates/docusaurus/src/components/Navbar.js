import { ArrowRightIcon } from "@heroicons/react/solid";
import React from "react";

export default function Navbar() {
  return (
    <header>
      <div class="user">
        <img
          src="https://i.pinimg.com/originals/38/e7/81/38e78188ec20892c34cd42cd0a36a0cf.png"
          alt="rex profile pic"
        ></img>
        <h1 class="name">Terra</h1>
        <p class="post">Dino</p>
      </div>
      <nav class="nav">
        <ul>
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="/blog">Blogs</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
