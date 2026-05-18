GlansToast Installation & Usage Guide
🚀 CDN Installation
Add the following tags to your project layout:

1. Inside your <head> tag:
HTML

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/text/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css" rel="stylesheet">

<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Dev-Patel1904/GlansToast@main/toast.css?v=1.0.0">

2. Right before your closing </body> tag:
HTML

<script src="https://cdn.jsdelivr.net/gh/Dev-Patel1904/GlansToast@main/toast.js?v=1.0.0"></script>

📖 Code Examples

1. Standard Auto-Dismissing Alerts
These automatically disappear after the specified duration (default is 4000ms):

JavaScript
// Success Alert
showToast('success', 'Success!', 'Data saved successfully.');

// Error Alert
showToast('error', 'Error!', 'Something went wrong.', 5000); // Overridden to stay for 5 seconds

// Warning Alert
showToast('warning', 'Warning!', 'Please check your input fields.');

// Info Alert
showToast('info', 'Info!', 'New updates are available.');


2. Interactive Choice Confirmation Prompt
The confirm layout does not auto-dismiss. It returns a Promise that resolves to true when the user clicks OK, and false when they click Cancel:

JavaScript
async function handleDeleteAction() {
    // Execution waits here until the user interacts with the toast interface
    const confirmed = await showToast('confirm', 'Are you sure?', 'This action cannot be undone. Do you want to proceed?');
    
    if (confirmed) {
        showToast('success', 'Deleted!', 'The data has been permanently cleared.');
    } else {
        showToast('info', 'Cancelled', 'Operation aborted securely.');
    }
}
