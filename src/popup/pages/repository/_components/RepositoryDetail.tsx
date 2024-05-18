import { useContext, useState } from "react";
import { SquarePen, Trash2 } from "lucide-react";

import { NavLink } from "@/components/router";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { nowRFC3339 } from "@/lib/date";
import RepositoryForm, { RepositoryFormValue } from "@/popup/pages/repository/_components/RepositoryForm";
import { StorageContext } from "@/providers/provider";
import { Repository } from "@/types"

type Props = {
  repository: Repository;
  remove: (repo: Repository) => void;
}

export default function RepositoryDetail({ repository, remove }: Props) {
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [isOpenAlert, setIsOpenAlert] = useState(false)
  const { updateRepository } = useContext(StorageContext)

  const onSubmit = (value: RepositoryFormValue) => {
    updateRepository({
      uid: repository.uid,
      organization: value.organization,
      name: value.name,
      rules: [...repository.rules],
      created: repository.created,
      modified: nowRFC3339(),
    })
    setIsOpenDialog(false)
  }

  return (
    <>
      <div
        key={repository.uid}
        className="flex justify-between gap-2 rounded-md border p-2 text-left text-sm transition-all"
      >
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <NavLink
              className="text-base font-bold hover:underline"
              to={`/repositories/${repository.uid}/rules`}
            >
              {`${repository.organization}/${repository.name}`}
            </NavLink>
          </div>
          <div>registered {repository.rules.length} rules</div>
        </div>

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
            <DialogTitle>Edit Repository</DialogTitle>
          </DialogHeader>
          <RepositoryForm onSubmit={onSubmit} defaultValues={repository} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isOpenAlert} onOpenChange={() => setIsOpenAlert(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible and will permanently remove the repository and<br />
              <span className="text-red-500"> all associated rules from storage</span>.<br />
              Ensure that you want to proceed before confirming deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => remove(repository)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
