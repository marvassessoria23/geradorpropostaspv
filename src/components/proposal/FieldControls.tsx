import React from "react";

interface FieldControlsProps {
  onToggleVisible?: () => void;
  isVisible?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

const btn: React.CSSProperties = {
  background: "none",
  border: "1px solid #555",
  borderRadius: 4,
  padding: "2px 6px",
  cursor: "pointer",
  fontSize: 11,
  lineHeight: 1,
};

const FieldControls: React.FC<FieldControlsProps> = ({
  onToggleVisible,
  isVisible = true,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  canMoveUp = true,
  canMoveDown = true,
}) => (
  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
    {onToggleVisible && (
      <button
        onClick={onToggleVisible}
        title={isVisible ? "Ocultar" : "Mostrar"}
        style={{ ...btn, borderColor: "#c9a84c", color: isVisible ? "#c9a84c" : "#666" }}
      >
        {isVisible ? "👁" : "🙈"}
      </button>
    )}
    {onMoveUp && (
      <button
        onClick={onMoveUp}
        disabled={!canMoveUp}
        style={{ ...btn, color: canMoveUp ? "#fff" : "#444", cursor: canMoveUp ? "pointer" : "default" }}
      >
        ↑
      </button>
    )}
    {onMoveDown && (
      <button
        onClick={onMoveDown}
        disabled={!canMoveDown}
        style={{ ...btn, color: canMoveDown ? "#fff" : "#444", cursor: canMoveDown ? "pointer" : "default" }}
      >
        ↓
      </button>
    )}
    {onDuplicate && (
      <button onClick={onDuplicate} style={{ ...btn, color: "#fff" }}>
        ⧉
      </button>
    )}
    {onDelete && (
      <button
        onClick={onDelete}
        style={{ ...btn, borderColor: "#c0392b", color: "#c0392b" }}
      >
        🗑
      </button>
    )}
  </div>
);

export default FieldControls;
