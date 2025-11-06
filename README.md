# Vue Navigation

Vue 3 navigation library with animation support and iOS-style page management.

## Packages

| name                                              | version                                                                                                                      | description                                     |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| [@0x30/navigation-core](packages/navigation-core) | [![](https://img.shields.io/npm/v/@0x30/navigation-core)](https://www.npmjs.com/package/@0x30/navigation-core)               | Core browser navigation logic (framework-free)  |
| [@0x30/navigation-vue](packages/navigation-vue)   | [![](https://img.shields.io/npm/v/@0x30/navigation-vue)](https://www.npmjs.com/package/@0x30/navigation-vue)                 | Vue 3 navigation integration                    |
| [@0x30/vue-navigation](packages/core)             | [![](https://img.shields.io/npm/v/@0x30/vue-navigation)](https://www.npmjs.com/package/@0x30/vue-navigation)                 | Unified package (backward compatibility)        |
| [@0x30/vue-navigation-layout](packages/layout)    | [![](https://img.shields.io/npm/v/@0x30/vue-navigation-layout)](https://www.npmjs.com/package/@0x30/vue-navigation-layout)   | Layout components for vue-navigation            |

## Architecture

The project is now split into two core libraries:

### @0x30/navigation-core
Pure browser navigation logic without any framework dependencies. Handles:
- Browser history API management
- Navigation state management
- Router stack management
- Back/forward navigation logic

### @0x30/navigation-vue
Vue 3 specific integration built on top of navigation-core. Provides:
- Vue component lifecycle management
- Page transition animations
- Vue-specific hooks and utilities
- Component-based navigation

### @0x30/vue-navigation
A unified package that re-exports both navigation-core and navigation-vue for backward compatibility. Existing users can continue using this package without any changes.

## Installation

For Vue 3 applications:
```shell
pnpm install @0x30/vue-navigation
# or use the Vue-specific package
pnpm install @0x30/navigation-vue
```

For framework-agnostic usage:
```shell
pnpm install @0x30/navigation-core
```

## Usage

See individual package READMEs for detailed usage:
- [navigation-core README](packages/navigation-core/README.md)
- [navigation-vue README](packages/navigation-vue/README.md)
- [vue-navigation README](packages/core/readme.md)
- [vue-navigation-layout README](packages/layout/readme.md)

## License

See individual package licenses.

