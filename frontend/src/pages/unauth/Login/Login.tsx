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
      .required("Password is mendatory")
      .min(6, "Password must be at 6 character long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
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
  const login = () => {
    localStorage.setItem("oak-crypto", "sdaadasdasd");
    window.location.assign("/");
  };
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol size="7" className="ion-hide-md-down set-back"></IonCol>
            <IonCol size="12" sizeMd="5" style={{ padding: "20px" }}>
              <IonRow>
                <IonCol size="2" style={{ marginTop: "100px" }}>
                  <img
                    style={{ height: "80px", borderRadius: "20px" }}
                    src="https://ionicframework.com/docs/img/demos/thumbnail.svg"
                    alt="logo"
                  />
                </IonCol>
                <IonCol
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "80px",
                  }}
                >
                  <h2>OAK Crypto</h2>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonLabel>Email address</IonLabel>
                  <IonItem
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <IonInput
                      autocomplete="new-password"
                      placeholder="Your email"
                      type="email"
                      {...register("username", { required: true })}
                    ></IonInput>
                  </IonItem>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.username?.message}
                  </span>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonLabel>Password</IonLabel>
                  <IonItem
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <IonInput
                      autocomplete="new-password"
                      placeholder="Your Password"
                      type={ptype}
                      {...register("password", { required: true })}
                    ></IonInput>
                    {ptype == "text" && (
                      <IonIcon
                        className="suffix-icon"
                        onClick={() => setptype("password")}
                        style={{ marginTop: "14px" }}
                        color="dark"
                        icon={eyeOff}
                        slot="end"
                      ></IonIcon>
                    )}
                    {ptype == "password" && (
                      <IonIcon
                        className="suffix-icon"
                        style={{ marginTop: "14px" }}
                        onClick={() => setptype("text")}
                        color="dark"
                        icon={eye}
                        slot="end"
                      ></IonIcon>
                    )}
                  </IonItem>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.password?.message}
                  </span>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12" style={{ textAlign: "center" }}>
                  <IonButton
                    style={{ textTransform: "none" }}
                    shape="round"
                    onClick={onSubmit}
                  >
                    Login
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
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
