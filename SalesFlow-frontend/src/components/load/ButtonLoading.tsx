import type { PropsButtonLoading } from "../../types/users";
import styles from "./ButtonLoading.module.css";

export function ButtonLoading({ loading, text, className }: PropsButtonLoading) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`${styles.button} ${className || ""}`.trim()}
    >
      {loading ? <span className={styles.spinner}></span> : text}
    </button>
  );
}
