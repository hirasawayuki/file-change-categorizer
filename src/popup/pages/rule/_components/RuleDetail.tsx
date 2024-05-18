import { useContext, useState } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { nowRFC3339 } from "@/lib/date";
import Label from "@/popup/pages/rule/_components/Label";
import Pattern from "@/popup/pages/rule/_components/Pattern";
import RuleForm, { RuleFormValue } from "@/popup/pages/rule/_components/RuleForm";
import { StorageContext } from "@/providers/provider";
import { Repository, Rule } from "@/types"

import PatternForm, { PatternFormValue } from "./PatternForm";

type RuleDetailProps = {
  repository: Repository;
  rule: Rule;
}

export default function RuleDetail({ rule }: RuleDetailProps) {
  const [isOpenEditForm, setIsOpenEditForm] = useState(false)
  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false)
  const [isOpenCreatePatternForm, setIsOpenCreatePatternForm] = useState(false)
  const { updateRule, removeRule, labels } = useContext(StorageContext);

  const handleUpdate = (value: RuleFormValue) => {
    const newRule: Rule = {
      uid: rule.uid,
      repositoryUid: rule.repositoryUid,
      labelUid: value.labelUid,
      actions: rule.actions,
      patterns: rule.patterns,
      active: rule.active,
      created: rule.created,
      modified: nowRFC3339(),
    }

    if (value.enableCloseFileOption && !newRule.actions.includes("close_file")) {
      newRule.actions.push("close_file")
    } else if (!value.enableCloseFileOption && newRule.actions.includes("close_file")) {
      newRule.actions = newRule.actions.filter(action => action !== "close_file")
    }

    updateRule(newRule)
    setIsOpenEditForm(false)
  }

  const handleActivate = (checked: boolean) => {
    const newRule = {...rule, active: checked, modified: nowRFC3339()}
    updateRule(newRule)
  }

  const handleCreatePattern = (values: PatternFormValue) => {
    rule.patterns.push(values.pattern)
    rule.modified = nowRFC3339(),
    updateRule(rule)
    setIsOpenCreatePatternForm(false)
  }

  const defaultValues = {
    enableCloseFileOption: rule.actions.includes("close_file"),
    labelUid: rule.labelUid,
  }

  return (
    <>
      <div className="rounded-lg border p-2">
        <div className="flex items-center justify-between gap-2 transition-all" >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-left text-sm">
              <span className="font-semibold">Do this: </span>Apply label <Label labelUid={rule.labelUid} />
              {
                rule.actions.includes("close_file") && <>and <span className="font-semibold">`close file`</span></>
              }
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <Switch checked={rule.active} onCheckedChange={handleActivate} />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <DotsHorizontalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => setIsOpenEditForm(true)}
                >
                  Edit Rule
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsOpenDeleteAlert(true)}
                  className="text-red-500"
                >
                  Delete Rule
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold">File path patterns</div>
          <div className="rounded-md border text-sm">
            <ScrollArea className={`${rule.patterns.length > 5 && "h-[240px]"} w-full rounded-md p-2`}>
              <div className="flex flex-col gap-2">
                { rule.patterns.map(pattern => <Pattern key={pattern} rule={rule} pattern={pattern} />) }
              </div>
            </ScrollArea>
          </div>
          <button className="w-[96px] p-1 font-semibold hover:underline" onClick={() => setIsOpenCreatePatternForm(true)}>Add pattern +</button>
        </div>
      </div>

      <Dialog open={isOpenEditForm} onOpenChange={() => setIsOpenEditForm(false)}>
        <DialogContent className="rounded-md">
          <DialogHeader>
            <DialogTitle>Edit Rule</DialogTitle>
          </DialogHeader>
          <RuleForm onSubmit={handleUpdate} defaultValues={defaultValues} labels={labels} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isOpenDeleteAlert} onOpenChange={() => setIsOpenDeleteAlert(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete repository rule from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => removeRule(rule)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isOpenCreatePatternForm} onOpenChange={() => setIsOpenCreatePatternForm(false)}>
        <DialogContent className="rounded-md">
          <DialogHeader>
            <DialogTitle>Register File Path Pattern</DialogTitle>
          </DialogHeader>
          <PatternForm onSubmit={handleCreatePattern} patterns={rule.patterns} />
        </DialogContent>
      </Dialog>
    </>
  )
}
