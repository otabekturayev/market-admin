import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import RootLayout from "./layout/Layout";
import Error404 from "./pages/Error404/Error404";
import Login from "./pages/Auth/Login";
import Category from "./pages/Category/Category";
import Products from "./pages/Products/Products";
import { ConfigProvider } from "antd";
import { useDarkModeStore } from "./store/darkModeStore";
import { useStore } from "./store/userStore";
import { useEffect } from "react";

const App: React.FC = () => {
  const { darkMode } = useDarkModeStore();
  const navigate = useNavigate();
  const { accessToken } = useStore();

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken]);

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
            <Route index element={<Category />} />
            <Route path="/products" element={<Products />} />
            <Route path="/*" element={<Error404 />} />
          </Route>
        </Routes>
      </ConfigProvider>
    </>
  );
};

export default App;
