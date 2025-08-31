import { queryOptions, useQuery } from "@tanstack/react-query";

import axios from "axios";
const getPromptResult = (prompt: string) => {
  const enabled = Boolean(prompt?.trim());
  return queryOptions({
    queryKey: ["promptResult", prompt],
    queryFn: async () => {
      const res = await axios.post("/api/result", {
        prompt: prompt,
      });
      if (!res.data) {
        throw new Error("Error getting prompt result");
      }
      return res.data;
    },
    enabled,
  });
};

export const usePromptResult = (prompt: string) => {
  return useQuery(getPromptResult(prompt));
};
