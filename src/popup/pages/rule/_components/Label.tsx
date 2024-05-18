import { useContext } from "react";

import LabelPreview from "@/components/label-preview";
import { StorageContext } from "@/providers/provider";

type LabelProps = {
  labelUid: string;
}

export default function Label({ labelUid }: LabelProps) {
  const { labels } = useContext(StorageContext);
  const label = labels.find(label => label.uid === labelUid)
  if (!label) return null;

  return (
    <LabelPreview
      text={label.text}
      backgroundColor={label.backgroundColor}
      color={label.color}
    />
  )
}
