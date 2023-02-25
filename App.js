import AuthContextProvider from "./src/context/UserAuthContext";
import Routes from "./src/Routes";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import theme from "./src/themes/theme";
import OfflineProtected from "./src/component/OfflineProtected";
import CartContextProvider from "./src/context/CartContext";

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <PaperProvider theme={theme}>
        <AuthContextProvider>
          <OfflineProtected>
            <CartContextProvider>
            <Routes />
            </CartContextProvider>
          </OfflineProtected>
        </AuthContextProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
