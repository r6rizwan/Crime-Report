import React, { useMemo, useRef } from "react";

export default function OtpInput6({ value = "", onChange, disabled = false }) {
  const inputRefs = useRef([]);
  const digits = useMemo(() => {
    const clean = String(value).replace(/\D/g, "").slice(0, 6);
    return Array.from({ length: 6 }, (_, i) => clean[i] || "");
  }, [value]);

  const emit = (nextDigits) => {
    const next = nextDigits.join("").replace(/\D/g, "").slice(0, 6);
    onChange(next);
  };

  const handleChange = (idx, raw) => {
    const onlyDigits = String(raw).replace(/\D/g, "");
    if (!onlyDigits) {
      const nextDigits = [...digits];
      nextDigits[idx] = "";
      emit(nextDigits);
      return;
    }

    const nextDigits = [...digits];
    let cursor = idx;
    for (const ch of onlyDigits) {
      if (cursor > 5) break;
      nextDigits[cursor] = ch;
      cursor += 1;
    }
    emit(nextDigits);
    const nextFocus = Math.min(cursor, 5);
    inputRefs.current[nextFocus]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowRight" && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    onChange(pasted);
    inputRefs.current[Math.min(pasted.length, 6) - 1]?.focus();
  };

  return (
    <div style={styles.row} onPaste={handlePaste}>
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          style={styles.box}
        />
      ))}
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    gap: 10,
    justifyContent: "space-between",
  },
  box: {
    width: 44,
    height: 48,
    borderRadius: 10,
    border: "1px solid rgba(15,23,42,0.15)",
    background: "rgba(250,250,250,0.9)",
    textAlign: "center",
    fontSize: 20,
    fontWeight: 700,
    outline: "none",
  },
};
