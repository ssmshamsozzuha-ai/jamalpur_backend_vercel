// Gallery service to handle both API and localStorage fallback
class GalleryService {
  constructor() {
    this.apiBaseUrl = process.env.REACT_APP_API_URL || '/api';
    this.cacheKey = 'galleryImages';
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Get gallery images with API fallback to localStorage
  async getGalleryImages() {
    try {
      console.log('🌐 Trying API first...');
      // Try API first
      const response = await fetch(`${this.apiBaseUrl}/gallery`);
      if (response.ok) {
        const images = await response.json();
        console.log('✅ API response:', images);
        // Cache successful API response
        this.setCache(images);
        return images;
      } else {
        console.log('❌ API response not ok:', response.status);
      }
    } catch (error) {
      console.log('❌ API not available, using localStorage fallback:', error);
    }

    // Fallback to localStorage
    console.log('💾 Using localStorage fallback...');
    const cachedImages = this.getFromCache();
    console.log('📦 Cached images:', cachedImages);
    return cachedImages;
  }

  // Upload gallery image to API
  async uploadImage(formData) {
    const token = localStorage.getItem('token');
    
    console.log('📤 Uploading image to API...');
    const response = await fetch(`${this.apiBaseUrl}/gallery/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Upload failed:', errorData);
      throw new Error(errorData.message || 'Failed to upload image');
    }

    const result = await response.json();
    console.log('✅ Upload successful:', result);
    
    // Clear cache to force refresh
    this.clearCache();
    console.log('🗑️ Cache cleared');
    
    return result;
  }

  // Delete gallery image from API
  async deleteImage(imageId) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${this.apiBaseUrl}/gallery/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete image');
    }

    const result = await response.json();
    
    // Clear cache to force refresh
    this.clearCache();
    
    return result;
  }

  // Cache management
  setCache(images) {
    const cacheData = {
      data: images,
      timestamp: Date.now()
    };
    localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
  }

  getFromCache() {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (cached) {
        const cacheData = JSON.parse(cached);
        // Check if cache is still valid and data is an array
        if (Date.now() - cacheData.timestamp < this.cacheTimeout && Array.isArray(cacheData.data)) {
          return cacheData.data;
        }
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
    return [];
  }

  // Clear cache
  clearCache() {
    localStorage.removeItem(this.cacheKey);
  }

  // Fallback method for localStorage-only operations (when API is not available)
  saveToLocalStorage(image) {
    try {
      const existingImages = this.getFromCache();
      // Ensure existingImages is always an array
      const imagesArray = Array.isArray(existingImages) ? existingImages : [];
      const newImages = [image, ...imagesArray];
      this.setCache(newImages);
      return newImages;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw error;
    }
  }

  updateInLocalStorage(imageId, updatedImage) {
    try {
      const existingImages = this.getFromCache();
      // Ensure existingImages is always an array
      const imagesArray = Array.isArray(existingImages) ? existingImages : [];
      const updatedImages = imagesArray.map(img => 
        img.id === imageId ? updatedImage : img
      );
      this.setCache(updatedImages);
      return updatedImages;
    } catch (error) {
      console.error('Error updating in localStorage:', error);
      throw error;
    }
  }

  deleteFromLocalStorage(imageId) {
    try {
      const existingImages = this.getFromCache();
      // Ensure existingImages is always an array
      const imagesArray = Array.isArray(existingImages) ? existingImages : [];
      const updatedImages = imagesArray.filter(img => img.id !== imageId);
      this.setCache(updatedImages);
      return updatedImages;
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
      throw error;
    }
  }
}

export default new GalleryService();
