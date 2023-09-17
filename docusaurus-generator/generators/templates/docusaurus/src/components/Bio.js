import React from "react";

export default function Bio() {
  return (
    <section id="home">
      <h3>Hi there!</h3>
      <h1>
        I'm <span id="name">Terra</span>
      </h1>
      <p>
        Greetings, fellow explorers of the prehistoric past! I am Rex, known
        affectionately as the Roaring Scholar among my peers. While I may not
        possess the intimidating stature or ferocity of some of my dinosaur
        friends, I proudly embrace my unique role as a seeker of knowledge in
        this ancient world. With my sleek, metallic-blue scales and a pair of
        vibrant orange eyes, I stand out as a curious and inquisitive member of
        the late Cretaceous period. My long, slender tail, adorned with a tuft
        of feathers, serves as both a symbol of my wisdom and a practical tool
        for documenting my discoveries.
      </p>
      <a href="#about">
        <button class="btn">About me</button>
      </a>
    </section>
  );
}
