import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const Loader = () => {
  return(
    <div className="flex gap-5 items-center p-4">
      <div className="h-5 w-5 bg-zinc-700 rounded-full animate-bounce-sequential-sequential delay-[0s]"></div>
      <div className="h-5 w-5 bg-zinc-700 rounded-full animate-bounce-sequential delay-[2s]"></div>
      <div className="h-5 w-5 bg-zinc-700 rounded-full animate-bounce-sequential delay-[4s]"></div>
    </div>
    );
};


export const SkeletonLoader = () => (
  <Skeleton height={300} width={300} borderRadius={10} />
);
