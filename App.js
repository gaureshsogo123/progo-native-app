
import AuthContextProvider from './src/context/UserAuthContext';
import Routes from './src/Routes';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";




export default function App() {
  
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
    <PaperProvider theme={DefaultTheme}>
      <AuthContextProvider>
        <Routes />
      </AuthContextProvider>
    </PaperProvider>
  </SafeAreaProvider>
      
  );
}


