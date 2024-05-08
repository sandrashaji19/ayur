function moveToNextPage(parameter,id) {
    localStorage.setItem('parameter',parameter)
    // Change the location to the next HTML page
    window.location.href = "/doctorappo?parameter=" + encodeURIComponent(id);
}