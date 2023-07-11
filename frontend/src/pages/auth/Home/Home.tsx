import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  configureChains,
  createConfig,
  useAccount,
  useNetwork,
  WagmiConfig,
} from "wagmi";
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains";
// import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { Rainbow } from "../../../components/Rainbow";
import "@rainbow-me/rainbowkit/styles.css";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [
    // alchemyProvider({ apiKey: "8c9b6953bc5f702361e982a36ca92901" }),
    publicProvider(),
  ]
);
const { connectors } = getDefaultWallets({
  appName: "Crypto Aspirant",
  projectId: "8c9b6953bc5f702361e982a36ca92901",
  chains,
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
} from "@ionic/react";
import "./Home.css";
import { logOutOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import { useEffect } from "react";
import { API } from "../../../services/Api";
import { toast } from "react-toastify";

const Home: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  let history = useHistory();
  useIonViewDidEnter(() => {
    API.getUData("user/details")
      .then((response: any) => {
        console.log(response.data);
        if (response.data.status == 1) {
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  });
  useEffect(() => {
    if (isConnected) {
      console.log(address);
      console.log(chain);
      API.postData("user/update-wallet-address", {
        wallet_address: address,
        wallet_name: chain?.blockExplorers?.default.name,
        website: chain?.blockExplorers?.default.url,
      })
        .then((response: any) => {
          console.log(response.data);
          if (response.data.status == 1) {
            toast.success(response.data.message);
          }
          // else {
          //   toast.error(response.data.message);
          // }
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  }, [isConnected]);
  const logout = () => {
    localStorage.removeItem("oak-crypto");
    window.location.assign("/");
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>OAK Crypto</IonTitle>
          <IonButtons slot="end">
            <IonButton style={{ marginRight: "15px" }} onClick={logout}>
              <IonIcon icon={logOutOutline} size="large" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">OAK Crypto</IonTitle>
            <IonButtons slot="end">
              <IonButton style={{ "margin-right": "15px" }}>
                <IonIcon icon={logOutOutline} size="large" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader> */}
        <div className="center-aline">
          <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>
              <Rainbow />
            </RainbowKitProvider>
          </WagmiConfig>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
