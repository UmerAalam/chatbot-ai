import { queryOptions, useQuery } from "@tanstack/react-query";

interface Data {
  role: string;
  content: string;
  refusal: null | boolean;
  reasoning: string;
}

import axios from "axios";
import { useEffect, useState } from "react";
const getPromptResult = (prompt: string) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (prompt !== undefined && prompt?.trim().length > 0) {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, [prompt]);
  return queryOptions({
    queryKey: ["promptResult", prompt],
    queryFn: async () => {
      const res = await axios.post("/api/result", {
        prompt: prompt,
      });
      if (!res.data) {
        throw new Error("Error getting prompt result");
      }
      return res.data as Data;
    },
    enabled,
  });
};

export const usePromptResult = (prompt: string) => {
  return useQuery(getPromptResult(prompt));
};
