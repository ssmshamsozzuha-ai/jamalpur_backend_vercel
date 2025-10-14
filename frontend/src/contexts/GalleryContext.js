import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import galleryService from '../utils/galleryService';

const GalleryContext = createContext();

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};

export const GalleryProvider = ({ children }) => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    // Load gallery images from API with localStorage fallback
    const loadGalleryImages = async () => {
      try {
        setLoading(true);
        const images = await galleryService.getGalleryImages();
        setGalleryImages(images);
      } catch (error) {
        console.error('Error loading gallery images:', error);
        setGalleryImages([]);
      } finally {
        setLoading(false);
      }
    };

    loadGalleryImages();
  }, []);

  // WebSocket event listeners for real-time updates
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleGalleryImageCreated = (newImage) => {
      console.log('🖼️ New gallery image created:', newImage);
      setGalleryImages(prevImages => [newImage, ...prevImages]);
    };

    const handleGalleryImageUpdated = (updatedImage) => {
      console.log('✏️ Gallery image updated:', updatedImage);
      setGalleryImages(prevImages => 
        prevImages.map(image => 
          image.id === updatedImage.id || image._id === updatedImage.id
            ? { ...image, ...updatedImage }
            : image
        )
      );
    };

    const handleGalleryImageDeleted = (deletedImage) => {
      console.log('🗑️ Gallery image deleted:', deletedImage);
      setGalleryImages(prevImages => 
        prevImages.filter(image => 
          image.id !== deletedImage.id && image._id !== deletedImage.id
        )
      );
    };

    // Register event listeners
    socket.on('gallery-image-created', handleGalleryImageCreated);
    socket.on('gallery-image-updated', handleGalleryImageUpdated);
    socket.on('gallery-image-deleted', handleGalleryImageDeleted);

    // Cleanup event listeners
    return () => {
      socket.off('gallery-image-created', handleGalleryImageCreated);
      socket.off('gallery-image-updated', handleGalleryImageUpdated);
      socket.off('gallery-image-deleted', handleGalleryImageDeleted);
    };
  }, [socket, isConnected]);

  const refreshGallery = async () => {
    try {
      setLoading(true);
      const images = await galleryService.getGalleryImages();
      setGalleryImages(images);
    } catch (error) {
      console.error('Error refreshing gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    galleryImages,
    loading,
    refreshGallery
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};
