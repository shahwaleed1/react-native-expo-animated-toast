import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export type ToastPosition = 'top' | 'bottom' | 'center';

export interface ToastMethods {
  success: (message: string, duration?: number) => void;
  delete: (message: string, duration?: number) => void;
  share: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  show: (message: string, icon: keyof typeof Ionicons.glyphMap, duration?: number) => void;
  hide: () => void;
}

export const toastRef = React.createRef<ToastMethods>();

export const Toast = {
  success: (message: string, duration?: number) => toastRef.current?.success(message, duration),
  delete: (message: string, duration?: number) => toastRef.current?.delete(message, duration),
  share: (message: string, duration?: number) => toastRef.current?.share(message, duration),
  error: (message: string, duration?: number) => toastRef.current?.error(message, duration),
  warning: (message: string, duration?: number) => toastRef.current?.warning(message, duration),
  info: (message: string, duration?: number) => toastRef.current?.info(message, duration),
  show: (message: string, icon: keyof typeof Ionicons.glyphMap, duration?: number) => toastRef.current?.show(message, icon, duration),
  hide: () => toastRef.current?.hide(),
};

export interface ToastProps {
  /** Default position of the toast (default: 'top') */
  position?: ToastPosition;
}

export const ToastMsg = forwardRef<ToastMethods, ToastProps>(({ position = 'top' }, ref) => {
  const insets = useSafeAreaInsets();

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [icon, setIcon] = useState<keyof typeof Ionicons.glyphMap>('checkmark-circle');
  const [duration, setDuration] = useState(3000);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(position === 'top' ? -50 : position === 'bottom' ? 50 : 0);
  const scale = useSharedValue(0.9);

  const show = (msg: string, icn: keyof typeof Ionicons.glyphMap, dur: number = 3000) => {
    setMessage(msg);
    setIcon(icn);
    setDuration(dur);
    setVisible(true);
  };

  useImperativeHandle(ref, () => ({
    success: (msg, dur) => show(msg, 'checkmark-circle', dur),
    delete: (msg, dur) => show(msg, 'trash-outline', dur),
    share: (msg, dur) => show(msg, 'share-social', dur),
    error: (msg, dur) => show(msg, 'close-circle', dur),
    warning: (msg, dur) => show(msg, 'warning-outline', dur),
    info: (msg, dur) => show(msg, 'information-circle', dur),
    show: (msg, icn, dur) => show(msg, icn, dur),
    hide: () => setVisible(false),
  }));

  // Also bind to the global ref so we can call Toast.success() from anywhere
  useImperativeHandle(toastRef, () => ({
    success: (msg, dur) => show(msg, 'checkmark-circle', dur),
    delete: (msg, dur) => show(msg, 'trash-outline', dur),
    share: (msg, dur) => show(msg, 'share-social', dur),
    error: (msg, dur) => show(msg, 'close-circle', dur),
    warning: (msg, dur) => show(msg, 'warning-outline', dur),
    info: (msg, dur) => show(msg, 'information-circle', dur),
    show: (msg, icn, dur) => show(msg, icn, dur),
    hide: () => setVisible(false),
  }));

  useEffect(() => {
    if (visible) {
      // Animate In
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 200 });

      // Auto Hide
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      // Animate Out
      opacity.value = withTiming(0, { duration: 250 });
      scale.value = withTiming(0.9, { duration: 250 });
      translateY.value = withTiming(
        position === 'top' ? -50 : position === 'bottom' ? 50 : 0,
        { duration: 250 }
      );
    }
  }, [visible, duration, position]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value }
      ],
    };
  });

  if (!visible && opacity.value === 0) return null;

  const getPositionStyle = () => {
    switch (position) {
      case 'top':
        return { top: Math.max(insets.top, 20) + 10 };
      case 'center':
        return { top: height / 2 - 25 };
      case 'bottom':
      default:
        return { bottom: Math.max(insets.bottom, 20) + 20 };
    }
  };

  const getIconColor = () => {
    switch (icon) {
      case 'trash-outline':
      case 'close-circle':
        return '#FF3B30';
      case 'checkmark-circle':
        return '#34C759';
      case 'share-social':
        return '#007AFF';
      case 'warning-outline':
        return '#FF9F0A';
      case 'information-circle':
        return '#007AFF';
      default:
        return '#fff';
    }
  };

  return (
    <View style={[styles.container, getPositionStyle()]} pointerEvents="none">
      <Animated.View style={[styles.toast, animatedStyle]}>
        <Ionicons name={icon} size={20} color={getIconColor()} style={styles.icon} />
        <Text style={styles.message}>{message}</Text>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 24,
    maxWidth: width * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  icon: {
    marginRight: 8,
  },
  message: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
});
