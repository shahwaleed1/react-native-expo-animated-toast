import React from 'react';
import { Ionicons } from '@expo/vector-icons';
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
export declare const toastRef: React.RefObject<ToastMethods>;
export declare const Toast: {
    success: (message: string, duration?: number) => void | undefined;
    delete: (message: string, duration?: number) => void | undefined;
    share: (message: string, duration?: number) => void | undefined;
    error: (message: string, duration?: number) => void | undefined;
    warning: (message: string, duration?: number) => void | undefined;
    info: (message: string, duration?: number) => void | undefined;
    show: (message: string, icon: keyof typeof Ionicons.glyphMap, duration?: number) => void | undefined;
    hide: () => void | undefined;
};
export interface ToastProps {
    /** Default position of the toast (default: 'top') */
    position?: ToastPosition;
}
export declare const ToastMsg: React.ForwardRefExoticComponent<ToastProps & React.RefAttributes<ToastMethods>>;
