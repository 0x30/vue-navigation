# @0x30/navigation-core

Core browser navigation logic for managing history state and navigation events.

## Overview

This package provides pure browser-based navigation functionality without any framework dependencies. It handles browser history API, state management, and navigation events.

## Features

- Pure JavaScript/TypeScript - no framework dependencies
- History state management
- Navigation event handling
- Router stack management
- Back/forward navigation logic

## Installation

```shell
pnpm install @0x30/navigation-core
```

## Usage

```typescript
import {
  createPopstateListener,
  routerStack,
  setBackHook,
  pushHistoryState,
  navigateBack,
} from '@0x30/navigation-core'

// Create a popstate listener
const { add, remove } = createPopstateListener(
  false, // isReplace
  async (deltaCount, backHookId) => {
    // Handle back check logic
  },
  (needAnimated, needApplyBackHook, app, backHookId) => {
    // Handle unmount logic
  },
)

// Add the listener
add()

// Navigate back
navigateBack(1)
```

## API

### State Management

- `routerStack` - Array storing navigation stack
- `getCurrentState()` - Get current navigation state
- `setCurrentState(state)` - Set current navigation state
- `setBackHook(id, callback)` - Register a back navigation callback
- `applyBackHook(id)` - Execute a back navigation callback

### Navigation

- `createPopstateListener(isReplace, backCheckCallback, unmountCallback)` - Create a popstate event listener
- `pushHistoryState()` - Push a new state to history
- `navigateBack(delta)` - Navigate back by delta steps
- `startBlackBack()` - Start black box back mode
- `getRouterStackLength()` - Get router stack length
- `addToRouterStack(app)` - Add an app to the router stack

### Utilities

- `randomId()` - Generate a random ID
- `applyFuns(funcs, params)` - Apply multiple functions with parameters

## License

See repository license.
