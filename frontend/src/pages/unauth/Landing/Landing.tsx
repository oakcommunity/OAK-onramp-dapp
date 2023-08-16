import React from "react";
import { useHistory } from "react-router";
import "./../../../theme/main.css";
import right from "./../../../assets/images/right-arrows.png";
import one from "./../../../assets/images/1.png";
import two from "./../../../assets/images/2.png";
import three from "./../../../assets/images/3.png";
import { IonContent, IonPage } from "@ionic/react";
const Home = () => {
  let history = useHistory();
  const login = () => {
    history.push("/login");
  };
  return (
    <IonPage>
      <IonContent fullscreen>
        <div>
          <nav className="navbar navbar-expand-lg bg-cream px-5">
            <div className="container-fluid">
              <a className="navbar-brand" href="#">
                <b className="font-large">OAK</b>
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <a className="nav-link" aria-current="page" href="#">
                      About us
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      For merchants
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" aria-disabled="true">
                      <button
                        type="button"
                        onClick={login}
                        className="btn btn-green"
                      >
                        Get Started
                      </button>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          {/*Header End*/}
          {/*banner*/}
          <section className="bg-cream">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-7  p-5">
                  <div className="mx-2">
                    <h1 className="mt-4">
                      A community <br />
                      currency for the city <br />
                      of Oakland
                    </h1>
                    <p className="font-medium mt-4">
                      Help small businesses, local community, and keep <br />
                      money in your pocket with 5% cashback
                    </p>
                    <button
                      type="button"
                      onClick={login}
                      className="btn btn-green d-block mt-4"
                    >
                      Get Started &nbsp; <img src={right} width="20px" />
                    </button>
                  </div>
                </div>
                <div className="col-md-5 p-0">
                  <img src={one} width="100%" />
                </div>
              </div>
            </div>
          </section>
          {/*content*/}
          <section>
            <div className="container pb-5">
              <div className="row mt-4">
                <div className="col-12 text-center py-4">
                  <h2>So what’s this all about?</h2>
                </div>
                <div className="col-md-5 mx-auto  mt-4">
                  <img src={two} className="d-flex mx-auto" width="100%" />
                </div>
                <div className="col-md-5 mx-auto  mt-4">
                  <h3>What’s a community currency?</h3>
                  <p className="para">
                    It’s a type of currency issues by a community to serve its
                    specific needs, rather than being backed by a government or
                    financial institution, promoting local economic development
                    and encouraging collaboration within the community.
                  </p>
                  <button type="button" className="btn btn-outline-success">
                    Learn more
                  </button>
                </div>
              </div>
              <div className="row  pt-5">
                <div className="col-md-5 mx-auto  mt-4">
                  <h3>What’s a community currency?</h3>
                  <p className="para">
                    It’s a type of currency issues by a community to serve its
                    specific needs, rather than being backed by a government or
                    financial institution, promoting local economic development
                    and encouraging collaboration within the community.
                  </p>
                  <button type="button" className="btn btn-green">
                    Learn more
                  </button>
                </div>
                <div className="col-md-5 mx-auto  mt-4">
                  <img src={two} className="d-flex mx-auto" width="100%" />
                </div>
              </div>
              <div className="row  pt-5">
                <div className="col-md-5 mx-auto  mt-4">
                  <img src={two} className="d-flex mx-auto" width="100%" />
                </div>
                <div className="col-md-5 mx-auto  mt-4">
                  <h3>What’s a community currency?</h3>
                  <p className="para">
                    It’s a type of currency issues by a community to serve its
                    specific needs, rather than being backed by a government or
                    financial institution, promoting local economic development
                    and encouraging collaboration within the community.
                  </p>
                  <button type="button" className="btn btn-green">
                    Learn more
                  </button>
                </div>
              </div>
              <div className="row  pt-5">
                <div className="col-md-5 mx-auto  mt-4">
                  <h2>Get 5% cashback on OAK purchases</h2>
                  <p className="para">
                    When spending your OAK, get cashback, keep your money local,
                    and grow the community’s capital.
                  </p>
                  <button
                    type="button"
                    onClick={login}
                    className="btn btn-green d-block mt-4"
                  >
                    Get Started &nbsp; <img src={right} width="20px" />
                  </button>
                </div>
                <div className="col-md-5 mx-auto  mt-4">
                  <img src={three} className="d-block mx-auto" width="70%" />
                </div>
              </div>
            </div>
          </section>
          {/*Footer*/}
          <section className="bg-green pt-5 mt-5">
            <div className="container pt-5">
              <div className="row">
                <div className="col-md-5 mx-auto">
                  <h2 className="color-y ">
                    Embrace the power of community currency and start spending
                  </h2>
                </div>
                <div className="col-md-5 ms-auto ">
                  <button
                    type="button"
                    onClick={login}
                    className="btn  d-block mt-2 btn-l"
                  >
                    <span className="float-left">Get Started</span>{" "}
                    <img src={right} className="float-right" width="20px" />
                  </button>
                  <button
                    type="button"
                    className="btn  d-block mt-2 btn-l-outline"
                  >
                    Learn more
                  </button>
                </div>
              </div>
              <div className="row pt-5 pb-3 mt-4">
                <div className="col-12 text-center">
                  <p className="color-y">© 2023 OAK Community Currency</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
