type LabelProps = {
  className?: string;
  text: string;
  backgroundColor?: string;
  color?: string;
}

export const LabelDefaultStyle = {
  elementType: "span",
  color: "#ffffff",
  backgroundColor: "#007bff",
  fontSize: "10px",
  fontWeight: "600",
  padding: "4px 8px 4px 8px",
  borderRadius: "12px",
  verticalAlign: "middle",
};

export default function LabelPreview({
  className = "",
  text,
  backgroundColor = LabelDefaultStyle.backgroundColor,
  color = LabelDefaultStyle.color
}: LabelProps) {
  return (
    <div>
      <span className={className} style={{...LabelDefaultStyle, backgroundColor, color}}>
        {text}
      </span>
    </div>
  )
}
