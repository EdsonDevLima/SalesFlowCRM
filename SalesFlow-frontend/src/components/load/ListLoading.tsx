import styles from "./ListLoading.module.css";

interface ListLoadingProps {
  text?: string;
  className?: string;
}

export function ListLoading({
  text = "Carregando...",
  className,
}: ListLoadingProps) {
  return (
    <div className={`${styles.container} ${className || ""}`.trim()}>
      <span className={styles.spinner} aria-hidden="true"></span>
      <p className={styles.text}>{text}</p>
    </div>
  );
}
