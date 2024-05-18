import { memo } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type SearchInputProps = {
  searchKeyword: string
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function SearchInput({ searchKeyword, handleSearch }: SearchInputProps) {
  return (
    <form className="w-1/2">
      <div className="relative">
        <Search className="absolute left-2 top-2 size-4 text-muted-foreground" />
        <Input className="pl-8" placeholder="Search" value={searchKeyword} onChange={handleSearch} />
      </div>
    </form>
  )
}

export default memo(SearchInput);
