import { ScrollArea } from "@/components/ui/scroll-area";
import RepositoryDetail from "@/popup/pages/repository/_components/RepositoryDetail";
import { Repository } from "@/types"

type Props = {
  repositories: Repository[];
  remove: (repository: Repository) => void;
}

export default function RepositoryList({ repositories, remove }: Props) {
  return (
    <ScrollArea className="h-[360px] w-full rounded-md">
      <div className="flex flex-col gap-2 pt-0">
        {
          !repositories.length &&
          <div className="mx-auto mt-8">No repository found. Let's add some!</div>
        }
        {
          repositories.map(repo => {
            return <RepositoryDetail key={repo.uid} repository={repo} remove={remove} />
          })
        }
      </div>
    </ScrollArea>
  )
}
