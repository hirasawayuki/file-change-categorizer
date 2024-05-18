import { useContext, useState } from "react";
import { SquarePen, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { nowRFC3339 } from "@/lib/date";
import { StorageContext } from "@/providers/provider";
import { Rule } from "@/types"

import PatternForm, { PatternFormValue } from "./PatternForm";

type Props = {
  rule: Rule;
  pattern: string;
}

export default function Pattern({ rule, pattern }: Props) {
  const [isOpenEditForm, setIsOpenEditForm] = useState(false)
  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false)
  const { updateRule } = useContext(StorageContext)

  const handleUpdate = (values: PatternFormValue) => {
    rule.patterns = rule.patterns.filter(p => p !== pattern)
    rule.patterns.push(values.pattern)
    rule.modified = nowRFC3339()
    updateRule(rule)
    setIsOpenEditForm(false)
  }

  const handleDelete = (pattern: string) => {
    rule.patterns = rule.patterns.filter(p => p !== pattern)
    rule.modified = nowRFC3339()
    updateRule(rule)
  }

  return (
    <>
      <div className="flex justify-between gap-2 rounded-lg border p-2">
        { pattern }
        <div className="flex gap-2">
          <button onClick={() => { setIsOpenEditForm(true) }}>
            <SquarePen className="size-4 text-muted-foreground" />
          </button>
          <button onClick={() => { setIsOpenDeleteAlert(true) }}>
            <Trash2 className="size-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <Dialog open={isOpenEditForm} onOpenChange={() => setIsOpenEditForm(false)}>
        <DialogContent className="rounded-md">
          <DialogHeader>
            <DialogTitle>Edit file path pattern</DialogTitle>
          </DialogHeader>
          <PatternForm onSubmit={handleUpdate} defaultValues={{ pattern }} patterns={rule.patterns} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isOpenDeleteAlert} onOpenChange={() => setIsOpenDeleteAlert(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete file path pattern from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(pattern)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
