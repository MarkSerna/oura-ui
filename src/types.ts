export interface OuraOptions {
    title?: string;
    text?: string;
    html?: string | HTMLElement;
    icon?: 'success' | 'error' | 'warning' | 'info' | 'progress';
    confirmButtonText?: string;
    cancelButtonText?: string;
    showDenyButton?: boolean;
    denyButtonText?: string;
    preConfirm?: (inputValue?: string) => Promise<any> | any;
    allowOutsideClick?: boolean;
    timer?: number;
    type?: 'toast' | 'progress';
    
    // Prompt specific
    input?: 'text' | 'password' | 'email' | 'number';
    inputPlaceholder?: string;
    inputValue?: string;
    
    // Drawer/Layout specific
    side?: 'left' | 'right' | 'top' | 'bottom';
    width?: string;
}

export interface OuraConfig {
    theme?: 'light-glass' | 'dark-glass' | 'system';
    accent?: string;
    locale?: string;
    position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
    customI18n?: Record<string, { confirm?: string, cancel?: string, submit?: string, continue?: string, deny?: string }>;
}

export interface OuraResult {
    isConfirmed: boolean;
    isDismissed: boolean;
    isDenied: boolean;
    value?: string;
}

export interface ButtonConfig {
    text: string;
    value: OuraResult;
    className?: string;
}
