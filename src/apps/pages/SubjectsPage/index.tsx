import useSubjectsQuery from "../../../apis/queries/subjects.quries";
import SubjectItem from "../../components/SubjectItem";

const SubjectsPage = () => {
  const { data, isLoading } = useSubjectsQuery();

  return (
    <div className="min-h-screen px-6">
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-2xl bg-primary/8"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.map((item, index) => (
            <SubjectItem key={index} {...item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectsPage;
