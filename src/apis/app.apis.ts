import type { SubjectsResponseData } from "../types";
import { http } from "./http";

export const AppApis = {
  fetchSubjects: async (): Promise<SubjectsResponseData[]> => {
    const res = await http.get("/subjects");
    return res.data;
  },
};

export default AppApis;
