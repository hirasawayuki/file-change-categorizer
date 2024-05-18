import { useCallback, useContext, useMemo, useState } from "react"
import { v4 as uuidv4 } from "uuid";

import SearchInput from "@/components/search-input";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { nowRFC3339 } from "@/lib/date";
import LabelDetail from "@/popup/pages/label/_components/LabelDetail";
import LabelForm, { LabelFormValue } from "@/popup/pages/label/_components/LabelForm";
import { StorageContext } from "@/providers/provider"

export default function LabelPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const { labels, addLabel } = useContext(StorageContext)

  const filteredLabels = useMemo(() => labels.filter(label => {
    return label.text.toLowerCase().includes(searchKeyword.toLowerCase())
  }), [labels, searchKeyword])

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value)
  }, [])

  const handleCreate = (values: LabelFormValue) => {
    addLabel({
      uid: uuidv4(),
      text: values.text,
      backgroundColor: values.backgroundColor,
      color: values.color,
      created: nowRFC3339(),
      modified: nowRFC3339(),
    })
    setIsDialogOpen(false)
  }

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <h1 className="mx-auto py-2 text-xl font-bold">Labels</h1>
        <div className="flex items-center justify-between gap-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SearchInput searchKeyword={searchKeyword} handleSearch={handleSearch}/>
          <Button size="sm" className="text-xs" onClick={() => setIsDialogOpen(true)}>Add +</Button>
        </div>

        <ScrollArea className="h-[360px] w-full rounded-md">
          <div className="flex flex-col gap-2 pt-0">
            { !filteredLabels.length &&
            <div className="mx-auto mt-8">No labels found. Let's add some!</div>
            }
            {
              filteredLabels.map(label => {
                return (
                  <LabelDetail key={label.uid} label={label} />
                )
              })
            }
          </div>
        </ScrollArea>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
        <DialogContent className="rounded-md">
          <DialogHeader>
            <DialogTitle>Create Label</DialogTitle>
          </DialogHeader>
          <LabelForm onSubmit={handleCreate} />
        </DialogContent>
      </Dialog>
    </>
  )
}
