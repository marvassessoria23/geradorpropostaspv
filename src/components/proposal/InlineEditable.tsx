import React, { useRef, useState, useEffect } from "react";

interface InlineEditableProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
  tag?: keyof JSX.IntrinsicElements;
}

const InlineEditable: React.FC<InlineEditableProps> = ({
  value,
  onChange,
  className,
  style,
  multiline = false,
  tag: Tag = "span" as any,
}) => {
  const ref = useRef<HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing && ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value || "";
    }
  }, [value, isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (ref.current) onChange(ref.current.innerText);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      ref.current?.blur();
    }
  };

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onFocus={() => setIsEditing(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={className}
      style={{
        ...style,
        outline: isEditing ? "2px solid #c9a84c" : undefined,
        borderRadius: 3,
        cursor: "text",
      }}
    />
  );
};

export default InlineEditable;
