// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  const zipBtn = document.getElementById('downloadAll');
  const images = document.querySelectorAll('.tree-gallery img');
  const imagePreview = document.getElementById('imagePreview');
  const previewImage = imagePreview.querySelector('img');
  const closeBtn = document.getElementById('closePreview');

  // === Show preview on single click, download on double click ===
  images.forEach(img => {
    img.style.cursor = 'pointer';

    // Single click: show preview
    img.addEventListener('click', () => {
      previewImage.src = img.src;
      previewImage.alt = img.alt || 'Preview Image';
      imagePreview.classList.remove('hidden');
    });

    // Double click: download image
    img.addEventListener('dblclick', () => {
      downloadImage(img.src, img.alt || 'image');
    });
  });

  // Close preview handlers
  closeBtn.addEventListener('click', () => {
    imagePreview.classList.add('hidden');
    previewImage.src = '';
    previewImage.alt = '';
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


  // Download All Button functionality
  zipBtn.addEventListener('click', async () => {
    zipBtn.disabled = true;
    zipBtn.textContent = 'Preparing...';

    const JSZip = window.JSZip;
    const zip = new JSZip();
    const folder = zip.folder('christmas-tree-gallery');

    try {
      for (const img of images) {
        const url = img.src;
        const filename = sanitizeFilename(img.alt || 'image') + getExtension(url);

        const blob = await fetch(url).then(res => {
          if (!res.ok) throw new Error(Failed to fetch ${url});
          return res.blob();
        });

        folder.file(filename, blob);
      }

      const content = await zip.generateAsync({ type: 'blob' });

      // Trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'christmas-tree-gallery.zip';
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      alert('Error downloading images: ' + error.message);
    } finally {
      zipBtn.disabled = false;
      zipBtn.textContent = 'Download All';
    }
  });

  // Helper to download a single image
  function downloadImage(url, name) {
    const a = document.createElement('a');
    a.href = url;
    a.download = sanitizeFilename(name) + getExtension(url);
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // Helper to get extension from URL
  function getExtension(url) {
    const match = url.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$)/i);
    return match ? match[0] : '.jpg';
  }

  // Sanitize filename to remove invalid characters
  function sanitizeFilename(name) {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }
});

  if (successCount === 0) {
    alert('Download failed. All image fetches failed due to CORS or network errors.');
  } else {
    try {
      const content = await zip.generateAsync({ type: 'blob' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'christmas-tree-gallery.zip';
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert(`Download ready! ${successCount} image(s) downloaded. ${failCount} failed.`);
    } catch (zipError) {
      alert('Error generating ZIP: ' + zipError.message);
    }
  }

  zipBtn.disabled = false;
  zipBtn.textContent = 'Download All';
});


