import { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [connected, setConnected] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      let user = {};
      user.userId = await AsyncStorage.getItem("userId");
      user.userName = await AsyncStorage.getItem("userName");
      user.role = await AsyncStorage.getItem("role");
      user.mobileNo = await AsyncStorage.getItem("mobileNo");
      user.city = await AsyncStorage.getItem("city");
      setUser(user);
    };
    getUser().then(() => setInitialLoadComplete(true));
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const isLoggedIn = () => {
    return user?.userId ? true : false;
  };

  const loginUser = (data) => {
    setUser({
      userId: data.userid,
      role: data.rolename,
      userName: data.name,
      mobileNo: data.mobileno,
      city: data.city,
    });
    AsyncStorage.setItem("userId", data.userid);
    AsyncStorage.setItem("role", data.rolename);
    AsyncStorage.setItem("userName", data.name);
    AsyncStorage.setItem("mobileNo", data.mobileno);
    AsyncStorage.setItem("city", data.city);
    return true;
  };

  const logoutUser = () => {
    setUser();
    AsyncStorage.multiRemove(["userId", "role", "userName", "mobileNo", "city"])
      .then(() => true)
      .catch(() => false);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loginUser,
        logoutUser,
        connected,
      }}
    >
      {initialLoadComplete === true && children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
export const useAuthContext = () => useContext(AuthContext);
