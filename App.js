import AuthContextProvider from "./src/context/UserAuthContext";
import Routes from "./src/Routes";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import theme from "./src/themes/theme";
import OfflineProtected from "./src/component/OfflineProtected";
import * as Notifications from "expo-notifications";
import CartContextProvider from "./src/context/CartContext";
import { useState, useEffect, useRef } from "react";
import SearchContextProvider from "./src/context/SearchContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [notification, setNotification] = useState();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <PaperProvider theme={theme}>
        <AuthContextProvider>
          <OfflineProtected>
            <CartContextProvider>
              <SearchContextProvider>
                <Routes />
              </SearchContextProvider>
            </CartContextProvider>
          </OfflineProtected>
        </AuthContextProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
