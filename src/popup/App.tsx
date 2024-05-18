import { Route } from "@/components/router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import Setting from "@/popup/_components/Setting";
import LabelPage from "@/popup/pages/label";
import RepositoryPage from "@/popup/pages/repository";
import RootPage from "@/popup/pages/root";
import RulePage from "@/popup/pages/rule";


export const App = () => {
  return (
    <div className="w-[560px]">
      <Tabs defaultValue="repository" className="w-auto">
        <div className="flex h-[64px] w-full items-center justify-between border px-4">
          <h1 className="font-bold">FileChangeCategorizer</h1>
          <div className="flex items-center gap-2">
            <TabsList className="grid w-[240px] grid-cols-2">
              <TabsTrigger value="repository">Repository</TabsTrigger>
              <TabsTrigger value="label">Label</TabsTrigger>
            </TabsList>
            <Setting />
          </div>
        </div>
        <TabsContent value="repository">
          <div className="border">
            <Route path="/" element={<RootPage />} />
            <Route path="/repositories" element={<RepositoryPage />} />
            <Route path="/repositories/:repositoryId/rules" element={<RulePage />} />
          </div>
        </TabsContent>
        <TabsContent value="label">
          <div className="border">
            <LabelPage />
          </div>
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
};
