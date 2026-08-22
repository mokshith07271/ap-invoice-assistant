export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function renderFileUpload(containerId, options) {
  const container = document.querySelector(containerId);
  if (!container) return;

  const {
    accept = '*/*',
    label = 'Drop your file here',
    icon = '📄',
    formats = '',
    onFileSelected
  } = options;

  container.innerHTML = '';
  container.className = 'upload-container';

  const zone = document.createElement('div');
  zone.className = 'upload-zone';
  
  const iconEl = document.createElement('div');
  iconEl.className = 'upload-zone-icon';
  iconEl.textContent = icon;
  
  const textEl = document.createElement('div');
  textEl.className = 'upload-zone-text';
  textEl.textContent = label;
  
  const subTextEl = document.createElement('div');
  subTextEl.className = 'upload-zone-subtext';
  subTextEl.textContent = 'or click to browse files';
  
  const formatsEl = document.createElement('div');
  formatsEl.className = 'upload-zone-formats';
  formatsEl.textContent = formats;

  const inputEl = document.createElement('input');
  inputEl.type = 'file';
  inputEl.accept = accept;
  inputEl.style.display = 'none';

  zone.appendChild(iconEl);
  zone.appendChild(textEl);
  zone.appendChild(subTextEl);
  zone.appendChild(formatsEl);
  zone.appendChild(inputEl);
  container.appendChild(zone);

  const previewContainer = document.createElement('div');
  previewContainer.className = 'upload-file-preview';
  previewContainer.style.display = 'none';
  container.appendChild(previewContainer);

  const handleFile = (file) => {
    if (!file) return;

    const fileInfo = {
      file,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      rawSize: file.size
    };

    zone.style.display = 'none';
    previewContainer.style.display = 'flex';
    
    const fileIcon = file.type.startsWith('image/') ? '🖼️' : '📄';
    
    previewContainer.innerHTML = `
      <div class="preview-icon">${fileIcon}</div>
      <div class="preview-info">
        <div class="preview-name"><strong>${fileInfo.name}</strong></div>
        <div class="preview-meta">${fileInfo.size} • ${fileInfo.type || 'Unknown type'}</div>
      </div>
      <div class="preview-actions">
        <button type="button" class="btn-replace">Replace</button>
        <button type="button" class="btn-remove">Remove</button>
      </div>
    `;

    previewContainer.querySelector('.btn-replace').addEventListener('click', () => {
      inputEl.click();
    });

    previewContainer.querySelector('.btn-remove').addEventListener('click', () => {
      inputEl.value = '';
      previewContainer.style.display = 'none';
      zone.style.display = 'flex';
    });

    if (onFileSelected) {
      onFileSelected(fileInfo);
    }
  };

  zone.addEventListener('click', () => {
    inputEl.click();
  });

  inputEl.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });

  zone.addEventListener('dragenter', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });

  zone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });
}
