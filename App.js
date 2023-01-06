import AuthContextProvider from "./src/context/UserAuthContext";
import Routes from "./src/Routes";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import OfflineProtected from "./src/component/OfflineProtected";

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <PaperProvider theme={DefaultTheme}>
        <AuthContextProvider>
          <OfflineProtected>
            <Routes />
          </OfflineProtected>
        </AuthContextProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
