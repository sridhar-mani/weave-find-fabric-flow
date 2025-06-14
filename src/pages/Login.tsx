import React from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";

const Login: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4">
      <LoginForm onSuccess={() => navigate("/")} />
    </div>
  );
};

export default Login;
