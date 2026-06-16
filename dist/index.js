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
    show: (message, icon, duration) => { var _a; return (_a = exports.toastRef.current) === null || _a === void 0 ? void 0 : _a.show(message, icon, duration); },
    hide: () => { var _a; return (_a = exports.toastRef.current) === null || _a === void 0 ? void 0 : _a.hide(); },
};
exports.ToastMsg = (0, react_1.forwardRef)(({ position = 'top' }, ref) => {
    const insets = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    const [visible, setVisible] = (0, react_1.useState)(false);
    const [message, setMessage] = (0, react_1.useState)('');
    const [icon, setIcon] = (0, react_1.useState)('checkmark-circle');
    const [duration, setDuration] = (0, react_1.useState)(3000);
    const opacity = (0, react_native_reanimated_1.useSharedValue)(0);
    const translateY = (0, react_native_reanimated_1.useSharedValue)(position === 'top' ? -50 : position === 'bottom' ? 50 : 0);
    const scale = (0, react_native_reanimated_1.useSharedValue)(0.9);
    const show = (msg, icn, dur = 3000) => {
        setMessage(msg);
        setIcon(icn);
        setDuration(dur);
        setVisible(true);
    };
    (0, react_1.useImperativeHandle)(ref, () => ({
        success: (msg, dur) => show(msg, 'checkmark-circle', dur),
        delete: (msg, dur) => show(msg, 'trash-outline', dur),
        share: (msg, dur) => show(msg, 'share-social', dur),
        show: (msg, icn, dur) => show(msg, icn, dur),
        hide: () => setVisible(false),
    }));
    // Also bind to the global ref so we can call Toast.success() from anywhere
    (0, react_1.useImperativeHandle)(exports.toastRef, () => ({
        success: (msg, dur) => show(msg, 'checkmark-circle', dur),
        delete: (msg, dur) => show(msg, 'trash-outline', dur),
        share: (msg, dur) => show(msg, 'share-social', dur),
        show: (msg, icn, dur) => show(msg, icn, dur),
        hide: () => setVisible(false),
    }));
    (0, react_1.useEffect)(() => {
        if (visible) {
            // Animate In
            opacity.value = (0, react_native_reanimated_1.withTiming)(1, { duration: 300 });
            scale.value = (0, react_native_reanimated_1.withSpring)(1, { damping: 15, stiffness: 200 });
            translateY.value = (0, react_native_reanimated_1.withSpring)(0, { damping: 15, stiffness: 200 });
            // Auto Hide
            const timer = setTimeout(() => {
                setVisible(false);
            }, duration);
            return () => clearTimeout(timer);
        }
        else {
            // Animate Out
            opacity.value = (0, react_native_reanimated_1.withTiming)(0, { duration: 250 });
            scale.value = (0, react_native_reanimated_1.withTiming)(0.9, { duration: 250 });
            translateY.value = (0, react_native_reanimated_1.withTiming)(position === 'top' ? -50 : position === 'bottom' ? 50 : 0, { duration: 250 });
        }
    }, [visible, duration, position]);
    const animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        return {
            opacity: opacity.value,
            transform: [
                { translateY: translateY.value },
                { scale: scale.value }
            ],
        };
    });
    if (!visible && opacity.value === 0)
        return null;
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
                return '#FF3B30';
            case 'checkmark-circle':
                return '#34C759';
            case 'share-social':
                return '#007AFF';
            default:
                return '#fff';
        }
    };
    return (react_1.default.createElement(react_native_1.View, { style: [styles.container, getPositionStyle()], pointerEvents: "none" },
        react_1.default.createElement(react_native_reanimated_1.default.View, { style: [styles.toast, animatedStyle] },
            react_1.default.createElement(vector_icons_1.Ionicons, { name: icon, size: 20, color: getIconColor(), style: styles.icon }),
            react_1.default.createElement(react_native_1.Text, { style: styles.message }, message))));
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
