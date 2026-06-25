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

type ToastItem = {
  id: string;
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
  duration: number;
};

const AnimatedToastItem = ({
  item,
  index,
  position,
  onRemove,
}: {
  item: ToastItem;
  index: number;
  position: ToastPosition;
  onRemove: (id: string) => void;
}) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const translateY = useSharedValue(position === 'top' ? -50 : position === 'bottom' ? 50 : 0);

  useEffect(() => {
    opacity.value = withTiming(1 - index * 0.15, { duration: 300 });
    scale.value = withSpring(1 - index * 0.05, { damping: 15, stiffness: 200 });
    const dir = position === 'top' ? 1 : position === 'bottom' ? -1 : 1;
    translateY.value = withSpring(dir * index * 12, { damping: 15, stiffness: 200 });
  }, [index, position]);

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (!isMounted) return;
      opacity.value = withTiming(0, { duration: 250 });
      scale.value = withTiming(0.9, { duration: 250 });
      translateY.value = withTiming(
        position === 'top' ? -50 : position === 'bottom' ? 50 : 0,
        { duration: 250 }
      );
      setTimeout(() => {
        if (isMounted) onRemove(item.id);
      }, 300);
    }, item.duration);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value }
      ],
    };
  });

  const getIconColor = () => {
    switch (item?.icon) {
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
    <Animated.View style={[styles.toast, animatedStyle, { position: 'absolute', zIndex: 9999 - index }]}>
      <Ionicons name={item?.icon || 'checkmark-circle'} size={20} color={getIconColor()} style={styles.icon} />
      <Text style={styles.message}>{item.message}</Text>
    </Animated.View>
  );
};

export const ToastMsg = forwardRef<ToastMethods, ToastProps>(({ position = 'top' }, ref) => {
  const insets = useSafeAreaInsets();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = (msg: string, icn: keyof typeof Ionicons.glyphMap, dur: number = 3000) => {
    const newItem: ToastItem = { id: Math.random().toString(), message: msg, icon: icn, duration: dur };
    setToasts((prev) => [newItem, ...prev].slice(0, 4)); // max 4 toasts
  };

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const methods = {
    success: (msg: string, dur?: number) => show(msg, 'checkmark-circle', dur),
    delete: (msg: string, dur?: number) => show(msg, 'trash-outline', dur),
    share: (msg: string, dur?: number) => show(msg, 'share-social', dur),
    error: (msg: string, dur?: number) => show(msg, 'close-circle', dur),
    warning: (msg: string, dur?: number) => show(msg, 'warning-outline', dur),
    info: (msg: string, dur?: number) => show(msg, 'information-circle', dur),
    show: (msg: string, icn: keyof typeof Ionicons.glyphMap, dur?: number) => show(msg, icn, dur),
    hide: () => setToasts([]),
  };

  useImperativeHandle(ref, () => methods);
  useImperativeHandle(toastRef, () => methods);

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

  if (toasts.length === 0) return null;

  return (
    <View style={[styles.container, getPositionStyle()]} pointerEvents="none">
      {toasts.map((toast, index) => (
        <AnimatedToastItem
          key={toast.id}
          item={toast}
          index={index}
          position={position}
          onRemove={removeToast}
        />
      ))}
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
