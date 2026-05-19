GlassToast – Modern 3D Toast Notification Library
GlassToast is a lightweight, modern, and beautiful toast notification library with 3D glass effects and smooth animations.

✨ Features
Modern glassmorphism UI
3D animated toasts
Success, Error, Info, Warning types
Confirmation dialog support
Auto-hide with progress bar
Pause on hover
Click to close
No dependencies (except Font Awesome for icons)
Easy CDN integration
🚀 Installation (Using CDN)
You can use GlassToast directly in your project without downloading anything.

Example of How to Add CDN
<!DOCTYPE html>
<html>
<head>

   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/text/bootstrap.min.css" rel="stylesheet">
   <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css" rel="stylesheet">

   <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Dev-Patel1904/GlansToast@main/toast.css?v=1.0.0">

</head>

<body>

    <!-- Your website content -->

    <script src="https://cdn.jsdelivr.net/gh/Dev-Patel1904/GlansToast@main/toast.js?v=1.0.0"></script>

</body>
</html>

Example of class
   1 ShowToast.success("Success", "Data saved successfully!");
   2 ShowToast.error("Error", "Something went wrong!");
   3 ShowToast.info("Info", "New update available.");
   4 ShowToast.warning("Warning", "Please fill all fields.");
   5 ShowToast.confirm("Delete User", "Are you sure?", function() {
      // Code to execute on confirm
      console.log("User confirmed!");
    });
    
  6 => You can customize toast duration (in milliseconds):
  ShowToast.success("Saved", "Record saved!", 8000);

