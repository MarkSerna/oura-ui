import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Oura from '../src/index';
import { injectStyles } from '../src/styles';

describe('OuraNotification UI Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        const styles = document.getElementById('oura-styles');
        if (styles) styles.remove();
        injectStyles();
        Oura.configure({ locale: 'en' });
    });

    afterEach(() => {
        document.querySelectorAll('.oura-overlay').forEach(el => el.remove());
        document.querySelectorAll('.oura-toast').forEach(el => el.remove());
    });

    it('should inject styles into the document on load', () => {
        expect(document.getElementById('oura-styles')).toBeTruthy();
        expect(document.getElementById('oura-toast-container')).toBeTruthy();
    });

    it('should open a success modal and respond to confirm', async () => {
        const promise = Oura.fire({ title: 'Test', text: 'Success Message', icon: 'success' });
        
        const modal = document.querySelector('.oura-modal');
        expect(modal).toBeTruthy();
        expect(modal?.querySelector('.oura-title')?.textContent).toBe('Test');
        
        const btn = document.querySelector('.oura-btn') as HTMLButtonElement;
        expect(btn).toBeTruthy();
        btn.click();
        
        const result = await promise;
        expect(result.isConfirmed).toBe(true);
    });

    it('should handle locale i18n exactly as specified', async () => {
        Oura.configure({ locale: 'es' });
        Oura.confirm('Are you sure?');
        
        const btns = document.querySelectorAll('.oura-btn');
        expect(btns.length).toBe(2);
        expect(btns[0].textContent).toBe('Cancelar');
        expect(btns[1].textContent).toBe('Confirmar');
    });

    it('should generate a toast with correct ARIA roles', async () => {
        Oura.success('Data saved');
        
        const container = document.getElementById('oura-toast-container');
        expect(container?.getAttribute('aria-live')).toBe('polite');
        
        const toast = document.querySelector('.oura-toast');
        expect(toast).toBeTruthy();
        expect(toast?.getAttribute('role')).toBe('status');
    });

    it('should handle preConfirm async validation', async () => {
        let validated = false;
        const promise = Oura.fire({
            title: 'Async',
            preConfirm: async (val: string | undefined) => {
                await new Promise(r => setTimeout(r, 10));
                validated = true;
                return val;
            }
        });

        const btn = document.querySelector('.oura-btn') as HTMLButtonElement;
        btn.click();
        
        // Modal should not be removed yet if async is running
        // But our implementation closes after await
        await promise;
        expect(validated).toBe(true);
    });

    it('should handle deny button result', async () => {
        const promise = Oura.confirm({
            title: 'Save?',
            showDenyButton: true,
            denyButtonText: 'No'
        });

        const btns = document.querySelectorAll('.oura-btn');
        expect(btns.length).toBe(3); // Cancel, Deny, Confirm
        
        const denyBtn = btns[1] as HTMLButtonElement;
        expect(denyBtn.classList.contains('oura-btn-deny')).toBe(true);
        denyBtn.click();

        const result = await promise;
        expect(result.isDenied).toBe(true);
        expect(result.isConfirmed).toBe(false);
    });

    it('should handle Oura.promise states', async () => {
        const p = new Promise(resolve => setTimeout(() => resolve('done'), 20));
        const op = Oura.promise(p, {
            loading: 'Loading...',
            success: 'Success!',
            error: 'Error!'
        });

        const toast = document.querySelector('.oura-toast');
        expect(toast?.textContent).toContain('Loading...');
        
        await op;
        expect(toast?.textContent).toContain('Success!');
    });

    it('should update toast container position', () => {
        Oura.configure({ position: 'bottom-center' });
        const container = document.getElementById('oura-toast-container');
        expect(container?.classList.contains('oura-pos-bottom-center')).toBe(true);
    });

    it('should render a drawer with correct side', async () => {
        Oura.drawer({ title: 'Settings', side: 'left' });
        const drawer = document.querySelector('.oura-drawer');
        expect(drawer).toBeTruthy();
        expect(drawer?.classList.contains('oura-drawer-left')).toBe(true);
        expect(drawer?.querySelector('.oura-title')?.textContent).toBe('Settings');
    });

    it('should apply themes correctly including dark mode', () => {
        Oura.configure({ theme: 'dark-glass' });
        expect(document.documentElement.classList.contains('oura-dark-glass')).toBe(true);
        Oura.configure({ theme: 'light-glass' });
        expect(document.documentElement.classList.contains('oura-dark-glass')).toBe(false);
    });
});
