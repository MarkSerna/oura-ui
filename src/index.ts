import {
  OuraOptions,
  OuraResult,
  TooltipOptions,
  PopoverOptions,
  DropdownOptions,
  DropdownItem,
  AlertOptions,
  SkeletonOptions,
  HoverCardOptions,
  OuraToastHandle,
  OuraPromiseMessages,
} from './types';
import { OuraCore } from './core/OuraCore';
import { fire, confirmModal, promptModal, drawerModal } from './components/modal';
import { toast, promiseToast, success, info, warning, error } from './components/toast';
import { alert } from './components/alert';
import { skeleton } from './components/skeleton';
import { tooltip } from './components/tooltip';
import { popover } from './components/popover';
import { dropdown } from './components/dropdown';
import { contextMenu } from './components/contextMenu';
import { hoverCard } from './components/hoverCard';

class OuraNotification extends OuraCore {
  private static instance: OuraNotification;

  public static getInstance(): OuraNotification {
    if (!OuraNotification.instance) {
      OuraNotification.instance = new OuraNotification();
    }
    return OuraNotification.instance;
  }

  // ── Modals ──
  public fire(...args: unknown[]): Promise<OuraResult> {
    return fire(this, ...args);
  }

  public confirm(...args: unknown[]): Promise<OuraResult> {
    return confirmModal(this, ...args);
  }

  public prompt(
    titleOrOptions: string | OuraOptions,
    text?: string,
    inputType: OuraOptions['input'] = 'text'
  ): Promise<OuraResult> {
    return promptModal(this, titleOrOptions, text, inputType);
  }

  public drawer(options: OuraOptions): Promise<OuraResult> {
    return drawerModal(this, options);
  }

  // ── Toasts ──
  public toast(...args: unknown[]): OuraToastHandle {
    return toast(this, ...args);
  }

  public promise<T>(
    promise: Promise<T> | (() => Promise<T>),
    msgs: OuraPromiseMessages<T>
  ): Promise<T> {
    return promiseToast(promise, msgs);
  }

  public success(title: string, text?: string): OuraToastHandle {
    return success(this, title, text);
  }

  public info(title: string, text?: string): OuraToastHandle {
    return info(this, title, text);
  }

  public warning(title: string, text?: string): OuraToastHandle {
    return warning(this, title, text);
  }

  public error(title: string, text?: string): OuraToastHandle {
    return error(this, title, text);
  }

  // ── Components ──
  public alert(options: AlertOptions): HTMLElement {
    return alert(this, options);
  }

  public skeleton(options: SkeletonOptions): HTMLElement {
    return skeleton(this, options);
  }

  public tooltip(target: string | HTMLElement, options: TooltipOptions): () => void {
    return tooltip(this, target, options);
  }

  public popover(target: string | HTMLElement, options: PopoverOptions): () => void {
    return popover(this, target, options);
  }

  public dropdown(target: string | HTMLElement, options: DropdownOptions): () => void {
    return dropdown(this, target, options);
  }

  public contextMenu(target: string | HTMLElement, items: DropdownItem[]): () => void {
    return contextMenu(this, target, items);
  }

  public hoverCard(target: string | HTMLElement, options: HoverCardOptions): () => void {
    return hoverCard(this, target, options);
  }

  // Helper for queue logic (which will stay in index.ts for now as its conductor logic)
  public async queue(steps: OuraOptions[]): Promise<OuraResult[]> {
    const results: OuraResult[] = [];
    for (const step of steps) {
      const res = await this.fire(step);
      results.push(res);
      // Wait a small delay between modals
      await new Promise((r) => setTimeout(r, 300));
    }
    return results;
  }
}

const Oura = OuraNotification.getInstance();

if (typeof window !== 'undefined') {
  (window as any).Oura = Oura;
}

export default Oura;
export { OuraNotification };
