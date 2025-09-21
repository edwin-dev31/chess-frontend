import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const OAuthSuccess = () => {
  console.log("✅ Componente OAuthSuccess montado");
  const navigate = useNavigate();
  const alreadyHandled = useRef(false); 

  useEffect(() => {
    if (alreadyHandled.current) return;
    alreadyHandled.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token); 

      toast.success("Login with OAuth successful!");
      console.log("Login with OAuth successful!")
      setTimeout(() => navigate("/app"), 300);
    } else {
      toast.error("No token received from OAuth");
      console.log("No token received from OAuth")
      setTimeout(() => navigate("/login"), 300);
    }
  }, [navigate]);

  return <p style={{ textAlign: "center", marginTop: "2rem" }}>Processing login...</p>;

};

export default OAuthSuccess;