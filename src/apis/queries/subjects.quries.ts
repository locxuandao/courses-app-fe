import { useQuery } from "@tanstack/react-query";
import { AppApis } from "../app.apis";

export const useSubjectsQuery = () =>
  useQuery({
    queryKey: ["subjects"],
    queryFn: AppApis.fetchSubjects,
    staleTime: 1000 * 60 * 2,
  });

export default useSubjectsQuery;
