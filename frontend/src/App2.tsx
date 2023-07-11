import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Login from "./pages/unauth/Login/Login";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "react-toastify/dist/ReactToastify.css";
/* Theme variables */
import "./theme/variables.css";
import Signup from "./pages/unauth/Signup/Signup";
import GetData from "./pages/unauth/Signup/GetData";
import { ToastContainer } from "react-toastify";

setupIonicReact();

const App2: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/getdata">
          <GetData />
        </Route>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        {/* <Route path="*" >
            <Login />
        </Route> */}
      </IonRouterOutlet>
      <ToastContainer position="top-right" />
    </IonReactRouter>
  </IonApp>
);

export default App2;
