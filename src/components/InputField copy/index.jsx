import styles from './InputField.module.css'

// Campo de formulário com label, ícone à esquerda e ação opcional à direita
// (ex.: botão mostrar/ocultar senha). Reutilizável nas telas de auth.
export default function InputField({ label, icon, trailing, id, className = '', ...inputProps }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.wrap}>
        {icon && <span className={styles.icon}>{icon}</span>}

        <input
          id={id}
          className={`${styles.input} ${icon ? styles.hasIcon : ''} ${trailing ? styles.hasTrailing : ''}`.trim()}
          {...inputProps}
        />

        {trailing && <span className={styles.trailing}>{trailing}</span>}
      </div>
    </div>
  )
}
