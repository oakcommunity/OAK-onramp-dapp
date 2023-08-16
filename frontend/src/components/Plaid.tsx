import { IonButton, useIonViewDidEnter } from "@ionic/react";
import React, { useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";

interface ContainerProps {
  linktoken: any;
}

const Plaid: React.FC<ContainerProps> = (props) => {
  useEffect(() => {
    console.log(props.linktoken);
  }, []);

  useIonViewDidEnter(() => {
    console.log(props.linktoken);
  });
  const { open, ready } = usePlaidLink({
    token: props.linktoken,
    onSuccess: (public_token, metadata) => {
      console.log(public_token);
      console.log(metadata);
      // send public_token to server
      //   const params={
      //     "user_uid": this.user_uid,
      //     "public_token": public_token,
      //     "account_id":metadata.account_id,
      //     "account_name":metadata.account.name
      //   }
    },
  });
  return (
    <>
      <IonButton onClick={() => open()} disabled={!ready}>
        Link Bank Account
      </IonButton>
    </>
  );
};

export default Plaid;
