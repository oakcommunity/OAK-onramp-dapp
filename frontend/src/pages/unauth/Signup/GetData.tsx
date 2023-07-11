import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import { API } from "../../../services/Api";

const GetData: React.FC = () => {
  useIonViewWillEnter(() => {
    console.log("ionViewWillEnter event fired");
    API.getUrl("auth/create-terms-link")
      .then((response: any) => {
        window.open(
          response.data.data.url +
            "&redirect_uri=" +
            window.location.origin +
            "/signup",
          "_self"
        );
      })
      .catch((error: any) => {
        console.log(error);
      });
  });
  return (
    <IonPage>
      <IonContent fullscreen></IonContent>
    </IonPage>
  );
};

export default GetData;
