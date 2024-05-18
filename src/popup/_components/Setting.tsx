import { useContext, useEffect, useState } from "react";
import { Settings } from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { StorageContext } from "@/providers/provider";
import { JSONData } from "@/types/json";

export default function Setting() {
  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);
  const [storageData, setStorageData] = useState<JSONData>({
    labels: [],
    repositories: [],
  });
  const {
    repositories,
    updateRepositories,
    removeAllRepositories,
    labels,
    updateLabels,
    removeAllLabels
  } = useContext(StorageContext)
  const { toast } = useToast();

  useEffect(() => setStorageData({ labels, repositories, }), [repositories, labels])

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(storageData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = "pr_categorizer_data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const oldLabels = [...labels];
    const oldRepositories = [...repositories];
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const json = JSON.parse(e.target!.result as string) as JSONData;

      try {
        updateLabels([...labels, ...json.labels]);
        updateRepositories([...repositories, ...json.repositories]);
      } catch(err) {
        // Rollback
        updateLabels(oldLabels);
        updateRepositories(oldRepositories);
        toast({
          variant: "destructive",
          title: "Error",
          description: err instanceof Error ? err.message : "unexpected error"
        })
      }
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleDeleteAllData = async () => {
    removeAllRepositories();
    removeAllLabels();
    await chrome.storage.sync.clear();
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <Settings height={20} width={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
          >
            <label htmlFor="file-import">Import Data</label>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportJSON}>
            Export Data
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsOpenDeleteAlert(true)}
            className="text-red-500"
          >
            Delete All Data
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <input
        id="file-import"
        className="hidden"
        type="file"
        accept="*.json"
        onChange={handleImportJSON}
      />

      <AlertDialog open={isOpenDeleteAlert} onOpenChange={() => setIsOpenDeleteAlert(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="text-red-500">
                This action cannot be undone.<br />
                This will permanently deleteAll Data from storage.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAllData}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
