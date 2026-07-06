# react-native-expo-animated-toast

A beautiful, animated toast message component for React Native and Expo. It uses `react-native-reanimated` for smooth animations and `@expo/vector-icons` for beautiful iconography.

<video src="https://github.com/shahwaleed1/toastMsg-npm-package/raw/main/simple.mp4" width="250" controls></video>

## Features

- 🚀 Smooth animations powered by `react-native-reanimated`
- 🥞 **Stacked Toasts**: Multiple toasts elegantly stack and animate when called simultaneously!
- 📱 Safe area support out of the box via `react-native-safe-area-context`
- 🎨 Pre-defined toast types (success, error, warning, info, delete, share)
- ⚙️ Custom toasts with any Ionicons icon
- 📍 Position customization (top, bottom, center)
- 🧩 Easy to use global API (call `Toast.success` from anywhere)

## Installation

```bash
npm install react-native-expo-animated-toast
```
or
```bash
yarn add react-native-expo-animated-toast
```

### Peer Dependencies

Make sure you have the following peer dependencies installed in your project:
- `react-native-reanimated`
- `react-native-safe-area-context`
- `@expo/vector-icons`

If you are using Expo, you can install them via:
```bash
npx expo install react-native-reanimated react-native-safe-area-context @expo/vector-icons
```
*Note: Ensure you have configured `react-native-reanimated` correctly in your `babel.config.js` or Expo plugins.*

## Usage

### 1. Wrap your app

Add the `ToastMsg` component to the root of your application (usually in `App.tsx` or `_layout.tsx` if using Expo Router).

```tsx
import React from 'react';
import { View, Button } from 'react-native';
import { ToastMsg, Toast } from 'react-native-expo-animated-toast';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      {/* Your App Content */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button 
          title="Show Success Toast" 
          onPress={() => Toast.success('Saved successfully!')} 
        />
      </View>

      {/* Add ToastMsg at the bottom of your root component */}
      <ToastMsg position="top" />
    </View>
  );
}
```

### 2. Trigger Toasts from anywhere

You can import the `Toast` object from anywhere in your app to show toasts without passing props!

```tsx
import { Toast } from 'react-native-expo-animated-toast';

// Predefined toasts
Toast.success('Profile updated!');
Toast.error('Failed to save changes.');
Toast.warning('Your storage is almost full.');
Toast.info('New update available.');
Toast.delete('Item removed from cart.');
Toast.share('Link copied to clipboard!');

// Custom toast with any Ionicons icon
Toast.show('Connected to Wi-Fi', 'wifi', 4000);

// Hide toast manually
Toast.hide();
```

## API Reference

### `<ToastMsg />` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `position` | `'top' \| 'bottom' \| 'center'` | `'top'` | The position of the toast on the screen. |

### `Toast` Methods

All methods take an optional `duration` parameter in milliseconds (defaults to `3000`).

| Method | Parameters | Description |
| :--- | :--- | :--- |
| `Toast.success(message, duration?)` | `message: string`, `duration?: number` | Shows a success toast with a green checkmark icon. |
| `Toast.error(message, duration?)` | `message: string`, `duration?: number` | Shows an error toast with a red close icon. |
| `Toast.warning(message, duration?)` | `message: string`, `duration?: number` | Shows a warning toast with an orange warning icon. |
| `Toast.info(message, duration?)` | `message: string`, `duration?: number` | Shows an info toast with a blue information icon. |
| `Toast.delete(message, duration?)` | `message: string`, `duration?: number` | Shows a destructive toast with a red trash icon. |
| `Toast.share(message, duration?)` | `message: string`, `duration?: number` | Shows a share toast with a blue share icon. |
| `Toast.show(message, icon, duration?)` | `message: string`, `icon: keyof typeof Ionicons.glyphMap`, `duration?: number` | Shows a custom toast with the specified message and [Ionicons](https://icons.expo.fyi/Index) icon. |
| `Toast.hide()` | None | Hides the currently visible toast immediately. |

## License

MIT
