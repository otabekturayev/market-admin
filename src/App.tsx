import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import RootLayout from "./layout/Layout";
import Error404 from "./pages/Error404/Error404";
import Login from "./pages/Auth/Login";
import Lavel from "./pages/Lavel/Lavel";
import Travel from "./pages/Travel/Travel";
import Attractions from "./pages/Attractions/Attractions";
import TravelDesigners from "./pages/TravelDesigner/TravelDesigner";
import Services from "./pages/Services/Services";
import Days from "./pages/Days/Days";
import Articles from "./pages/Articles/Articles";
import SubArticles from "./pages/SubArticles/SubArticles";
import Operators from "./pages/Operators/Operators";
import TravelTypes from "./pages/TRavelTypes/TravelTypes";
import { ConfigProvider } from "antd";
import { useDarkModeStore } from "./store/darkModeStore";

const App: React.FC = () => {
  const { darkMode } = useDarkModeStore();
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorBgBase: darkMode ? "#002140" : "#ffffff",
            colorTextBase: darkMode ? "#ffffff" : "#000000",
            colorBorder: darkMode ? "#ffffff33" : "#d9d9d9", // 🛠 border rangi
            colorBorderSecondary: darkMode ? "#ffffff33" : "#f0f0f0",
          },
        }}
      >
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Lavel />} />
            <Route path="/travel-types" element={<TravelTypes />} />
            <Route path="/travel-designers" element={<TravelDesigners />} />
            <Route path="/travel" element={<Travel />} />
            <Route path="/attractions" element={<Attractions />} />
            <Route path="/services" element={<Services />} />
            <Route path="/days" element={<Days />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/subarticles" element={<SubArticles />} />
            <Route path="/operators" element={<Operators />} />
            <Route path="/*" element={<Error404 />} />
          </Route>
        </Routes>
      </ConfigProvider>
    </>
  );
};

export default App;
