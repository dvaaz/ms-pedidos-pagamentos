import styles from './Logo.module.css'

// Logo do ShirtStore: quadrado roxo arredondado com a letra "S" branca.
export default function Logo({ size = 'md', className = '' }) {
  return (
    <div className={`${styles.logo} ${styles[size]} ${className}`.trim()}>
      S
    </div>
  )
}
