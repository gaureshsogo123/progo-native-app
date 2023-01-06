import React from "react";
import { useAuthContext } from "../context/UserAuthContext";
import Offline from "./Offline";

function OfflineProtected({ children }) {
  const { connected } = useAuthContext();
  return <>{connected ? children : <Offline />}</>;
}

export default OfflineProtected;
