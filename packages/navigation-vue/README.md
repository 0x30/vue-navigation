# @0x30/navigation-vue

Vue 3 integration for navigation functionality with animation support.

## Overview

This package provides Vue 3 specific navigation components and utilities, built on top of `@0x30/navigation-core`. It includes component lifecycle management, transition animations, and Vue-specific hooks.

## Features

- Vue 3 component navigation
- Page transition animations
- Lifecycle hooks (onWillAppear, onDidAppear, etc.)
- Leave before guards
- Progressive exit animations
- Full TypeScript support

## Installation

```shell
pnpm install @0x30/navigation-vue
```

This package has peer dependencies on `vue` (^3.3.0) and automatically installs `@0x30/navigation-core`.

## Usage

### Initialization

**Component way:**

```jsx
import { Navigator } from '@0x30/navigation-vue'

createApp(
  <Navigator>
    <Home />
  </Navigator>
).mount('#app')
```

**Plugin way:**

```jsx
import { navigation } from '@0x30/navigation-vue'

createApp(<Home />)
  .use(navigation)
  .mount('#app')
```

### Navigation Methods

```jsx
import { push, replace, to, back, goBack, backToHome, blackBoxBack } from '@0x30/navigation-vue'

// Push a new page
push(<div />)

// Replace current page
replace(<div />)

// Helper for replace/push
to(true)(<div />) // replace
to(false)(<div />) // push

// Go back
back() // Go back one step
goBack(2) // Go back 2 steps
backToHome() // Go back to root

// Black box back - removes intermediate pages
// a -> b -> c -> d
// blackBoxBack(2)
// Result: a -> d
blackBoxBack(2)
```

### Hooks

```jsx
import {
  onWillAppear,
  onDidAppear,
  onWillDisappear,
  onDidDisappear,
  useTransitionEnter,
  useTransitionLeave,
  useLeaveBefore,
  useQuietPage,
} from '@0x30/navigation-vue'

// Page lifecycle
onWillAppear((isFirst) => {
  console.log('Page will appear', isFirst)
})

onDidAppear((isFirst) => {
  console.log('Page appeared', isFirst)
})

onWillDisappear(() => {
  console.log('Page will disappear')
})

onDidDisappear(() => {
  console.log('Page disappeared')
})

// Leave guard
useLeaveBefore(() => {
  return window.confirm('Are you sure you want to leave?')
})

// Quiet page - doesn't trigger lifecycle hooks on other pages
useQuietPage()

// Custom animations
useTransitionEnter(async (from, to) => {
  // Custom enter animation
})

useTransitionLeave(async (from, to) => {
  // Custom leave animation
})
```

## API

### Navigation Functions

- `push(component, hooks?)` - Push a new page
- `replace(component, hooks?)` - Replace current page
- `to(isReplace)` - Helper function for push/replace
- `back()` - Go back one step
- `goBack(delta)` - Go back by delta steps
- `backToHome()` - Go back to root
- `blackBoxBack(delta)` - Remove intermediate pages

### Lifecycle Hooks

- `onWillAppear(callback)` - Before page appears (before animation)
- `onDidAppear(callback)` - After page appears (after animation)
- `onWillDisappear(callback)` - Before page disappears (before animation)
- `onDidDisappear(callback)` - After page disappears (after animation)
- `onPageBeforeEnter(callback)` - Before transition enter
- `onPageAfterEnter(callback)` - After transition enter
- `onPageBeforeLeave(callback)` - Before transition leave
- `onPageAfterLeave(callback)` - After transition leave

### Guards & Configuration

- `useLeaveBefore(hook)` - Intercept back navigation
- `useQuietPage()` - Mark page as quiet (doesn't trigger lifecycle on others)
- `usePageMate(meta)` - Set page metadata
- `getCurrentPageMate()` - Get current page metadata
- `onPageChange(callback)` - Listen to page changes

### Animation Hooks

- `useTransitionEnter(animator)` - Custom enter animation
- `useTransitionLeave(animator)` - Custom leave animation
- `useProgressExitAnimated(config)` - Progressive exit animation
- `useAppBeforeMount(callback)` - Before app mount

### Components

- `Navigator` - Navigation controller component

### Utilities

- `disableBodyPointerEvents()` - Disable pointer events during transitions
- `enableBodyPointerEvents()` - Enable pointer events

## Notes

- This library is not a router, it's a component management approach
- All pages remain active (similar to iOS navigation design)
- No route table or nested routing
- Assumes all page components are `fixed` and full screen
- Best suited for hybrid app development with embedded H5 apps

## License

See repository license.
