import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Logo from '../Logo'
import { HomeIcon, BoxIcon, StarIcon, CartIcon, UserIcon, LogoutIcon, HelpIcon } from '../icons'
import styles from './Navbar.module.css'

// Navbar das telas autenticadas (ver perfil-adm.png).
// O link "Admin" só aparece para role === 'admin'.
export default function Navbar({ userName }) {
  const { role, logout } = useAuth()
  const isAdmin = role === 'admin'

  const navLinkClass = ({ isActive }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`.trim()

  return (
    <header className={styles.header}>
      {/* Faixa superior: logo + título + ajuda */}
      <div className={styles.topBar}>
        <Link to="/perfil" className={styles.logoLink}>
          <Logo size="sm" />
        </Link>
        <h1 className={styles.title}>E-commerce ShirtStore</h1>
        <button type="button" className={styles.iconButton} aria-label="Ajuda">
          <HelpIcon />
        </button>
      </div>

      {/* Faixa de navegação: links + usuário/logout */}
      <nav className={styles.nav}>
        <div className={styles.navCenter}>
          <a href="#" className={styles.navLink}>
            <HomeIcon /> Catálogo
          </a>
          {/* "Meus Pedidos" não aparece para cliente — acesso só pelo card no perfil. */}
          {isAdmin && (
            <a href="#" className={styles.navLink}>
              <BoxIcon /> Meus Pedidos
            </a>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              <StarIcon /> Admin
            </NavLink>
          )}
        </div>

        <div className={styles.navRight}>
          <button type="button" className={styles.cartButton} aria-label="Carrinho">
            <CartIcon />
          </button>
          <span className={styles.user}>
            <UserIcon />
            {userName}
          </span>
          <button
            type="button"
            onClick={logout}
            className={styles.logoutButton}
            aria-label="Sair"
          >
            <LogoutIcon />
          </button>
        </div>
      </nav>
    </header>
  )
}
