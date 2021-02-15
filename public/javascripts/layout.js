function toggleSidebar() {
    var current_width = getComputedStyle(document.documentElement)
    .getPropertyValue("--sidebar-margin");
    if (current_width == '0px'){
        document.documentElement.style
            .setProperty('--sidebar-margin', '-60px');
    } else {
        document.documentElement.style
            .setProperty('--sidebar-margin', '0px');
    }

}