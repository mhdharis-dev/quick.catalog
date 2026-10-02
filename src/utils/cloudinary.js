// Cloudinary Image Upload Service
// Cloud Name: dpzku41n7
// Upload Preset: quick.cotalog

const CLOUD_NAME = 'dpzku41n7';
const UPLOAD_PRESET = 'quick.cotalog';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Uploads an image file or base64 string directly to Cloudinary using unsigned preset.
 * @param {File|Blob|string} fileOrDataUrl - The image to upload
 * @param {function} [onProgress] - Optional progress callback (0-100)
 * @returns {Promise<{ url: string, publicId: string, format: string, width: number, height: number }>}
 */
export async function uploadToCloudinary(fileOrDataUrl, onProgress) {
  if (!fileOrDataUrl) {
    throw new Error('No file provided for upload');
  }

  const formData = new FormData();
  formData.append('file', fileOrDataUrl);
  formData.append('upload_preset', UPLOAD_PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', UPLOAD_URL, true);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          resolve({
            url: res.secure_url || res.url,
            publicId: res.public_id,
            format: res.format,
            width: res.width,
            height: res.height,
            bytes: res.bytes
          });
        } catch (err) {
          reject(new Error('Invalid response from Cloudinary'));
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          reject(new Error(errRes.error?.message || `Upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during Cloudinary upload'));
    };

    xhr.send(formData);
  });
}
