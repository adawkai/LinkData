import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function HomeRoute() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/feed");
  }, [navigate]);

  return null;
}
