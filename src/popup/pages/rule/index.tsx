import { useCallback, useContext, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

import { NavLink } from "@/components/router";
import SearchInput from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { nowRFC3339 } from "@/lib/date";
import RuleDetail from "@/popup/pages/rule/_components/RuleDetail";
import RuleForm, { RuleFormValue } from "@/popup/pages/rule/_components/RuleForm";
import { RouterContext,StorageContext } from "@/providers/provider";
import { Rule } from "@/types";

export default function RulePage() {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("")
  const { repositories, addRule, labels } = useContext(StorageContext);
  const { params } = useContext(RouterContext);
  const { repositoryId } = params as { repositoryId: string };
  const repository = repositories.find((r) => r.uid === repositoryId);
  const rules = repository?.rules || [];
  const normalizedSearchKeyword = searchKeyword.toLowerCase();

  const filteredRules = useMemo(() => rules.filter(rule => {
    if (!normalizedSearchKeyword) return true;
    return rule.patterns.some(pattern => pattern.toLowerCase().includes(normalizedSearchKeyword));
  }).map(rule => {
    if (!normalizedSearchKeyword) return rule;
    return {
      ...rule,
      patterns: rule.patterns.filter(pattern => pattern.toLowerCase().includes(normalizedSearchKeyword))
    };
  }), [rules, normalizedSearchKeyword]);

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value)
  }, [])

  const handleCreate = (values: RuleFormValue) => {
    if (!repository) return;
    const newRule: Rule = {
      uid: uuidv4(),
      repositoryUid: repository.uid,
      labelUid: values.labelUid,
      actions: [],
      patterns: values.pattern ? [values.pattern] : [],
      active: true,
      created: nowRFC3339(),
      modified: nowRFC3339(),
    }

    if (values.enableCloseFileOption) {
      newRule.actions.push("close_file")
    }

    addRule(newRule)
    setIsOpenDialog(false)
  };

  return (
    <>
      <NavLink
        className="absolute left-4 flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        to="/"
      >
        <ArrowLeft height={16} width={16} />Back
      </NavLink>
      <div className="flex flex-col gap-4 p-4">
        <h1 className="mx-auto py-2 text-xl font-bold">
          <span className="font-medium">`{`${repository?.organization}/${repository?.name}`}` </span>rules
        </h1>

        <div className="flex items-center justify-between gap-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SearchInput searchKeyword={searchKeyword} handleSearch={handleSearch} />
          <Button size="sm" className="text-xs" onClick={() => setIsOpenDialog(true)}>Add +</Button>
        </div>

        <Dialog open={isOpenDialog} onOpenChange={() => setIsOpenDialog(false)}>
          <DialogContent className="rounded-md">
            <DialogHeader>
              <DialogTitle>Register Rule</DialogTitle>
            </DialogHeader>
            <RuleForm onSubmit={handleCreate} labels={labels} />
          </DialogContent>
        </Dialog>

        <ScrollArea className="h-[360px] w-full rounded-md">
          <div className="flex flex-col gap-2">
            { !filteredRules.length && <div className="mx-auto mt-8">No repository rules found. Let's add some!</div>}
            {
              repository && filteredRules.map(rule => {
                return <RuleDetail key={rule.uid} repository={repository} rule={rule} />
              })
            }
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
