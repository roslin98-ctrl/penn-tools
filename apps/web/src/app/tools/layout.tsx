import Link from "next/link";
import styles from "./layout.module.css";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <header className={styles.topBar}>
        <Link href="/" className={styles.back}>← AskPenn</Link>
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
