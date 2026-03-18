import { OuraOptions, OuraConfig, OuraResult, ButtonConfig } from './types';
import { ICONS, MAIN_ICONS } from './icons';
import { injectStyles } from './styles';

interface ModalInstance {
    overlay: HTMLDivElement;
    modal: HTMLDivElement;
    close: (result: OuraResult) => void;
}

class OuraNotification {
    private static instance: OuraNotification;
    private activeModals: ModalInstance[] = [];
    private originalOverflow: string = '';
    private originalPaddingRight: string = '';

    private locale: string = 'en';
    private i18n: Record<string, { confirm?: string, cancel?: string, submit?: string, continue?: string, deny?: string }> = {
        en: { confirm: 'Confirm', cancel: 'Cancel', submit: 'Submit', continue: 'Continue', deny: 'Deny' },
        es: { confirm: 'Confirmar', cancel: 'Cancelar', submit: 'Enviar', continue: 'Continuar', deny: 'Denegar' },
        fr: { confirm: 'Confirmer', cancel: 'Annuler', submit: 'Soumettre', continue: 'Continuer', deny: 'Refuser' },
        de: { confirm: 'Bestätigen', cancel: 'Abbrechen', submit: 'Einreichen', continue: 'Weiter', deny: 'Ablehnen' },
        it: { confirm: 'Conferma', cancel: 'Annulla', submit: 'Invia', continue: 'Continua', deny: 'Rifiuta' },
        pt: { confirm: 'Confirmar', cancel: 'Cancelar', submit: 'Enviar', continue: 'Continuar', deny: 'Recusar' },
        zh: { confirm: '确认', cancel: '取消', submit: '提交', continue: '继续', deny: '拒绝' },
        ja: { confirm: '確認', cancel: 'キャンセル', submit: '送信', continue: '続行', deny: '拒否' },
        ru: { confirm: 'Подтвердить', cancel: 'Отмена', submit: 'Отправить', continue: 'Продолжить', deny: 'Отказать' },
        ar: { confirm: 'تأكيد', cancel: 'إلغاء', submit: 'إرسال', continue: 'متابعة', deny: 'رفض' }
    };

    private getI18n(key: 'confirm' | 'cancel' | 'submit' | 'continue' | 'deny'): string {
        const lang = this.i18n[this.locale] || this.i18n['en'];
        return lang[key] || this.i18n['en'][key] || 'Process';
    }

    constructor() {
        if (OuraNotification.instance) return OuraNotification.instance;
        OuraNotification.instance = this;
        this.handleEsc = this.handleEsc.bind(this);

        if (typeof document !== 'undefined') {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => injectStyles());
            } else {
                injectStyles();
            }
        }
    }

    public configure(options: OuraConfig = {}): void {
        if (typeof document === 'undefined') return;
        
        if (options.locale) this.locale = options.locale;
        if (options.customI18n) {
            this.i18n = { ...this.i18n, ...options.customI18n };
        }
        
        if (options.accent) {
            document.documentElement.style.setProperty('--oura-accent', options.accent);
        }

        if (options.position) {
            const container = document.getElementById('oura-toast-container');
            if (container) {
                // Remove existing positioning classes
                container.className = 'oura-toast-container';
                container.classList.add(`oura-pos-${options.position}`);
            }
        }

        const applyTheme = (theme: 'light-glass' | 'dark-glass') => {
            if (theme === 'dark-glass') document.documentElement.classList.add('oura-dark-glass');
            else document.documentElement.classList.remove('oura-dark-glass');
        };

        if (options.theme === 'system') {
            const mq = window.matchMedia('(prefers-color-scheme: dark)');
            applyTheme(mq.matches ? 'dark-glass' : 'light-glass');
            mq.onchange = (e) => applyTheme(e.matches ? 'dark-glass' : 'light-glass');
        } else if (options.theme) {
            applyTheme(options.theme);
        }
    }

    private _lockScroll(): void {
        if (typeof document === 'undefined' || typeof window === 'undefined') return;
        if (this.activeModals.length === 0) {
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            this.originalOverflow = document.body.style.overflow;
            this.originalPaddingRight = document.body.style.paddingRight;
            
            document.body.style.overflow = 'hidden';
            if (scrollBarWidth > 0) {
                document.body.style.paddingRight = `${scrollBarWidth}px`;
            }
        }
    }

    private _unlockScroll(): void {
        if (typeof document === 'undefined') return;
        if (this.activeModals.length === 0) {
            document.body.style.overflow = this.originalOverflow;
            document.body.style.paddingRight = this.originalPaddingRight;
        }
    }

    private _trapFocus(modal: HTMLElement) {
        const focusable = modal.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return () => {};
        
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        return (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
                } else {
                    if (document.activeElement === last) { e.preventDefault(); first.focus(); }
                }
            }
        };
    }

    private handleEsc(e: KeyboardEvent): void {
        if (e.key === 'Escape' && this.activeModals.length > 0) {
            const topModal = this.activeModals[this.activeModals.length - 1];
            topModal.close({ isConfirmed: false, isDismissed: true, isDenied: false });
        }
    }

    private _buildModal(options: OuraOptions, buttonsConfig: ButtonConfig[], isDrawer: boolean = false): Promise<OuraResult> {
        return new Promise((resolve) => {
            if (typeof document === 'undefined') return resolve({ isConfirmed: false, isDismissed: true, isDenied: false });
            
            this._lockScroll();

            const overlay = document.createElement('div');
            overlay.className = 'oura-overlay';

            const modal = document.createElement('div');
            const side = options.side || 'right';
            modal.className = isDrawer ? `oura-drawer oura-drawer-${side}` : 'oura-modal';
            if (isDrawer && options.width) modal.style.width = options.width;
            
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('tabindex', '-1');

            const uniqueId = `oura-${Date.now().toString(36)}`;
            
            const contentContainer = isDrawer ? document.createElement('div') : modal;
            if (isDrawer) {
                contentContainer.className = 'oura-drawer-content';
                modal.appendChild(contentContainer);
            }

            if (options.icon && MAIN_ICONS[options.icon]) {
                const iconEl = document.createElement('div');
                iconEl.className = 'oura-icon';
                iconEl.innerHTML = MAIN_ICONS[options.icon];
                contentContainer.appendChild(iconEl);
            } else if (options.icon && ICONS[options.icon]) {
                const iconEl = document.createElement('div');
                iconEl.className = 'oura-icon';
                iconEl.innerHTML = `<div class="oura-main-icon-glass">${ICONS[options.icon]}</div>`;
                contentContainer.appendChild(iconEl);
            }

            if (options.title) {
                const titleEl = document.createElement('h2');
                titleEl.id = `title-${uniqueId}`;
                titleEl.className = 'oura-title';
                titleEl.innerHTML = options.title;
                contentContainer.appendChild(titleEl);
                modal.setAttribute('aria-labelledby', titleEl.id);
            }

            if (options.text || options.html) {
                const textEl = document.createElement('div');
                textEl.id = `desc-${uniqueId}`;
                textEl.className = 'oura-text';
                
                if (options.html instanceof HTMLElement) {
                    textEl.appendChild(options.html);
                } else {
                    textEl.innerHTML = (options.html as string) || options.text || '';
                }
                
                contentContainer.appendChild(textEl);
                modal.setAttribute('aria-describedby', textEl.id);
            }

            let inputEl: HTMLInputElement | null = null;
            if (options.input) {
                inputEl = document.createElement('input');
                inputEl.type = options.input === 'number' ? 'number' : options.input === 'password' ? 'password' : 'text';
                inputEl.className = 'oura-input';
                if (options.inputPlaceholder) inputEl.placeholder = options.inputPlaceholder;
                if (options.inputValue) inputEl.value = options.inputValue;
                
                inputEl.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        close({ isConfirmed: true, isDismissed: false, isDenied: false, value: inputEl?.value });
                    }
                });

                contentContainer.appendChild(inputEl);
            }

            const actions = document.createElement('div');
            actions.className = 'oura-actions';
            const buttonNodes: HTMLButtonElement[] = [];

            buttonsConfig.forEach(btnConfig => {
                const btn = document.createElement('button');
                btn.className = `oura-btn ${btnConfig.className || ''}`.trim();
                btn.textContent = btnConfig.text;
                btn.addEventListener('click', () => {
                    const result: OuraResult = { ...btnConfig.value };
                    if (result.isConfirmed && inputEl) {
                        result.value = inputEl.value;
                    }
                    close(result, btn);
                });
                actions.appendChild(btn);
                buttonNodes.push(btn);
            });

            contentContainer.appendChild(actions);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            const allowOutsideClick = options.allowOutsideClick !== false;
            if (allowOutsideClick) {
                overlay.addEventListener('mousedown', (e) => {
                    if (e.target === overlay) close({ isConfirmed: false, isDismissed: true, isDenied: false });
                });
            }

            const trap = this._trapFocus(modal);
            modal.addEventListener('keydown', trap as EventListener);
            if (this.activeModals.length === 0) document.addEventListener('keydown', this.handleEsc);

            const modalInstance: ModalInstance = { overlay, modal, close: () => {} };
            
            const close = async (result: OuraResult, buttonNode?: HTMLButtonElement) => {
                if (result.isConfirmed && options.preConfirm) {
                    if (buttonNode) {
                        buttonNode.classList.add('oura-btn-loading');
                        buttonNode.disabled = true;
                    }
                    try {
                        const preConfirmValue = await options.preConfirm(result.value);
                        if (preConfirmValue !== undefined) result.value = preConfirmValue;
                    } catch (error: any) {
                        if (buttonNode) {
                            buttonNode.classList.remove('oura-btn-loading');
                            buttonNode.disabled = false;
                        }
                        let valMsg = modal.querySelector('.oura-validation-message') as HTMLElement;
                        if (!valMsg) {
                            valMsg = document.createElement('div');
                            valMsg.className = 'oura-validation-message';
                            if (inputEl) inputEl.parentNode?.insertBefore(valMsg, inputEl);
                            else contentContainer.insertBefore(valMsg, actions);
                        }
                        valMsg.textContent = error.message || String(error);
                        valMsg.classList.remove('oura-show');
                        void valMsg.offsetWidth; 
                        valMsg.classList.add('oura-show');
                        return; // Halt close
                    }
                }

                overlay.classList.remove('oura-show');
                modal.classList.remove('oura-show');
                
                setTimeout(() => {
                    overlay.remove();
                    this.activeModals = this.activeModals.filter(m => m !== modalInstance);
                    if (this.activeModals.length === 0) {
                        document.removeEventListener('keydown', this.handleEsc);
                        this._unlockScroll();
                    }
                    resolve(result);
                }, 300);
            };

            modalInstance.close = close;
            this.activeModals.push(modalInstance);

            void modal.offsetWidth; 
            overlay.classList.add('oura-show');
            modal.classList.add('oura-show');
            
            if (inputEl) {
                inputEl.focus();
            } else if (buttonNodes.length > 0) {
                buttonNodes[buttonNodes.length - 1].focus();
            }
        });
    }

    private _parseArgs(args: any[], defaultIcon?: OuraOptions['icon']): OuraOptions {
        if (typeof args[0] === 'string' || typeof args[1] === 'string') {
            return {
                title: args[0] || '',
                text: args[1] || '',
                icon: args[2] || defaultIcon
            };
        }
        return { icon: defaultIcon, ...(args[0] || {}) };
    }

    public fire(...args: any[]): Promise<OuraResult> {
        const config = this._parseArgs(args, 'success');
        return this._buildModal(config, [
            {
                text: config.confirmButtonText || this.getI18n('continue'),
                value: { isConfirmed: true, isDismissed: false, isDenied: false }
            }
        ]);
    }

    public confirm(...args: any[]): Promise<OuraResult> {
        const config: OuraOptions = { 
            title: 'Are you sure?', 
            text: 'This action cannot be undone.',
            ...this._parseArgs(args, 'warning') 
        };

        const buttons: ButtonConfig[] = [];
        buttons.push({
            text: config.cancelButtonText || this.getI18n('cancel'),
            value: { isConfirmed: false, isDismissed: true, isDenied: false },
            className: 'oura-btn-cancel'
        });
        
        if (config.showDenyButton) {
            buttons.push({
                text: config.denyButtonText || this.getI18n('deny'),
                value: { isConfirmed: false, isDismissed: false, isDenied: true },
                className: 'oura-btn-deny'
            });
        }

        buttons.push({
            text: config.confirmButtonText || this.getI18n('confirm'),
            value: { isConfirmed: true, isDismissed: false, isDenied: false }
        });

        return this._buildModal(config, buttons);
    }

    public prompt(titleOrOptions: string | OuraOptions, text?: string, inputType: OuraOptions['input'] = 'text'): Promise<OuraResult> {
        let config: OuraOptions = {};
        if (typeof titleOrOptions === 'string') {
            config = { title: titleOrOptions, text, input: inputType };
        } else {
            config = titleOrOptions as OuraOptions;
            if (!config.input) config.input = 'text';
        }

        const buttons: ButtonConfig[] = [];
        buttons.push({
            text: config.cancelButtonText || this.getI18n('cancel'),
            value: { isConfirmed: false, isDismissed: true, isDenied: false },
            className: 'oura-btn-cancel'
        });

        if (config.showDenyButton) {
            buttons.push({
                text: config.denyButtonText || this.getI18n('deny'),
                value: { isConfirmed: false, isDismissed: false, isDenied: true },
                className: 'oura-btn-deny'
            });
        }

        buttons.push({
            text: config.confirmButtonText || this.getI18n('submit'),
            value: { isConfirmed: true, isDismissed: false, isDenied: false }
        });

        return this._buildModal({ ...config }, buttons);
    }

    public drawer(options: OuraOptions): Promise<OuraResult> {
        return this._buildModal(options, [
            {
                text: options.confirmButtonText || this.getI18n('continue'),
                value: { isConfirmed: true, isDismissed: false, isDenied: false }
            }
        ], true);
    }

    private recalculateToastStack() {
        if (typeof document === 'undefined') return;
        const container = document.getElementById('oura-toast-container');
        if (!container) return;
        
        const toasts = Array.from(container.children) as HTMLElement[];
        // Stacking logic: newest is at index 0 (top visually if flex, or first in DOM)
        // With column-reverse, physical order is already handled.
        // For 3D deck, we want to scale back those "further" in the list.
        
        toasts.forEach((toast, idx) => {
            const isBottom = container.className.includes('bottom');
            // If bottom, the first in DOM (index 0) is at the bottom.
            // We want to scale those "underneath".
            // The latest toast is always at scale 1.
            
            const depth = toasts.length - 1 - idx; // Last element has depth 0
            const yOffset = depth * (isBottom ? 14 : -14); 
            const scale = 1 - (depth * 0.05); 
            const zIndex = 100 - depth;
            
            toast.style.setProperty('--y-offset', yOffset.toString());
            toast.style.setProperty('--scale', scale.toString());
            toast.style.setProperty('--z-index', zIndex.toString());
        });
    }

    public toast(...args: any[]): Promise<boolean> {
        return new Promise((resolve) => {
            if (typeof document === 'undefined') return resolve(false);

            const parsed = this._parseArgs(args);
            const config: OuraOptions = { timer: 3000, type: parsed.type || 'toast', ...parsed };
            const container = document.getElementById('oura-toast-container');
            if (!container) return resolve(false);

            const toast = document.createElement('div');
            toast.className = 'oura-toast oura-init';
            toast.setAttribute('role', 'status');

            let iconHtml = config.icon && ICONS[config.icon] ? ICONS[config.icon] : '';
            toast.innerHTML = `
                <div class="oura-toast-body">
                    ${iconHtml ? `<div class="oura-toast-icon">${iconHtml}</div>` : ''}
                    <div class="oura-toast-content">
                        ${config.title ? `<div class="oura-toast-title">${config.title}</div>` : ''}
                        ${config.text ? `<div class="oura-toast-text">${config.text}</div>` : ''}
                    </div>
                </div>
            `;

            if (config.type === 'progress') {
                const progCont = document.createElement('div');
                progCont.className = 'oura-progress-container';
                const progFill = document.createElement('div');
                progFill.className = 'oura-progress-fill';
                progFill.style.transitionDuration = `${config.timer}ms`;
                progCont.appendChild(progFill);
                toast.appendChild(progCont);

                requestAnimationFrame(() => {
                    setTimeout(() => {
                        progFill.style.width = '100%';
                    }, 50);
                });
            }

            container.appendChild(toast);
            this.recalculateToastStack();

            const close = () => {
                toast.classList.remove('oura-show');
                setTimeout(() => {
                    toast.remove();
                    this.recalculateToastStack();
                    resolve(true);
                }, 400); 
            };

            toast.addEventListener('click', close);
            
            if (config.timer && config.timer > 0) {
                setTimeout(close, config.timer);
            }

            requestAnimationFrame(() => {
                toast.classList.remove('oura-init');
                toast.classList.add('oura-show');
            });
        });
    }

    public promise<T>(
        promise: Promise<T> | (() => Promise<T>),
        msgs: { loading: string, success: string | ((data: T) => string), error: string | ((err: any) => string) }
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            if (typeof document === 'undefined') return reject();
            
            const container = document.getElementById('oura-toast-container');
            if (!container) return reject();
            
            const toast = document.createElement('div');
            toast.className = 'oura-toast oura-init';
            toast.innerHTML = `
                <div class="oura-toast-body">
                    <div class="oura-toast-icon"><div class="oura-btn-loading" style="width:16px; height:16px; margin:0; border-color: rgba(0,0,0,0.2); border-top-color: currentColor;" ></div></div>
                    <div class="oura-toast-content">
                        <div class="oura-toast-title">${msgs.loading}</div>
                    </div>
                </div>
            `;
            container.appendChild(toast);
            this.recalculateToastStack();
            
            requestAnimationFrame(() => {
                toast.classList.remove('oura-init');
                toast.classList.add('oura-show');
            });
            
            const finalize = (type: 'success' | 'error', text: string) => {
                const iconHtml = ICONS[type] || '';
                toast.innerHTML = `
                    <div class="oura-toast-body">
                        <div class="oura-toast-icon">${iconHtml}</div>
                        <div class="oura-toast-content">
                            <div class="oura-toast-title">${text}</div>
                        </div>
                    </div>
                `;
                setTimeout(() => {
                    toast.classList.remove('oura-show');
                    setTimeout(() => {
                        toast.remove();
                        this.recalculateToastStack();
                    }, 400);
                }, 3000); // Auto close after 3s
            };

            const p = typeof promise === 'function' ? promise() : promise;
            p.then((data) => {
                finalize('success', typeof msgs.success === 'function' ? msgs.success(data) : msgs.success);
                resolve(data);
            }).catch((err) => {
                finalize('error', typeof msgs.error === 'function' ? msgs.error(err) : msgs.error);
                reject(err);
            });
        });
    }

    public success(title: string, text?: string) { return this.toast({ title, text, icon: 'success' }); }
    public info(title: string, text?: string) { return this.toast({ title, text, icon: 'info' }); }
    public warning(title: string, text?: string) { return this.toast({ title, text, icon: 'warning' }); }
    public error(title: string, text?: string) { return this.toast({ title, text, icon: 'error' }); }
}

const Oura = new OuraNotification();
export default Oura;

if (typeof window !== 'undefined') {
    (window as any).Oura = Oura;
}
