// Helper: Sanitize file names
function sanitizeFilename(name) {
  return name.replace(/[<>:"/\\|?*]+/g, '').replace(/\s+/g, '_');
}

// Get file extension
function getExtension(url) {
  const match = url.match(/\.(jpg|jpeg|png|gif|webp|svg)/i);
  return match ? match[0] : '.png';
}

// DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const zipBtn = document.getElementById('downloadAll');
  const images = document.querySelectorAll('.tree-gallery img');
  const imagePreview = document.getElementById('imagePreview');
  const previewImage = imagePreview.querySelector('img');
  const closeBtn = document.getElementById('closePreview');

  // Single click: preview
  images.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      previewImage.src = img.src;
      previewImage.alt = img.alt || 'Preview Image';
      imagePreview.classList.remove('hidden');
    });

    // Double click: download
    img.addEventListener('dblclick', () => {
      const link = document.createElement('a');
      link.href = img.src;
      link.download = sanitizeFilename(img.alt || 'image') + getExtension(img.src);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  });

  // Close preview
  closeBtn.addEventListener('click', () => {
    imagePreview.classList.add('hidden');
    previewImage.src = '';
  });

  imagePreview.addEventListener('click', e => {
    if (e.target === imagePreview) {
      closeBtn.click();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !imagePreview.classList.contains('hidden')) {
      closeBtn.click();
    }
  });

  // Download All
  zipBtn.addEventListener('click', async () => {
    const JSZip = window.JSZip;
    const zip = new JSZip();
    const folder = zip.folder('christmas-tree-gallery');

    zipBtn.disabled = true;
    zipBtn.textContent = 'Preparing...';

    let successCount = 0;
    let failCount = 0;

    for (const img of images) {
      const url = img.src;

      // Only allow downloading same-origin images
      if (!url.startsWith(window.location.origin) && !url.startsWith('images/')) {
        failCount++;
        continue;
      }

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Fetch failed');

        const blob = await res.blob();
        const filename = sanitizeFilename(img.alt || 'image') + getExtension(url);

        folder.file(filename, blob);
        successCount++;
      } catch (err) {
        console.warn(`Failed to fetch ${url}: ${err}`);
        failCount++;
      }
    }

    if (successCount === 0) {
      alert('Download failed. Images may be blocked by CORS.');
    } else {
      try {
        const blob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'christmas-tree-gallery.zip';
        document.body.appendChild(link);
        link.click();
        link.remove();

        alert(`Download complete! ${successCount} image(s) downloaded. ${failCount} skipped.`);
      } catch (err) {
        alert('Error generating ZIP: ' + err.message);
      }
    }

    zipBtn.disabled = false;
    zipBtn.textContent = 'Download All';
  });
});
