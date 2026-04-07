import styles from './Checkbox.module.css';

export default function Checkbox({ label, checked, onChange }) {
  return (
    <label className={styles.checkboxContainer}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={styles.checkboxInput}
      />
      <span className={styles.checkboxLabel}>{label}</span>
    </label>
  );
}