"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToastMsg = exports.Toast = exports.toastRef = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const vector_icons_1 = require("@expo/vector-icons");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const { width, height } = react_native_1.Dimensions.get('window');
exports.toastRef = react_1.default.createRef();
exports.Toast = {
    success: (message, duration) => { var _a; return (_a = exports.toastRef.current) === null || _a === void 0 ? void 0 : _a.success(message, duration); },
    delete: (message, duration) => { var _a; return (_a = exports.toastRef.current) === null || _a === void 0 ? void 0 : _a.delete(message, duration); },
    share: (message, duration) => { var _a; return (_a = exports.toastRef.current) === null || _a === void 0 ? void 0 : _a.share(message, duration); },
    error: (message, duration) => { var _a; return (_a = exports.toastRef.current) === null || _a === void 0 ? void 0 : _a.error(message, duration); },
    warning: (message, duration) => { var _a; return (_a = exports.toastRef.current) === null || _a === void 0 ? void 0 : _a.warning(message, duration); },
    info: (message, duration) => { var _a; return (_a = exports.toastRef.current) === null || _a === void 0 ? void 0 : _a.info(message, duration); },
    show: (message, icon, duration) => { var _a; return (_a = exports.toastRef.current) === null || _a === void 0 ? void 0 : _a.show(message, icon, duration); },
    hide: () => { var _a; return (_a = exports.toastRef.current) === null || _a === void 0 ? void 0 : _a.hide(); },
};
const AnimatedToastItem = ({ item, index, position, onRemove, }) => {
    const opacity = (0, react_native_reanimated_1.useSharedValue)(0);
    const scale = (0, react_native_reanimated_1.useSharedValue)(0.9);
    const translateY = (0, react_native_reanimated_1.useSharedValue)(position === 'top' ? -50 : position === 'bottom' ? 50 : 0);
    (0, react_1.useEffect)(() => {
        opacity.value = (0, react_native_reanimated_1.withTiming)(1 - index * 0.15, { duration: 300 });
        scale.value = (0, react_native_reanimated_1.withSpring)(1 - index * 0.05, { damping: 15, stiffness: 200 });
        const dir = position === 'top' ? 1 : position === 'bottom' ? -1 : 1;
        translateY.value = (0, react_native_reanimated_1.withSpring)(dir * index * 12, { damping: 15, stiffness: 200 });
    }, [index, position]);
    (0, react_1.useEffect)(() => {
        let isMounted = true;
        const timer = setTimeout(() => {
            if (!isMounted)
                return;
            opacity.value = (0, react_native_reanimated_1.withTiming)(0, { duration: 250 });
            scale.value = (0, react_native_reanimated_1.withTiming)(0.9, { duration: 250 });
            translateY.value = (0, react_native_reanimated_1.withTiming)(position === 'top' ? -50 : position === 'bottom' ? 50 : 0, { duration: 250 });
            setTimeout(() => {
                if (isMounted)
                    onRemove(item.id);
            }, 300);
        }, item.duration);
        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, []);
    const animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        return {
            opacity: opacity.value,
            transform: [
                { translateY: translateY.value },
                { scale: scale.value }
            ],
        };
    });
    const getIconColor = () => {
        switch (item === null || item === void 0 ? void 0 : item.icon) {
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
    return (react_1.default.createElement(react_native_reanimated_1.default.View, { style: [styles.toast, animatedStyle, { position: 'absolute', zIndex: 9999 - index }] },
        react_1.default.createElement(vector_icons_1.Ionicons, { name: (item === null || item === void 0 ? void 0 : item.icon) || 'checkmark-circle', size: 20, color: getIconColor(), style: styles.icon }),
        react_1.default.createElement(react_native_1.Text, { style: styles.message }, item.message)));
};
exports.ToastMsg = (0, react_1.forwardRef)(({ position = 'top' }, ref) => {
    const insets = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    const [toasts, setToasts] = (0, react_1.useState)([]);
    const show = (msg, icn, dur = 3000) => {
        const newItem = { id: Math.random().toString(), message: msg, icon: icn, duration: dur };
        setToasts((prev) => [newItem, ...prev].slice(0, 4)); // max 4 toasts
    };
    const removeToast = react_1.default.useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);
    const methods = {
        success: (msg, dur) => show(msg, 'checkmark-circle', dur),
        delete: (msg, dur) => show(msg, 'trash-outline', dur),
        share: (msg, dur) => show(msg, 'share-social', dur),
        error: (msg, dur) => show(msg, 'close-circle', dur),
        warning: (msg, dur) => show(msg, 'warning-outline', dur),
        info: (msg, dur) => show(msg, 'information-circle', dur),
        show: (msg, icn, dur) => show(msg, icn, dur),
        hide: () => setToasts([]),
    };
    (0, react_1.useImperativeHandle)(ref, () => methods);
    (0, react_1.useImperativeHandle)(exports.toastRef, () => methods);
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
    if (toasts.length === 0)
        return null;
    return (react_1.default.createElement(react_native_1.View, { style: [styles.container, getPositionStyle()], pointerEvents: "none" }, toasts.map((toast, index) => (react_1.default.createElement(AnimatedToastItem, { key: toast.id, item: toast, index: index, position: position, onRemove: removeToast })))));
});
const styles = react_native_1.StyleSheet.create({
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
        fontFamily: react_native_1.Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    },
});
