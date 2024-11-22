import Home from "../pages/Home/Home";
import DependentData from "../pages/DependentData/DependentData";
import SmsHandler from "../pages/SmsHandler/SmsHandler";
import EmergencyPhone from "../pages/EmergencyPhone/EmergencyPhone";
import DependentFullData from "../pages/DependentFullData/DependentFullData";
import InitialTreatment from "../pages/InitialTreatment/InitialTreatment";

export const routes = [
  { path: "/", element: <InitialTreatment /> },
  { path: "/emergencyPhone", element: <EmergencyPhone /> },
  { path: "/dependentFullData", element: <DependentFullData /> },
  { path: "/dependentData", element: <DependentData /> },
  { path: "/smsHandler", element: <SmsHandler /> },
  { path: "/loadingScreen", element: <Home /> },
];
