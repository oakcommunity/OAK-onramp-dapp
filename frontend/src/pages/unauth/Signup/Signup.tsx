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
      .required("Phone is mendatory")
      .min(10, "Phone must be at 10 number")
      .max(10, "Phone must be at 10 number"),
    fname: Yup.string().required("First name is mendatory"),
    lname: Yup.string().required("Last name is mendatory"),
    dob: Yup.string().required("Date of birth is mendatory"),
    address_line_1: Yup.string().required("Street address is mendatory"),
    address_line_2: Yup.string(),
    city: Yup.string().required("City is mendatory"),
    zip: Yup.string()
      .required("Postal code is mendatory")
      .min(5, "Postal must be at 5 number")
      .max(5, "Postal must be at 5 number"),
    state: Yup.string().required("State is mendatory"),
    signed_agreement_id: Yup.string(),
    ssn: Yup.string()
      .required("SSN is mendatory")
      .min(9, "SSN must be at 9 number")
      .max(9, "SSN must be at 9 number"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password length should be at least 6 characters")
      .max(12, "Password cannot exceed more than 12 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    confirm_password: Yup.string()
      .required("Confirm Password is required")
      .min(6, "Password length should be at least 6 characters")
      .max(12, "Password cannot exceed more than 12 characters")
      .oneOf([Yup.ref("password")], "Password & Confirm password are not same")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    term: Yup.boolean().oneOf([true], "Terms is mendatory"),
  });
  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, formState, setValue } = useForm(formOptions);
  const { errors } = formState;
  const onSubmit = handleSubmit((data) => {
    console.log(data);
    API.common_api("auth/register-user", data)
      .then((response: any) => {
        console.log(response.data);
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
          <IonRow>
            <IonCol size="7" className="ion-hide-md-down set-back"></IonCol>
            <IonCol
              size="12"
              sizeMd="5"
              style={{ padding: "20px", height: "100vh", overflow: "auto" }}
            >
              <IonRow>
                <IonCol size="2" style={{ marginTop: "50px" }}>
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
                    marginTop: "40px",
                  }}
                >
                  <h2>OAK Crypto</h2>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="6">
                  <IonLabel>First Name</IonLabel>
                  <IonItem
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <IonInput
                      autocomplete="new-password"
                      placeholder="Your first name"
                      type="text"
                      {...register("fname", { required: true })}
                    ></IonInput>
                  </IonItem>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.fname?.message}
                  </span>
                </IonCol>
                <IonCol size="6">
                  <IonLabel>Last Name</IonLabel>
                  <IonItem
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <IonInput
                      autocomplete="new-password"
                      placeholder="Your last name"
                      type="text"
                      {...register("lname", { required: true })}
                    ></IonInput>
                  </IonItem>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.lname?.message}
                  </span>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonLabel>Street address</IonLabel>
                  <IonItem
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <IonInput
                      autocomplete="new-password"
                      placeholder="Your address"
                      type="text"
                      {...register("address_line_1", { required: true })}
                    ></IonInput>
                  </IonItem>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.address_line_1?.message}
                  </span>
                </IonCol>
                <IonCol size="6">
                  <IonLabel>City</IonLabel>
                  <IonItem
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <IonInput
                      autocomplete="new-password"
                      placeholder="Your city"
                      type="text"
                      {...register("city", { required: true })}
                    ></IonInput>
                  </IonItem>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.city?.message}
                  </span>
                </IonCol>
                <IonCol size="6">
                  <IonLabel>Postal code</IonLabel>
                  <IonItem
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <IonInput
                      autocomplete="new-password"
                      placeholder="Your postal code"
                      type="text"
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      maxlength={5}
                      {...register("zip", { required: true })}
                    ></IonInput>
                  </IonItem>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.zip?.message}
                  </span>
                </IonCol>
                <IonCol size="6">
                  <IonLabel>State</IonLabel>
                  <IonItem
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <IonInput
                      autocomplete="new-password"
                      placeholder="Your state"
                      type="text"
                      {...register("state", { required: true })}
                    ></IonInput>
                  </IonItem>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.state?.message}
                  </span>
                </IonCol>
                <IonCol size="6">
                  <IonLabel>Date of birth</IonLabel>
                  <IonItem
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <IonInput
                      autocomplete="new-password"
                      id="click-trigger"
                      value={dob}
                      readonly
                      placeholder="Your date of birth"
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
                  </IonItem>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.dob?.message}
                  </span>
                </IonCol>
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
                      {...register("email", { required: true })}
                    ></IonInput>
                  </IonItem>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.email?.message}
                  </span>
                </IonCol>
                <IonCol size="12">
                  <IonLabel>Password</IonLabel>
                  <IonItem
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <IonInput
                      autocomplete="new-password"
                      placeholder="Your password"
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
                <IonCol size="12">
                  <IonLabel>Confirm password</IonLabel>
                  <IonItem
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <IonInput
                      autocomplete="new-password"
                      placeholder="Your confirm password"
                      type={cptype}
                      {...register("confirm_password", { required: true })}
                    ></IonInput>
                    {cptype == "text" && (
                      <IonIcon
                        className="suffix-icon"
                        onClick={() => csetptype("password")}
                        style={{ marginTop: "14px" }}
                        color="dark"
                        icon={eyeOff}
                        slot="end"
                      ></IonIcon>
                    )}
                    {cptype == "password" && (
                      <IonIcon
                        className="suffix-icon"
                        style={{ marginTop: "14px" }}
                        onClick={() => csetptype("text")}
                        color="dark"
                        icon={eye}
                        slot="end"
                      ></IonIcon>
                    )}
                  </IonItem>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.confirm_password?.message}
                  </span>
                </IonCol>
                <IonCol size="6">
                  <IonLabel>SSN</IonLabel>
                  <IonItem
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <IonInput
                      autocomplete="new-password"
                      placeholder="Your SSN"
                      type="text"
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      maxlength={9}
                      {...register("ssn", { required: true })}
                    ></IonInput>
                  </IonItem>
                  <span style={{ float: "left", color: "red" }}>
                    {errors.ssn?.message}
                  </span>
                </IonCol>
                <IonCol size="6">
                  <IonLabel>Phone</IonLabel>
                  <IonItem
                    fill="outline"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <IonInput
                      autocomplete="new-password"
                      placeholder="Your Phone"
                      type="text"
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      maxlength={10}
                      {...register("phone", { required: true })}
                    ></IonInput>
                  </IonItem>
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
                <IonCol
                  size="12"
                  sizeSm="6"
                  sizeMd="4"
                  style={{ textAlign: "center" }}
                >
                  <IonButton
                    style={{ textTransform: "none" }}
                    shape="round"
                    onClick={onSubmit}
                  >
                    Signup
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
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
