export type Repository = {
  uid: string;
  organization: string;
  name: string;
  rules: Rule[];
  created: string;
  modified: string;
};

export type Rule = {
  uid: string;
  repositoryUid: string;
  labelUid: string;
  patterns: string[];
  actions: "close_file"[];
  active: boolean;
  created: string;
  modified: string;
};

export type Label = {
  uid: string;
  text: string;
  backgroundColor: string;
  color: string;
  created: string;
  modified: string;
};
