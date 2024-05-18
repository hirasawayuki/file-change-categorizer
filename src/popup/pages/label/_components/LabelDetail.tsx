import { useContext, useState } from "react";
import { SquarePen, Trash2 } from "lucide-react";

import LabelPreview from "@/components/label-preview";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { nowRFC3339 } from "@/lib/date";
import LabelForm, { LabelFormValue } from "@/popup/pages/label/_components/LabelForm";
import { StorageContext } from "@/providers/provider";
import { Label } from "@/types";

type Props = {
  label: Label
}

export default function LabelDetail({ label }: Props) {
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [isOpenAlert, setIsOpenAlert] = useState(false)
  const { updateLabel, removeLabel } = useContext(StorageContext)

  const handleUpdate = (values: LabelFormValue) => {
    const newLabel: Label = {
      uid: label.uid,
      text: values.text,
      backgroundColor: values.backgroundColor,
      color: values.color,
      created: label.created,
      modified: nowRFC3339(),
    }
    updateLabel(newLabel)
    setIsOpenDialog(false)
  }

  return (
    <>
      <div key={label.uid} className="flex justify-between gap-2 rounded-md border p-2 text-left text-sm transition-all">
        <LabelPreview text={label.text} backgroundColor={label.backgroundColor} color={label.color} />
        <div className="flex items-center gap-2">
          <button onClick={() => setIsOpenDialog(true)}>
            <SquarePen className="size-4 text-muted-foreground" />
          </button>
          <button onClick={() => setIsOpenAlert(true)}>
            <Trash2 className="size-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <Dialog open={isOpenDialog} onOpenChange={() => setIsOpenDialog(false)}>
        <DialogContent className="rounded-md">
          <DialogHeader>
            <DialogTitle>Edit Label</DialogTitle>
          </DialogHeader>
          <LabelForm onSubmit={handleUpdate} defaultValues={label} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isOpenAlert} onOpenChange={() => setIsOpenAlert(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible and will permanently remove the label and<br />
              <span className="text-red-500"> all associated rules from storage</span>.<br />
              Ensure that you want to proceed before confirming deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => removeLabel(label)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
