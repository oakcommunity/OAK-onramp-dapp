import {
  IonButton,
  IonCheckbox,
  IonCol,
  IonContent,
  IonDatetime,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonPopover,
  IonRow,
  useIonViewWillEnter,
} from "@ionic/react";
import "./Signup.css";
import { useHistory, useLocation } from "react-router";
import { API } from "../../../services/Api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState } from "react";
import React from "react";
import { toast } from "react-toastify";
import { eye, eyeOff } from "ionicons/icons";
import logo from "./../../../assets/images/logo.png";
const Signup: React.FC = () => {
  const [ptype, setptype] = useState<any>("password");
  const [cptype, csetptype] = useState<any>("password");
  const [term, setterm] = useState(false);
  const [dob, setdob] = useState("");
  const [urlparam, seturlparam] = useState<any>();
  let history = useHistory();
  let query = useQuery();
  useIonViewWillEnter(() => {
    seturlparam(query.get("signed_agreement_id"));
  });
  const login = () => {
    history.push("/login");
  };
  const setTerm = (e: any) => {
    setterm(e.detail.checked);
  };
  const setDOB = (e: any) => {
    setValue("dob", formatDate(e.detail.value));
    setValue("signed_agreement_id", urlparam);
    var newDate = formatDate(e.detail.value);
    setdob(newDate);
  };
  const formatDate = (date: any) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };
  const formSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
    phone: Yup.string()
      .required("Phone is required")
      .min(10, "Phone must contain 10 digits")
      .max(10, "Phone must contain 10 digits"),
    fname: Yup.string().required("First name is required"),
    lname: Yup.string().required("Last name is required"),
    dob: Yup.string().required("Date of birth is required"),
    address_line_1: Yup.string().required("Street address is required"),
    address_line_2: Yup.string(),
    city: Yup.string().required("City is required"),
    zip: Yup.string()
      .required("Postal code is required")
      .min(5, "Postal code must contain 5 digits")
      .max(5, "Postal code must contain 5 digits"),
    state: Yup.string().required("State is required"),
    signed_agreement_id: Yup.string(),
    ssn: Yup.string()
      .required("SSN is required")
      .min(9, "SSN must contain 9 digits")
      .max(9, "SSN must contain 9 digits"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password should be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must contain at least 8 characters. One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    confirm_password: Yup.string()
      .required("Password Confirmation is required")
      .min(6, "Password should be at least 8 characters")
      .oneOf([Yup.ref("password")], "Password & Confirm password are not same")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must contain at least 8 characters. One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    term: Yup.boolean().oneOf([true], "Terms and Conditions are required"),
  });
  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, formState, setValue } = useForm(formOptions);
  const { errors } = formState;
  const onSubmit = handleSubmit((data) => {
    API.common_api("auth/register-user", data)
      .then((response: any) => {
        if (response.data.status == 1) {
          toast.success(response.data.message);
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
                  <p className="heading">
                    <b>Exchange your USD for OAK</b>
                  </p>
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
            <IonCol
              size="12"
              sizeMd="3"
              style={{ padding: "20px", height: "100vh" }}
            >
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
                      fontWeight: "700",
                      lineHeight: "normal",
                    }}
                  >
                    Get OAK currency
                  </h2>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonLabel>First Name</IonLabel>
                  <IonInput
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    autocomplete="given-name"
                    type="text"
                    {...register("fname", { required: true })}
                  ></IonInput>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.fname?.message}
                  </span>
                </IonCol>
                <IonCol size="12">
                  <IonLabel>Last Name</IonLabel>
                  <IonInput
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    autocomplete="family-name"
                    type="text"
                    {...register("lname", { required: true })}
                  ></IonInput>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.lname?.message}
                  </span>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonLabel>Street address</IonLabel>
                  <IonInput
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    autocomplete="street-address"
                    type="text"
                    {...register("address_line_1", { required: true })}
                  ></IonInput>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.address_line_1?.message}
                  </span>
                </IonCol>
                <IonCol size="6" className="pr-5">
                  <IonLabel>City</IonLabel>
                  <IonInput
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    autocomplete="address-level2"
                    type="text"
                    {...register("city", { required: true })}
                  ></IonInput>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.city?.message}
                  </span>
                </IonCol>
                <IonCol size="6" className="pr-5">
                  <IonLabel>State</IonLabel>
                  <IonInput
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    autocomplete="address-level1"
                    type="text"
                    {...register("state", { required: true })}
                  ></IonInput>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.state?.message}
                  </span>
                </IonCol>
                <IonCol size="6" className="pl-5">
                  <IonLabel>Postal code</IonLabel>
                  <IonInput
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    autocomplete="postal-code"
                    type="text"
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    maxlength={5}
                    {...register("zip", { required: true })}
                  ></IonInput>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.zip?.message}
                  </span>
                </IonCol>
                <IonCol size="6" className="pl-5">
                  <IonLabel>Date of birth</IonLabel>
                  <IonInput
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    autocomplete="bday"
                    id="click-trigger"
                    value={dob}
                    readonly
                    type="text"
                    {...register("dob", { required: true })}
                  ></IonInput>
                  <IonPopover
                    side="top"
                    trigger="click-trigger"
                    triggerAction="click"
                    show-backdrop="false"
                  >
                    <IonContent>
                      <IonDatetime
                        showDefaultButtons={true}
                        presentation="date"
                        onIonChange={(e) => setDOB(e)}
                      ></IonDatetime>
                    </IonContent>
                  </IonPopover>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.dob?.message}
                  </span>
                </IonCol>
                <IonCol size="12">
                  <IonLabel>Email address</IonLabel>
                  <IonInput
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    autocomplete="email"
                    type="email"
                    {...register("email", { required: true })}
                  ></IonInput>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.email?.message}
                  </span>
                </IonCol>
                <IonCol size="12">
                  <IonLabel>Password</IonLabel>
                  <IonInput
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    autocomplete="new-password"
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
                <IonCol size="12">
                  <IonLabel>Confirm password</IonLabel>
                  <IonInput
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    autocomplete="new-password"
                    type={cptype}
                    {...register("confirm_password", { required: true })}
                  ></IonInput>
                  {cptype == "text" && (
                    <IonIcon
                      className="suffix-icon"
                      onClick={() => csetptype("password")}
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
                  {cptype == "password" && (
                    <IonIcon
                      className="suffix-icon"
                      style={{
                        marginTop: "45px",
                        position: "absolute",
                        right: "18px",
                        zIndex: "9999",
                        top: "5px",
                      }}
                      onClick={() => csetptype("text")}
                      color="dark"
                      icon={eye}
                    ></IonIcon>
                  )}
                  <span style={{ float: "left", color: "red" }}>
                    {errors.confirm_password?.message}
                  </span>
                </IonCol>
                <IonCol size="6" className="pr-5">
                  <IonLabel>SSN</IonLabel>
                  <IonInput
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    type="password"
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    maxlength={9}
                    {...register("ssn", { required: true })}
                  ></IonInput>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.ssn?.message}
                  </span>
                </IonCol>
                <IonCol size="6" class="pl-5">
                  <IonLabel>Phone</IonLabel>
                  <IonInput
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    autocomplete="tel"
                    type="text"
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    maxlength={10}
                    {...register("phone", { required: true })}
                  ></IonInput>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.phone?.message}
                  </span>
                </IonCol>
                <IonCol size="6">
                  <IonCheckbox
                    {...register("term", { required: true })}
                    onIonChange={(e) => setTerm(e)}
                    value={term}
                    labelPlacement="end"
                    mode="ios"
                  >
                    Terms and Condition agreement
                  </IonCheckbox>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.term?.message}
                  </span>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12" style={{ textAlign: "center" }}>
                  <button className="btn-large2" onClick={onSubmit}>
                    Continue
                  </button>
                </IonCol>
              </IonRow>
              <IonRow className="mt-10">
                <IonCol size="12" style={{ textAlign: "center" }}>
                  <p>
                    Already have an account?
                    <span
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={login}
                    >
                      {" "}
                      Login
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

export default Signup;
function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
