import React, { useRef, useEffect } from "react";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  tag?: "p" | "h1" | "h2" | "h3" | "span" | "div" | "li";
  multiline?: boolean;
  placeholder?: string;
}

const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  className = "",
  tag: Tag = "p",
  multiline = false,
  placeholder = "Clique para editar...",
}) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  }, []);

  const handleBlur = () => {
    if (ref.current) {
      onChange(ref.current.textContent || "");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      ref.current?.blur();
    }
  };

  return (
    <Tag
      ref={ref as any}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`editable-field ${className}`}
      data-placeholder={placeholder}
      style={{ minHeight: "1em" }}
    />
  );
};

export default EditableText;
