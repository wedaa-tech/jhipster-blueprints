import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
<%_ if (theme==="profile"){  _%>
import About from "../components/About";
import Contact from "../components/Contact";
import Navbar from "../components/Navbar";
import Bio from "../components/Bio";
<%_ } _%>


import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Quick Overview - 2min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`<%= applicationName %>`}
      description="Description will go into a meta tag in <head />">
      <%_ if (theme==="default"){  _%>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
      <%_ } _%>
      <%_ if (theme==="profile"){  _%>
        <div className="app-container">
        {/* <HomepageHeader /> */}
        <div className="left-side">
          <Navbar />
        </div>
        <div className="right-side">
          <Bio />
          <About />
          <Contact />
        </div>
      </div>
      <%_ } _%>

    </Layout>
  );
}
