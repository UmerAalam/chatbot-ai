import { queryOptions, useQuery } from "@tanstack/react-query";
import { Prompt } from "../../../server/src/modules/openai.dto";
import axios from "axios";
const getPromptResult = (prompt: Prompt) => {
  return queryOptions({
    queryKey: ["promptResult", prompt],
    queryFn: async () => {
      const res = await axios.get("/api/result", {
        params: { prompt },
      });

      if (!res.data) {
        throw new Error("Error getting prompt result");
      }
      return res.data;
    },
  });
};

export const usePromptResult = (prompt: Prompt) => {
  return useQuery(getPromptResult(prompt));
};
