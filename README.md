# Noti5.js

A beautiful, minimalist notification library for web applications.

## Features
- Toast Notifications: Supports basic, success, error, warning, and info toasts.
- Dialogs: Alert and confirmation dialogs with customizable buttons.
- Customization: Global configuration for positions, durations, and colors.
- Lightweight: Minimal footprint for fast performance.
- Minified Version: Includes both development (Noti5.js) and production-ready (Noti5.min.js) builds.

## Demo
Check out the [Noti5.js Demo](https://noti5.edmundcinco.com) to see Noti5.js in action.

## Installation

### Via npm
```bash
npm install noti5
```

### Via CDN
Include the script in your HTML:

Development (unminified):
```html
<script src="https://cdn.jsdelivr.net/npm/noti5.js@1.0.0/noti5.js"></script>
```

Production (minified):
```html
<script src="https://cdn.jsdelivr.net/npm/noti5.js@1.0.0/noti5.min.js"></script>
```

## Usage

### Basic Toast
```js
Noti5.toast('This is a simple toast message');
```

### Success Toast
```js
Noti5.success('Operation completed successfully', 'Success');
```

### Alert Dialog
```js
Noti5.alert('This is an alert message', 'Alert');
```

### Confirmation Dialog
```js
Noti5.confirm('Are you sure you want to proceed?', function() {
  // Confirm callback
  Noti5.success('Action confirmed');
}, function() {
  // Cancel callback
  Noti5.info('Action cancelled');
});
```

## API Reference

- Noti5.toast(message, title, type, position, duration)  
  Displays a toast notification.
- Noti5.success(message, title, position, duration)  
  Displays a success toast.
- Noti5.error(message, title, position, duration)  
  Displays an error toast.
- Noti5.warning(message, title, position, duration)  
  Displays a warning toast.
- Noti5.info(message, title, position, duration)  
  Displays an info toast.
- Noti5.alert(message, title, type, buttonText)  
  Displays an alert dialog.
- Noti5.confirm(message, confirmCallback, cancelCallback, type, confirmText, cancelText)  
  Displays a confirmation dialog.
- Noti5.config.setPosition(position)  
  Sets the default toast position. *(Options: 'top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center')*
- Noti5.config.setDuration(duration)  
  Sets the default toast duration in milliseconds.
- Noti5.config.setColors({ primary, success, error, warning, info })  
  Customizes the theme colors.

## License
Noti5.js is licensed under the [MIT License](LICENSE).

## Contributing
Contributions are welcome! Please fork the repository and create a pull request. For major changes, open an issue first to discuss your proposed changes.

## Author
Created by [Edmund Cinco](https://edmundcinco.com)