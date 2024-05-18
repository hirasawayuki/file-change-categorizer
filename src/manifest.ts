import { defineManifest } from "@crxjs/vite-plugin";

import { version } from "../package.json";

const manifest = defineManifest(async (env) => ({
  manifest_version: 3,
  name: `${env.mode === 'development' ? '[Dev] ' : ''}FileChangeCategorizer`,
  description: 'Enhance your GitHub experience by automatically categorizing and labeling files based on predefined rules in commit histories and pull requests. Streamline your workflow and keep your repository organized with FileChangeCategorizer.',
  version,
  background: {
    service_worker: 'background/index.ts',
  },
  content_scripts: [
    {
      matches: ['https://github.com/*'],
      js: ['content/index.tsx'],
    },
  ],
  host_permissions: ['<all_urls>'],
  action: {
    default_popup: 'popup/popup.html',
    default_icon: {
      '48': 'images/extension_48.png',
    },
  },
  icons: {
    '48': 'images/extension_48.png',
  },
  permissions: ['storage', 'tabs'],
  content_security_policy: {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}));

export default manifest;
