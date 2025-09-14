import { useState, useEffect } from 'react';

interface ToastProps {
    id: string;
    title?: string;
    description?: string;
    action?: React.ReactNode;
    duration?: number;
    dismiss: () => void;
    update: (props: ToastProps) => void;
}

interface ToastState {
    toasts: ToastProps[];
}

const TOAST_LIMIT = 1;

let count = 0;
function generateId(): string {
    count = (count + 1) % Number.MAX_VALUE;
    return count.toString();
}

interface ToastStore {
    state: ToastState;
    listeners: ((state: ToastState) => void)[];
    getState: () => ToastState;
    setState: (
        nextState: ((prevState: ToastState) => ToastState) | ToastState
    ) => void;
    subscribe: (listener: (state: ToastState) => void) => () => void;
}

const toastStore: ToastStore = {
    state: {
        toasts: [],
    },
    listeners: [],

    getState: () => toastStore.state,

    setState: (nextState) => {
        if (typeof nextState === 'function') {
            toastStore.state = nextState(toastStore.state);
        } else {
            toastStore.state = { ...toastStore.state, ...nextState };
        }

        toastStore.listeners.forEach((listener) => listener(toastStore.state));
    },

    subscribe: (listener) => {
        toastStore.listeners.push(listener);
        return () => {
            toastStore.listeners = toastStore.listeners.filter(
                (l) => l !== listener
            );
        };
    },
};

export const toast = ({
    ...props
}: Omit<ToastProps, 'id' | 'dismiss' | 'update'>) => {
    const id = generateId();

    const update = (props: ToastProps) =>
        toastStore.setState((state) => ({
            ...state,
            toasts: state.toasts.map((t) =>
                t.id === id ? { ...t, ...props } : t
            ),
        }));

    const dismiss = () =>
        toastStore.setState((state) => ({
            ...state,
            toasts: state.toasts.filter((t) => t.id !== id),
        }));

    toastStore.setState((state) => ({
        ...state,
        toasts: [
            { ...props, id, dismiss, update } as ToastProps,
            ...state.toasts,
        ].slice(0, TOAST_LIMIT),
    }));

    return {
        id,
        dismiss,
        update,
    };
};

export function useToast() {
    const [state, setState] = useState<ToastState>(toastStore.getState());

    useEffect(() => {
        const unsubscribe = toastStore.subscribe((state) => {
            setState(state);
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        const timeouts: NodeJS.Timeout[] = [];

        state.toasts.forEach((toast) => {
            if (toast.duration === Infinity) {
                return;
            }

            const timeout = setTimeout(() => {
                toast.dismiss();
            }, toast.duration || 5000);

            timeouts.push(timeout);
        });

        return () => {
            timeouts.forEach((timeout) => clearTimeout(timeout));
        };
    }, [state.toasts]);

    return {
        toast,
        toasts: state.toasts,
    };
}
