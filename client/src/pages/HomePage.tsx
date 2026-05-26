import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/signin", replace: true });
  }, [navigate]);

  return null;
}

export default HomePage;
