import { useCallback, useContext, useMemo, useState } from "react"
import { v4 as uuidv4 } from 'uuid';

import SearchInput from "@/components/search-input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { nowRFC3339 } from "@/lib/date";
import RepositoryForm, { RepositoryFormValue } from "@/popup/pages/repository/_components/RepositoryForm"
import RepositoryList from "@/popup/pages/repository/_components/RepositoryList"
import { StorageContext } from "@/providers/provider"

export default function RepositoryPage() {
  const { repositories, addRepository, removeRepository } = useContext(StorageContext)
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState("")

  const filteredRepositories = useMemo(() => repositories.filter(repository => {
    const repoName = `${repository.organization}/${repository.name}`
    return repoName.toLowerCase().includes(searchKeyword.toLowerCase())
  }), [repositories, searchKeyword])

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value)
  }, [])

  const handleCreate = (value: RepositoryFormValue) => {
    addRepository({
      uid: uuidv4(),
      organization: value.organization,
      name: value.name,
      rules: [],
      created: nowRFC3339(),
      modified: nowRFC3339(),
    })
    setIsOpenDialog(false)
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="mx-auto py-2 text-xl font-bold">Repositories</h1>

      <div className="flex items-center justify-between gap-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <SearchInput searchKeyword={searchKeyword} handleSearch={handleSearch} />
        <Button size="sm" className="text-xs" onClick={() => setIsOpenDialog(true)}>Add +</Button>
      </div>

      <Dialog open={isOpenDialog} onOpenChange={() => setIsOpenDialog(false)}>
        <DialogContent className="rounded-md">
          <DialogHeader>
            <DialogTitle>Create Repository</DialogTitle>
          </DialogHeader>
          <RepositoryForm onSubmit={handleCreate} />
        </DialogContent>
      </Dialog>

      <RepositoryList repositories={filteredRepositories} remove={removeRepository}/>
    </div>
  )
}
