document.addEventListener('DOMContentLoaded', function() {
    // Get all clickable elements
    const pdfLinks = document.querySelectorAll('.header-item, .presentation-item');
    const modal = document.getElementById('pdf-modal');
    const pdfViewer = document.getElementById('pdf-viewer');
    const closeBtn = document.querySelector('.close');
    
    // Add click event to all PDF links
    pdfLinks.forEach(link => {
        link.addEventListener('click', function() {
            const pdfName = this.getAttribute('data-pdf');
            if (pdfName) {
                pdfViewer.src = `pdfs/${pdfName}.pdf`;
                modal.style.display = 'block';
            }
        });
    });
    
    // Close modal when clicking X
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        pdfViewer.src = '';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            pdfViewer.src = '';
        }
    });
});