/**
 * Noti5.js - A beautiful, minimalist notification library
 * Version 1.0.0
 * 
 * Created by Edmund Cinco (https://edmundcinco.com) in 2025
 * @license MIT
 */

(function(global) {
    'use strict';
    
    // Initialize the Noti5 library
    const Noti5 = (function() {
        // Icons used in the library
        const ICONS = {
            success: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
            error: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
            warning: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
            info: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
            primary: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,
            close: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        };
        
        // Toast container map (created on demand)
        const toastContainers = {};
        
        // Toast counter for unique IDs
        let toastCounter = 0;
        
        // Dialog elements (created once)
        let dialogOverlay = null;
        let currentDialogCallback = null;
        let currentCancelCallback = null;
        
        // CSS styles for the library
        const styles = `
            /* Noti5 Styles */
            :root {
                --noti5-primary: #6366f1;
                --noti5-success: #10b981;
                --noti5-error: #ef4444;
                --noti5-warning: #f59e0b;
                --noti5-info: #3b82f6;
                
                --noti5-surface: #ffffff;
                --noti5-text-primary: #111827;
                --noti5-text-secondary: #6b7280;
                
                --noti5-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px rgba(0, 0, 0, 0.05);
                --noti5-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                --noti5-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
                
                --noti5-radius-sm: 6px;
                --noti5-radius-md: 8px;
                --noti5-radius-lg: 12px;
                
                --noti5-transition-fast: 180ms cubic-bezier(0.4, 0, 0.2, 1);
                --noti5-transition-normal: 240ms cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            /* Toast container */
            .noti5-toast-container {
                position: fixed;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 8px;
                pointer-events: none;
                max-width: 360px;
                width: calc(100% - 40px);
            }
            
            .noti5-position-top-right { top: 20px; right: 20px; }
            .noti5-position-top-left { top: 20px; left: 20px; }
            .noti5-position-top-center { top: 20px; left: 50%; transform: translateX(-50%); }
            .noti5-position-bottom-right { bottom: 20px; right: 20px; }
            .noti5-position-bottom-left { bottom: 20px; left: 20px; }
            .noti5-position-bottom-center { bottom: 20px; left: 50%; transform: translateX(-50%); }
            
            /* Toast element */
            .noti5-toast {
                background-color: var(--noti5-surface);
                border-radius: var(--noti5-radius-md);
                box-shadow: var(--noti5-shadow-lg);
                padding: 16px;
                display: flex;
                align-items: flex-start;
                gap: 12px;
                pointer-events: auto;
                transform: translateY(10px);
                opacity: 0;
                transition: all var(--noti5-transition-normal);
                overflow: hidden;
                position: relative;
                max-width: 100%;
            }
            
            .noti5-toast.noti5-show {
                transform: translateY(0);
                opacity: 1;
            }
            
            .noti5-toast-icon {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                margin-top: 2px;
            }
            
            .noti5-toast-content {
                flex: 1;
                min-width: 0;
            }
            
            .noti5-toast-title {
                font-weight: 600;
                font-size: 15px;
                color: var(--noti5-text-primary);
                margin-bottom: 3px;
                line-height: 1.3;
            }
            
            .noti5-toast-message {
                font-size: 14px;
                color: var(--noti5-text-secondary);
                line-height: 1.4;
            }
            
            .noti5-toast-close {
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 4px;
                color: #9ca3af;
                opacity: 0.7;
                transition: opacity var(--noti5-transition-fast);
                flex-shrink: 0;
                border-radius: 50%;
                margin-left: 2px;
                margin-top: -2px;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .noti5-toast-close:hover {
                opacity: 1;
                background-color: rgba(0, 0, 0, 0.05);
            }
            
            .noti5-toast-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                width: 100%;
                transform-origin: left;
            }
            
            /* Toast variations */
            .noti5-toast-success .noti5-toast-icon { background-color: rgba(16, 185, 129, 0.1); color: var(--noti5-success); }
            .noti5-toast-error .noti5-toast-icon { background-color: rgba(239, 68, 68, 0.1); color: var(--noti5-error); }
            .noti5-toast-warning .noti5-toast-icon { background-color: rgba(245, 158, 11, 0.1); color: var(--noti5-warning); }
            .noti5-toast-info .noti5-toast-icon { background-color: rgba(59, 130, 246, 0.1); color: var(--noti5-info); }
            .noti5-toast-primary .noti5-toast-icon { background-color: rgba(99, 102, 241, 0.1); color: var(--noti5-primary); }
            
            .noti5-toast-success .noti5-toast-progress { background-color: var(--noti5-success); }
            .noti5-toast-error .noti5-toast-progress { background-color: var(--noti5-error); }
            .noti5-toast-warning .noti5-toast-progress { background-color: var(--noti5-warning); }
            .noti5-toast-info .noti5-toast-progress { background-color: var(--noti5-info); }
            .noti5-toast-primary .noti5-toast-progress { background-color: var(--noti5-primary); }
            
            /* Dialog */
            .noti5-dialog-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all var(--noti5-transition-normal);
                padding: 20px;
            }
            
            .noti5-dialog-overlay.noti5-active {
                opacity: 1;
                visibility: visible;
            }
            
            .noti5-dialog {
                background-color: var(--noti5-surface);
                border-radius: var(--noti5-radius-lg);
                box-shadow: var(--noti5-shadow-lg);
                width: 100%;
                max-width: 450px;
                transform: scale(0.95);
                opacity: 0;
                transition: all var(--noti5-transition-normal);
                overflow: hidden;
            }
            
            .noti5-dialog-overlay.noti5-active .noti5-dialog {
                transform: scale(1);
                opacity: 1;
            }
            
            .noti5-dialog-header {
                padding: 24px 24px 0;
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
            }
            
            .noti5-dialog-icon {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 16px;
            }
            
            .noti5-dialog-close {
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 6px;
                color: #9ca3af;
                margin: -6px;
                opacity: 0.7;
                transition: opacity var(--noti5-transition-fast);
                border-radius: 50%;
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .noti5-dialog-close:hover {
                opacity: 1;
                background-color: rgba(0, 0, 0, 0.05);
            }
            
            .noti5-dialog-content {
                padding: 0 24px 24px;
            }
            
            .noti5-dialog-title {
                font-size: 18px;
                font-weight: 600;
                color: var(--noti5-text-primary);
                margin-bottom: 8px;
            }
            
            .noti5-dialog-message {
                font-size: 15px;
                color: var(--noti5-text-secondary);
                margin-bottom: 24px;
                line-height: 1.5;
            }
            
            .noti5-dialog-buttons {
                display: flex;
                justify-content: flex-end;
                gap: 12px;
            }
            
            .noti5-dialog-btn {
                padding: 10px 16px;
                border-radius: var(--noti5-radius-md);
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all var(--noti5-transition-fast);
                height: 40px;
                min-width: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .noti5-dialog-btn-cancel {
                background-color: white;
                border: 1px solid #e5e7eb;
                color: #4b5563;
            }
            
            .noti5-dialog-btn-cancel:hover {
                background-color: #f9fafb;
                border-color: #d1d5db;
            }
            
            .noti5-dialog-btn-confirm {
                background-color: var(--noti5-primary);
                border: 1px solid var(--noti5-primary);
                color: white;
            }
            
            .noti5-dialog-btn-confirm:hover {
                opacity: 0.9;
            }
            
            /* Dialog variations */
            .noti5-dialog-success .noti5-dialog-icon { background-color: rgba(16, 185, 129, 0.1); color: var(--noti5-success); }
            .noti5-dialog-error .noti5-dialog-icon { background-color: rgba(239, 68, 68, 0.1); color: var(--noti5-error); }
            .noti5-dialog-warning .noti5-dialog-icon { background-color: rgba(245, 158, 11, 0.1); color: var(--noti5-warning); }
            .noti5-dialog-info .noti5-dialog-icon { background-color: rgba(59, 130, 246, 0.1); color: var(--noti5-info); }
            .noti5-dialog-primary .noti5-dialog-icon { background-color: rgba(99, 102, 241, 0.1); color: var(--noti5-primary); }
            
            .noti5-dialog-success .noti5-dialog-btn-confirm { background-color: var(--noti5-success); border-color: var(--noti5-success); }
            .noti5-dialog-error .noti5-dialog-btn-confirm { background-color: var(--noti5-error); border-color: var(--noti5-error); }
            .noti5-dialog-warning .noti5-dialog-btn-confirm { background-color: var(--noti5-warning); border-color: var(--noti5-warning); }
            .noti5-dialog-info .noti5-dialog-btn-confirm { background-color: var(--noti5-info); border-color: var(--noti5-info); }
            
            /* Mobile responsiveness */
            @media (max-width: 576px) {
                .noti5-dialog-buttons {
                    flex-direction: column-reverse;
                }
                
                .noti5-dialog-btn {
                    width: 100%;
                }
            }
        `;
        
        // Initialize library
        function initialize() {
            // Add styles to document
            if (!document.getElementById('noti5-styles')) {
                const styleElement = document.createElement('style');
                styleElement.id = 'noti5-styles';
                styleElement.textContent = styles;
                document.head.appendChild(styleElement);
            }
            
            // Create dialog elements if they don't exist
            if (!dialogOverlay) {
                dialogOverlay = document.createElement('div');
                dialogOverlay.className = 'noti5-dialog-overlay';
                dialogOverlay.innerHTML = `
                    <div class="noti5-dialog noti5-dialog-primary">
                        <div class="noti5-dialog-header">
                            <div></div>
                            <button class="noti5-dialog-close" id="noti5-dialog-close">
                                ${ICONS.close}
                            </button>
                        </div>
                        <div class="noti5-dialog-content">
                            <div class="noti5-dialog-icon">
                                ${ICONS.info}
                            </div>
                            <div class="noti5-dialog-title" id="noti5-dialog-title">Alert</div>
                            <div class="noti5-dialog-message" id="noti5-dialog-message">This is an alert</div>
                            <div class="noti5-dialog-buttons">
                                <button class="noti5-dialog-btn noti5-dialog-btn-cancel" id="noti5-dialog-cancel">Cancel</button>
                                <button class="noti5-dialog-btn noti5-dialog-btn-confirm" id="noti5-dialog-confirm">OK</button>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(dialogOverlay);
                
                // Set up dialog event listeners
                document.getElementById('noti5-dialog-close').addEventListener('click', closeDialog);
                document.getElementById('noti5-dialog-cancel').addEventListener('click', function() {
                    closeDialog();
                    if (currentCancelCallback) currentCancelCallback();
                });
                document.getElementById('noti5-dialog-confirm').addEventListener('click', function() {
                    closeDialog();
                    if (currentDialogCallback) currentDialogCallback();
                });
                
                // Close dialog when clicking on overlay (optional)
                dialogOverlay.addEventListener('click', function(e) {
                    if (e.target === dialogOverlay) closeDialog();
                });
            }
        }
        
        // Get or create toast container
        function getToastContainer(position) {
            // Default position is top-right
            position = position || 'top-right';
            
            // If container doesn't exist for this position, create it
            if (!toastContainers[position]) {
                const container = document.createElement('div');
                container.className = `noti5-toast-container noti5-position-${position}`;
                document.body.appendChild(container);
                toastContainers[position] = container;
            }
            
            return toastContainers[position];
        }
        
        // Dismiss a toast
        function dismissToast(id) {
            const toast = document.getElementById(id);
            if (!toast) return;
            
            // Clear timeout
            clearTimeout(parseInt(toast.dataset.timeoutId || 0));
            
            // Hide and remove toast
            toast.classList.remove('noti5-show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }
        
        // Close dialog
        function closeDialog() {
            if (dialogOverlay) {
                dialogOverlay.classList.remove('noti5-active');
                // Reset callbacks
                currentDialogCallback = null;
                currentCancelCallback = null;
            }
        }
        
        // Public API
        return {
            // Configuration options
            config: {
                // Default toast duration in milliseconds
                toastDuration: 4000,
                
                // Default position for toasts
                position: 'top-right',
                
                // Customize colors
                setColors: function(colors) {
                    const root = document.documentElement;
                    
                    if (colors.primary) root.style.setProperty('--noti5-primary', colors.primary);
                    if (colors.success) root.style.setProperty('--noti5-success', colors.success);
                    if (colors.error) root.style.setProperty('--noti5-error', colors.error);
                    if (colors.warning) root.style.setProperty('--noti5-warning', colors.warning);
                    if (colors.info) root.style.setProperty('--noti5-info', colors.info);
                    
                    return this;
                },
                
                // Set default duration
                setDuration: function(duration) {
                    if (duration && typeof duration === 'number') {
                        this.toastDuration = duration;
                    }
                    return this;
                },
                
                // Set default position
                setPosition: function(position) {
                    const validPositions = ['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center'];
                    if (position && validPositions.includes(position)) {
                        this.position = position;
                    }
                    return this;
                }
            },
            
            // Show a toast notification
            toast: function(message, title, type, position, duration) {
                // Make sure we're initialized
                initialize();
                
                // Default values
                type = type || 'primary';
                duration = duration || this.config.toastDuration;
                position = position || this.config.position;
                title = title || '';
                
                // Get container
                const container = getToastContainer(position);
                
                // Create toast ID
                const id = `noti5-toast-${toastCounter++}`;
                
                // Create toast element
                const toast = document.createElement('div');
                toast.className = `noti5-toast noti5-toast-${type}`;
                toast.id = id;
                
                // Set toast content
                toast.innerHTML = `
                    <div class="noti5-toast-icon">${ICONS[type]}</div>
                    <div class="noti5-toast-content">
                        ${title ? `<div class="noti5-toast-title">${title}</div>` : ''}
                        <div class="noti5-toast-message">${message}</div>
                    </div>
                    <button class="noti5-toast-close">${ICONS.close}</button>
                    <div class="noti5-toast-progress"></div>
                `;
                
                // Add toast to container
                container.appendChild(toast);
                
                // Get close button and add click handler
                const closeBtn = toast.querySelector('.noti5-toast-close');
                closeBtn.addEventListener('click', function() {
                    dismissToast(id);
                });
                
                // Show toast (with slight delay for animation)
                setTimeout(() => {
                    toast.classList.add('noti5-show');
                    
                    // Animate progress bar
                    const progress = toast.querySelector('.noti5-toast-progress');
                    progress.style.transition = `transform ${duration/1000}s linear`;
                    progress.style.transform = 'scaleX(0)';
                }, 10);
                
                // Auto remove after duration
                const timeoutId = setTimeout(() => {
                    dismissToast(id);
                }, duration);
                
                // Store timeout ID for potential early dismissal
                toast.dataset.timeoutId = timeoutId;
                
                // Return toast ID for potential manual dismissal
                return id;
            },
            
            // Show a success toast
            success: function(message, title, position, duration) {
                return this.toast(message, title, 'success', position, duration);
            },
            
            // Show an error toast
            error: function(message, title, position, duration) {
                return this.toast(message, title, 'error', position, duration);
            },
            
            // Show a warning toast
            warning: function(message, title, position, duration) {
                return this.toast(message, title, 'warning', position, duration);
            },
            
            // Show an info toast
            info: function(message, title, position, duration) {
                return this.toast(message, title, 'info', position, duration);
            },
            
            // Dismiss a specific toast
            dismiss: function(id) {
                dismissToast(id);
                return this;
            },
            
            // Show an alert dialog
            alert: function(message, title, type, buttonText) {
                // Make sure we're initialized
                initialize();
                
                // Default values
                type = type || 'primary';
                title = title || 'Alert';
                buttonText = buttonText || 'OK';
                
                // Get dialog elements
                const dialog = dialogOverlay.querySelector('.noti5-dialog');
                const dialogTitle = document.getElementById('noti5-dialog-title');
                const dialogMessage = document.getElementById('noti5-dialog-message');
                const dialogConfirm = document.getElementById('noti5-dialog-confirm');
                const dialogCancel = document.getElementById('noti5-dialog-cancel');
                const dialogIcon = dialogOverlay.querySelector('.noti5-dialog-icon');
                
                // Set content
                dialogTitle.textContent = title;
                dialogMessage.textContent = message;
                dialogConfirm.textContent = buttonText;
                
                // Set icon
                dialogIcon.innerHTML = ICONS[type];
                
                // Configure as alert (hide cancel button)
                dialogCancel.style.display = 'none';
                
                // Set dialog type class
                dialog.className = `noti5-dialog noti5-dialog-${type}`;
                
                // Show dialog
                dialogOverlay.classList.add('noti5-active');
                
                return this;
            },
            
            // Show a confirmation dialog
            confirm: function(message, confirmCallback, cancelCallback, type, confirmText, cancelText) {
                // Make sure we're initialized
                initialize();
                
                // Default values
                type = type || 'primary';
                confirmText = confirmText || 'Confirm';
                cancelText = cancelText || 'Cancel';
                
                // Store callbacks
                currentDialogCallback = confirmCallback || function(){};
                currentCancelCallback = cancelCallback || function(){};
                
                // Get dialog elements
                const dialog = dialogOverlay.querySelector('.noti5-dialog');
                const dialogTitle = document.getElementById('noti5-dialog-title');
                const dialogMessage = document.getElementById('noti5-dialog-message');
                const dialogConfirm = document.getElementById('noti5-dialog-confirm');
                const dialogCancel = document.getElementById('noti5-dialog-cancel');
                const dialogIcon = dialogOverlay.querySelector('.noti5-dialog-icon');
                
                // Set content
                dialogTitle.textContent = 'Confirm';
                dialogMessage.textContent = message;
                dialogConfirm.textContent = confirmText;
                dialogCancel.textContent = cancelText;
                
                // Set icon
                dialogIcon.innerHTML = ICONS[type];
                
                // Configure as confirm (show cancel button)
                dialogCancel.style.display = 'block';
                
                // Set dialog type class
                dialog.className = `noti5-dialog noti5-dialog-${type}`;
                
                // Show dialog
                dialogOverlay.classList.add('noti5-active');
                
                return this;
            }
        };
    })();
    
    // Expose the Noti5 object globally
    global.Noti5 = Noti5;
    
})(typeof window !== 'undefined' ? window : this);