import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  useIonViewWillEnter,
} from "@ionic/react";
import logo from "./../../../assets/images/logo.png";
import "./Login.css";
import { useHistory } from "react-router";
import { API } from "../../../services/Api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { eye, eyeOff } from "ionicons/icons";
import { useState } from "react";
const Login: React.FC = () => {
  const [ptype, setptype] = useState<any>("password");
  let history = useHistory();
  useIonViewWillEnter(() => {
    console.log("ionViewWillEnter event fired");
  });
  const signup = () => {
    history.push("/getdata");
  };
  const formSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required"),
    username: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
  });
  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  const onSubmit = handleSubmit((data) => {
    API.common_api("auth/login", data)
      .then((response: any) => {
        console.log(response.data);
        if (response.data.status == 1) {
          toast.success(response.data.message);
          localStorage.setItem(
            "oak-crypto",
            JSON.stringify(response.data.data)
          );
          window.location.assign("/");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  });
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow class="ion-justify-content-center">
            <IonCol
              style={{ marginTop: "50px" }}
              size="3"
              className="ion-hide-md-down "
            >
              <p className="logo">
                <img src={logo}></img>
              </p>
              <p className="content">
                Your use of OAK currency at participating merchants will help
                support the community while earning 5% cashback
              </p>
              <IonItem lines="none" className="mt-10">
                <p slot="start" className="circle">
                  1
                </p>
                <IonLabel class="ion-text-wrap" style={{ marginLeft: "48px" }}>
                  <p className="heading">Exchange your USD for OAK</p>
                  <p className="heading2">
                    Fill out your information to purchase OAK currency
                  </p>
                </IonLabel>
              </IonItem>
              <IonItem lines="none" className="mt-10">
                <p slot="start" className="circle">
                  2
                </p>
                <IonLabel class="ion-text-wrap" style={{ marginLeft: "48px" }}>
                  <p className="heading">Download a crypto wallet</p>
                  <p className="heading2">
                    Take your currency with you in a mobile crypto wallet
                  </p>
                </IonLabel>
              </IonItem>
              <IonItem lines="none" className="mt-10">
                <p slot="start" className="circle">
                  3
                </p>
                <IonLabel class="ion-text-wrap" style={{ marginLeft: "48px" }}>
                  <p className="heading">Spend your OAK</p>
                  <p className="heading2">
                    Use your OAK currency at participating merchants
                  </p>
                </IonLabel>
              </IonItem>
            </IonCol>
            <IonCol size="12" sizeMd="3" style={{ padding: "30px" }}>
              <IonRow>
                <IonCol
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "50px",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "Satoshi Variable",
                      fontSize: "24px",
                      fontStyle: "normal",
                      fontWeight: "300",
                      lineHeight: "normal",
                    }}
                  >
                    Get OAK currency
                  </h2>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonLabel className="mt-15">Email address</IonLabel>
                  <IonInput
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    autocomplete="email"
                    type="email"
                    {...register("username", { required: true })}
                  ></IonInput>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.username?.message}
                  </span>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonLabel className="mt-15">Password</IonLabel>
                  <IonInput
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    autocomplete="current-password"
                    type={ptype}
                    {...register("password", { required: true })}
                  ></IonInput>
                  {ptype == "text" && (
                    <IonIcon
                      className="suffix-icon"
                      onClick={() => setptype("password")}
                      style={{
                        marginTop: "45px",
                        zIndex: "9999",
                        position: "absolute",
                        right: "18px",
                        top: "5px",
                      }}
                      color="dark"
                      icon={eyeOff}
                    ></IonIcon>
                  )}
                  {ptype == "password" && (
                    <IonIcon
                      className="suffix-icon"
                      style={{
                        marginTop: "45px",
                        zIndex: "9999",
                        position: "absolute",
                        right: "18px",
                        top: "5px",
                      }}
                      onClick={() => setptype("text")}
                      color="dark"
                      icon={eye}
                    ></IonIcon>
                  )}
                  <span style={{ float: "left", color: "red" }}>
                    {errors.password?.message}
                  </span>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12" style={{ textAlign: "center" }}>
                  <button className="btn-large2" onClick={onSubmit}>
                    Login
                  </button>
                </IonCol>
              </IonRow>
              <IonRow className="mt-10">
                <IonCol size="12" style={{ textAlign: "center" }}>
                  <p>
                    Don't have an account?{" "}
                    <span
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={signup}
                    >
                      Create account
                    </span>
                  </p>
                </IonCol>
              </IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
