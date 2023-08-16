import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/auth/Home/Home";
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
import "./theme/main.css";
import Signup from "./pages/unauth/Signup/Signup";
import GetData from "./pages/unauth/Signup/GetData";
import { ToastContainer } from "react-toastify";
import Landing from "./pages/unauth/Landing/Landing";
import Login from "./pages/unauth/Login/Login";
import PublicRoute from "./pages/PublicRoute";
import PrivateRoute from "./pages/PrivateRoute";
import { Redirect, Route } from "react-router";

setupIonicReact({
  animated: false,
});

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <PublicRoute restricted={true} component={Landing} path="/" exact />
        <PublicRoute
          restricted={true}
          component={Landing}
          path="/welcome"
          exact
        />
        <PublicRoute restricted={true} component={Login} path="/login" exact />
        <PublicRoute
          restricted={true}
          component={Signup}
          path="/signup"
          exact
        />
        <PublicRoute
          restricted={true}
          component={GetData}
          path="/getdata"
          exact
        />
        <PrivateRoute component={Home} path="/home" exact />
        <Route exact path="/">
          <Redirect to="/welcome" />
        </Route>
        <Route>
          <Landing />
        </Route>
      </IonRouterOutlet>
      <ToastContainer position="top-right" />
    </IonReactRouter>
  </IonApp>
);

export default App;
