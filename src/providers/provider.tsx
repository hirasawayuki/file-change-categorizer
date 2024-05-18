import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { getBucket } from "@extend-chrome/storage";

import { Label, Repository, Rule } from "@/types";
import { LabelBucket, RepositoryBucket } from "@/types/storage";

const labelBucket = getBucket<LabelBucket>("label_bucket", "sync");
const repositoryBucket = getBucket<RepositoryBucket>("repository_bucket", "sync");

type RouterContextType = {
  currentPath: string;
  setCurrentPath: (path: string) => void;
  params: object;
  setParams: (params: object) => void;
};

const routerContextDefaultValue = {
  currentPath: "",
  setCurrentPath: (path: string) => path,
  params: {},
  setParams: (params: object) => params,
};

export const RouterContext = createContext<RouterContextType>(
  routerContextDefaultValue
);

type RouterProps = {
  children: ReactNode;
};

export const RouterProvider = ({ children }: RouterProps) => {
  const [currentPath, setCurrentPath] = useState<string>("/repositories");
  const [params, setParams] = useState<object>({});

  const contextValue = {
    currentPath,
    setCurrentPath: (path: string) => {
      setCurrentPath(path);
    },
    params,
    setParams,
  };

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
};

type StorageContextType = {
  repositories: Repository[];
  addRepository: (repository: Repository) => void;
  updateRepository: (repository: Repository) => void;
  updateRepositories: (repositories: Repository[]) => void;
  removeRepository: (repository: Repository) => void;
  removeAllRepositories: () => void;

  addRule: (rule: Rule) => void;
  updateRule: (rule: Rule) => void;
  removeRule: (rule: Rule) => void;

  labels: Label[];
  addLabel: (label: Label) => void;
  updateLabel: (label: Label) => void;
  updateLabels: (labels: Label[]) => void;
  removeLabel: (label: Label) => void;
  removeAllLabels: () => void;
}

const storageContextDefaultValue: StorageContextType = {
  repositories: [],
  addRepository: (repository: Repository) => repository,
  updateRepository: (repository: Repository) => repository,
  updateRepositories: (repositories: Repository[]) => repositories,
  removeRepository: (repository: Repository) => repository,
  removeAllRepositories: () => {},
  addRule: (rule: Rule) => rule,
  updateRule: (rule: Rule) => rule,
  removeRule: (rule: Rule) => rule,
  labels: [],
  addLabel: (label: Label) => label,
  updateLabel: (label: Label) => label,
  updateLabels: (labels: Label[]) => labels,
  removeLabel: (label: Label) => label,
  removeAllLabels: () => {},
};

export const StorageContext = createContext<StorageContextType>(
  storageContextDefaultValue
);

export const StorageProvider = ({ children }: React.PropsWithChildren) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);

  const addRepository = useCallback(async (repository: Repository) => {
    if (repositories.find(r => r.uid === repository.uid)){
      throw Error(`The repository ID "${repository.uid}" already exists. Please try a different ID or check the existing repositories.`);
    }
    const newRepositories = _sortRepositories([...repositories, repository])
    repositoryBucket.set({ repositories: newRepositories })
    setRepositories(newRepositories)
  }, [repositories]);

  const removeRepository = useCallback(async (repository: Repository) => {
    const newRepositories = repositories.filter((li) => li.uid != repository.uid)
    repositoryBucket.set({repositories: newRepositories})
    setRepositories(newRepositories)
  }, [repositories]);

  const removeAllRepositories = useCallback(async () => {
    repositoryBucket.set({repositories: []})
    setRepositories([])
  }, [repositories])

  const updateRepository = useCallback(async (repository: Repository) => {
    const newRepositories = _sortRepositories([...repositories.filter(r => r.uid !== repository.uid), repository])
    repositoryBucket.set({repositories: newRepositories})
    setRepositories(newRepositories)
  }, [repositories]);

  const updateRepositories = useCallback(async (repositories: Repository[]) => {
    const uidSet = new Set<string>();
    for (const repository of repositories) {
        if (uidSet.has(repository.uid)) {
          throw Error(`The repository ID "${repository.uid}" already exists. Please try a different ID or check the existing labels.`);
        }
        uidSet.add(repository.uid);
    }
    const newRepositories = _sortRepositories(repositories)
    await repositoryBucket.set({repositories: newRepositories})
    setRepositories(newRepositories)
  }, [repositories]);

  const addRule = useCallback((rule: Rule) => {
    const repository = repositories.find(r => r.uid === rule.repositoryUid);
    if (!repository) return
     repository.rules = _sortRules([...repository.rules, rule])
     updateRepository(repository)
  }, [repositories]);

  const updateRule = useCallback((rule: Rule) => {
    const repository = repositories.find(r => r.uid === rule.repositoryUid);
    if (!repository) return;
    repository.rules= _sortRules([...repository.rules.filter(r => r.uid !== rule.uid), rule]);
    updateRepository(repository)
  }, [repositories]);

  const removeRule = useCallback((rule: Rule) => {
    const repository = repositories.find(r => r.uid === rule.repositoryUid);
    if (!repository) return
    repository.rules= [...repository.rules.filter(r => r.uid !== rule.uid)]
    updateRepository(repository)
  }, [repositories]);

  const addLabel = useCallback((label: Label) => {
    if (labels.find(l => l.uid === label.uid)){
      throw Error(`The label ID "${label.uid}" already exists. Please try a different ID or check the existing labels.`);
    }

    const newLabels = _sortLabels([...labels, label])
    labelBucket.set({ labels: newLabels })
    setLabels(newLabels)
  }, [labels]);

  const updateLabel = useCallback((label: Label) => {
    const newLabels = _sortLabels([...labels.filter((l) => l.uid !== label.uid), label])
    labelBucket.set({ labels: newLabels })
    setLabels(newLabels)
  }, [labels]);

  const updateLabels = useCallback((labels: Label[]) => {
    const uidSet = new Set<string>();
    for (const label of labels) {
        if (uidSet.has(label.uid)) {
          throw Error(`The label ID "${label.uid}" already exists. Please try a different ID or check the existing labels.`);
        }
        uidSet.add(label.uid);
    }
    const newLabels = _sortLabels(labels)
    labelBucket.set({ labels: newLabels })
    setLabels(newLabels)
  }, [labels]);

  const removeLabel = useCallback(async (label: Label) => {
    const newLabels = labels.filter((l) => l.uid != label.uid)
    labelBucket.set({ labels: newLabels })
    setLabels(newLabels);

    const newRepositories = repositories.map(repo => {
      repo.rules = repo.rules.filter(rule => rule.labelUid !== label.uid)
      return repo
    })

    repositoryBucket.set({ repositories: newRepositories })
    setRepositories(newRepositories)
  }, [repositories, labels]);

  const removeAllLabels = useCallback(async () =>  {
    labelBucket.set({labels: []});
    setLabels([]);
  }, [labels])

  useEffect(() => {
    (async () => {
      const { labels } = await labelBucket.get();
      setLabels(labels || [])

      const { repositories } = await repositoryBucket.get();
      setRepositories(repositories || [])
    })();
  }, []);

  return (
    <StorageContext.Provider
      value={{
        repositories,
        addRepository,
        updateRepository,
        updateRepositories,
        removeRepository,
        removeAllRepositories,
        addRule,
        updateRule,
        removeRule,
        labels,
        addLabel,
        updateLabel,
        updateLabels,
        removeLabel,
        removeAllLabels,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}

const _sortRepositories = (repositories: Repository[]) => {
  const sorted = repositories.sort((a, b) => {
    if (a.organization + a.name < b.organization + b.name) {
      return -1;
    } else if (a.organization + a.name > b.organization + b.name) {
      return 1;
    } else {
      return 0;
    }
  })

  return sorted.map(r => {
    r.rules = _sortRules(r.rules)
    return r;
  })
}

const _sortRules = (rules: Rule[]) => {
  const sorted = rules.sort((a, b) => {
    if (a.created > b.created) {
      return -1;
    } else if (a.created < b.created) {
      return 1;
    } else {
      return 0;
    }
  })

  return sorted.map(r => {
    r.patterns = r.patterns.sort((a, b) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    })

    return r
  })
}

const _sortLabels = (labels: Label[]) => {
  return labels.sort((a, b) => {
    if (a.text < b.text) {
      return -1;
    } else if (a.text > b.text) {
      return 1;
    } else {
      return 0;
    }
  })
}
