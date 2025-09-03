import { useEffect, useState } from "react";
import axios from "axios";

interface Data {
  role: string;
  content: string;
  refusal: null | boolean;
  reasoning: string;
}

export function useAnswer(prompt: string) {
  const [enabled, setEnabled] = useState(false);
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => {
    if (prompt?.trim().length > 0) {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, [prompt]);

  useEffect(() => {
    const fetchAnswer = async () => {
      try {
        const res = await axios.post("/api/result", { prompt });
        if (!res.data) {
          throw new Error("No data received from API");
        }
        setData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (enabled) {
      fetchAnswer();
    }
  }, [enabled, prompt]);

  return data;
}
