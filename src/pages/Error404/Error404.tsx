import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-full">
      <Result
        status="404"
        title="404"
        subTitle="Kechirasiz, siz tashrif buyurgan sahifa mavjud emas."
        extra={
          <Button onClick={() => navigate("/")} type="primary">
            Bosh sahifaga qaytish
          </Button>
        }
      />
    </div>
  );
};

export default Error404;
