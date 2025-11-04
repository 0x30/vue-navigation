const getDisableAllPointerEventsElement = () => {
  const element = document.querySelector('#___disable_all_pointerevents')
  return element as HTMLDivElement | null
}

const disableBodyPointerEvents = () => {
  const element = getDisableAllPointerEventsElement()
  element && (element.style.display = 'block')
}

const enableBodyPointerEvents = () => {
  const element = getDisableAllPointerEventsElement()
  element && (element.style.display = 'none')
}

const initDisableAllPointerEvents = () => {
  const div = document.createElement('div')

  div.id = '___disable_all_pointerevents'

  div.style.position = 'fixed'
  div.style.top = '0'
  div.style.right = '0'
  div.style.bottom = '0'
  div.style.left = '0'
  div.style.opacity = '0'
  div.style.display = 'none'
  div.style.zIndex = '99999999'

  document.body.appendChild(div)
}

export {
  initDisableAllPointerEvents,
  disableBodyPointerEvents,
  enableBodyPointerEvents,
}
