import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input, Button } from 'antd';
import useApiMutation from '../../hooks/useMutation';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {useStore} from '../../store/userStore'
import { useDarkModeStore } from '../../store/darkModeStore';

interface FormValues {
  login: string;
  password: string;
}

const Login: React.FC = () => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      login: 'admin1234',
      password: 'admin1996',
    },
  });
  const navigate = useNavigate();
  const { setUser } = useStore();
  const { darkMode } = useDarkModeStore();

  // useApiMutation hook'ini chaqirish
  const { mutate, isLoading } = useApiMutation({
    url: '/auth/login',
    method: 'POST',
    onSuccess: (data) => {
      setUser(data?.access_token, data?.refresh_token, data?.id);
      toast.success('Tizimga muvaffaqiyatli kirdingiz');
      reset();
      navigate('/');
    },
    onError: (error: any) => {
      if(error?.status === 400) {
        toast.error("Login yoki parol xato kiritildi")
      }else{
        toast.error("Tizimga kirishda xatolik yuz berdi");
      }
      
    }
  });

  // Formni yuborish uchun handler
  const onSubmit = (data: FormValues) => {
    mutate(data);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#001529]' : 'bg-gray-100'}`}>
      <div className={`w-full max-w-sm p-8  rounded-lg shadow-lg ${darkMode ? 'bg-[#002140] text-white' : 'bg-white'}`}>
        <h2 className="text-[30px] font-bold text-center text-red-600 mb-10">
          Logo
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-1">Login</label>
            <Controller
              name="login"
              control={control}
              rules={{
                required: "Login maydoni talab qilinadi",
                minLength: {
                  value: 3,
                  message: "Login kamida 3 ta belgidan iborat bo'lishi kerak",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Foydalanuvchi nomi"
                />
              )}
            />
            {errors.login && (
              <p className="text-red-500 text-sm">{errors.login.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Parol</label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Parol maydoni talab qilinadi",
                minLength: {
                  value: 3,
                  message: "Parol kamida 3 ta belgidan iborat bo'lishi kerak",
                },
              }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Parol"
                />
              )}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            Kirish
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
