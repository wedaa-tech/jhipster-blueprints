import {NavBar} from './components/NavBar';
import { Banner } from "./components/Banner";


export default function Home() {

  const projectName = process.env.PROJECT_NAME;
  const wedaaDocsUrl = process.env.WEDAA_DOCS;

  return (
    <>
      <NavBar />
      <Banner projectName = {projectName} wedaaDocsUrl={wedaaDocsUrl}   />
    </>
  );
}
