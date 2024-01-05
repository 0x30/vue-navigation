import styles from './index.module.scss'

const disableBodyPointerEvents = () => {
  document.body.classList.add(styles.vueNavigationUnclickable)
}

const enableBodyPointerEvents = () => {
  document.body.classList.remove(styles.vueNavigationUnclickable)
}

export { disableBodyPointerEvents, enableBodyPointerEvents }
