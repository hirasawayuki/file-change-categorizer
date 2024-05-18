import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { getBucket } from "@extend-chrome/storage";

import { fileMatch } from "@/lib/filematch";
import { Repository } from "@/types";
import { ChromeEvent } from "@/types/event";
import { LabelBucket, RepositoryBucket } from "@/types/storage";

const PATTERN_FILE_CHANGE_PAGE = /^https:\/\/github\.com\/.*\/.*\/(pull\/.*\/files|commit).*$/;
const SELECTOR_DIFF_FILES = ".Truncate > a";
const SELECTOR_DIFF_FILE_HEADERS = "div[id^=diff-]";

const Content = () => {
  const [currentURL, setCurrentURL] = useState(window.location.href);
  const [diffFileCount, setDiffFileCount] = useState(0);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const repositoryBucket = getBucket<RepositoryBucket>('repository_bucket', 'sync');
  const labelBucket = getBucket<LabelBucket>('label_bucket', 'sync');

  useEffect(() => {
    const onMessage = (message: ChromeEvent) => {
      if (message.type === 'urlChanged') {
          setCurrentURL(message.url)
      }
    }
    chrome.runtime.onMessage.addListener(onMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(onMessage);
    }
  }, [])

  useEffect(() => {
    (async () => {
      const repoBucket = await repositoryBucket.get();
      setRepositories(repoBucket.repositories || [])
    })();
  }, [])

  useEffect(() => {
    if (!PATTERN_FILE_CHANGE_PAGE.test(currentURL)) {
      setDiffFileCount(0);
      return;
    }

    const interval = setInterval(() => {
      const files = document.querySelectorAll(SELECTOR_DIFF_FILE_HEADERS);
      setDiffFileCount(files.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentURL]);

  useEffect(() => {
    (async () => {
      const diffFiles =  document.querySelectorAll(SELECTOR_DIFF_FILES)
      const diffFileHeaders = document.querySelectorAll(SELECTOR_DIFF_FILE_HEADERS)
      const lBucket = await labelBucket.get();

      const repository = repositories.find((repo) => currentURL.includes(repo.name))
      if (!repository) return;

      diffFiles.forEach((file, index) => {
        const divElem = file.closest('div')
        if (!divElem) return;

        (repository.rules || []).forEach((rule) => {
          if (!rule.active) return;

          rule.patterns.forEach(pattern => {
            if (!fileMatch(file.textContent || "", pattern)){
              return;
            };

            if (rule.labelUid) {
              const label = lBucket.labels.find((li) => li.uid === rule.labelUid)
              if (label) {
                const spanLists = divElem.querySelectorAll('span')
                let isExists = false
                spanLists.forEach(span => {
                  if (span.dataset.uid === label.uid) {
                    isExists = true
                  }
                })
                if (!isExists) {
                  divElem.appendChild(createLabelElement(label.uid, label.text, label.color, label.backgroundColor));
                }
              }
            }

            if (rule.actions.includes("close_file")) {
              diffFileHeaders[index].classList.remove("open", "Details--on")
            }
          })
        });
      });
    })()
  }, [diffFileCount])

  return <></>
};

const LABEL_DEFAULT_STYLE = {
  elementType: "span",
  color: "#ffffff",
  backgroundColor: "#007bff",
  fontSize: "10px",
  fontWeight: "600",
  padding: "4px 8px 4px 8px",
  borderRadius: "12px",
  margin: "0 0 0 10px",
  verticalAlign: "middle",
};

const createLabelElement = (
  uid: string,
  text: string,
  color: string = LABEL_DEFAULT_STYLE.color,
  backgroundColor: string = LABEL_DEFAULT_STYLE.backgroundColor
) => {
  const elem = document.createElement(LABEL_DEFAULT_STYLE.elementType);
  elem.textContent = text;
  elem.style.backgroundColor = backgroundColor;
  elem.style.color = color;
  elem.style.fontSize = LABEL_DEFAULT_STYLE.fontSize;
  elem.style.fontWeight = LABEL_DEFAULT_STYLE.fontWeight
  elem.style.padding = LABEL_DEFAULT_STYLE.padding
  elem.style.borderRadius= LABEL_DEFAULT_STYLE.borderRadius
  elem.style.margin = LABEL_DEFAULT_STYLE.margin
  elem.style.verticalAlign = LABEL_DEFAULT_STYLE.verticalAlign
  elem.setAttribute('data-uid', uid)

  return elem
}

ReactDOM.createRoot(document.createElement('div')).render(
  <React.StrictMode>
    <Content />
  </React.StrictMode>,
)
