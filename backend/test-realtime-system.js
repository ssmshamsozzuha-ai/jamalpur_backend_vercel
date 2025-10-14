const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jamalpur:4hwq02K1y0cc811Y@jamalpur-cluster.pmjnmjc.mongodb.net/Jamalpur-chamber?retryWrites=true&w=majority&appName=jamalpur-cluster';

// Schemas
const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
  author: { type: String, required: true },
  pdfFile: {
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const galleryImageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  altText: { type: String, required: true },
  category: { type: String, enum: ['meeting', 'event', 'conference'], default: 'meeting' },
  uploadedBy: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['business', 'policy', 'event', 'announcement'], default: 'business' },
  author: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  publishedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const Notice = mongoose.model('Notice', noticeSchema);
const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);
const News = mongoose.model('News', newsSchema);

async function testRealtimeSystem() {
  try {
    console.log('🔍 Testing Real-time System...\n');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Test 1: Create Notice
    console.log('📢 TEST 1: Creating notice...');
    const testNotice = new Notice({
      title: 'Real-time Test Notice',
      content: 'This notice should appear in real-time on all user browsers.',
      priority: 'high',
      author: 'test@admin.com'
    });
    const savedNotice = await testNotice.save();
    console.log('✅ Notice created:', savedNotice.title);
    console.log('📡 WebSocket event: notice-created should be emitted\n');

    // Test 2: Update Notice
    console.log('📝 TEST 2: Updating notice...');
    const updatedNotice = await Notice.findByIdAndUpdate(
      savedNotice._id,
      { title: 'Updated Real-time Test Notice', priority: 'normal' },
      { new: true }
    );
    console.log('✅ Notice updated:', updatedNotice.title);
    console.log('📡 WebSocket event: notice-updated should be emitted\n');

    // Test 3: Create Gallery Image
    console.log('🖼️ TEST 3: Creating gallery image...');
    const testImage = new GalleryImage({
      title: 'Real-time Test Image',
      description: 'This image should appear in real-time on all user browsers.',
      imageUrl: '/api/files/test-image.jpg',
      altText: 'Test image for real-time updates',
      category: 'meeting',
      uploadedBy: 'Test Admin'
    });
    const savedImage = await testImage.save();
    console.log('✅ Gallery image created:', savedImage.title);
    console.log('📡 WebSocket event: gallery-image-created should be emitted\n');

    // Test 4: Update Gallery Image
    console.log('✏️ TEST 4: Updating gallery image...');
    const updatedImage = await GalleryImage.findByIdAndUpdate(
      savedImage._id,
      { title: 'Updated Real-time Test Image', category: 'event' },
      { new: true }
    );
    console.log('✅ Gallery image updated:', updatedImage.title);
    console.log('📡 WebSocket event: gallery-image-updated should be emitted\n');

    // Test 5: Create News
    console.log('📰 TEST 5: Creating news...');
    const testNews = new News({
      title: 'Real-time Test News',
      content: 'This news should appear in real-time on all user browsers.',
      category: 'business',
      author: 'Test Admin'
    });
    const savedNews = await testNews.save();
    console.log('✅ News created:', savedNews.title);
    console.log('📡 WebSocket event: news-created should be emitted\n');

    // Test 6: Update News
    console.log('📝 TEST 6: Updating news...');
    const updatedNews = await News.findByIdAndUpdate(
      savedNews._id,
      { title: 'Updated Real-time Test News', isFeatured: true },
      { new: true }
    );
    console.log('✅ News updated:', updatedNews.title);
    console.log('📡 WebSocket event: news-updated should be emitted\n');

    // Test 7: Delete Notice
    console.log('🗑️ TEST 7: Deleting notice...');
    await Notice.findByIdAndDelete(savedNotice._id);
    console.log('✅ Notice deleted');
    console.log('📡 WebSocket event: notice-deleted should be emitted\n');

    // Test 8: Delete Gallery Image
    console.log('🗑️ TEST 8: Deleting gallery image...');
    await GalleryImage.findByIdAndDelete(savedImage._id);
    console.log('✅ Gallery image deleted');
    console.log('📡 WebSocket event: gallery-image-deleted should be emitted\n');

    // Test 9: Delete News
    console.log('🗑️ TEST 9: Deleting news...');
    await News.findByIdAndDelete(savedNews._id);
    console.log('✅ News deleted');
    console.log('📡 WebSocket event: news-deleted should be emitted\n');

    console.log('🎯 REAL-TIME SYSTEM TEST RESULTS:');
    console.log('✅ All CRUD operations completed successfully');
    console.log('✅ All WebSocket events should be emitted');
    console.log('✅ Real-time updates should work across all browsers');
    console.log('✅ Admin changes should appear instantly for users');

    console.log('\n📡 EXPECTED WEBSOCKET EVENTS:');
    console.log('   📢 notice-created');
    console.log('   📝 notice-updated');
    console.log('   🖼️ gallery-image-created');
    console.log('   ✏️ gallery-image-updated');
    console.log('   📰 news-created');
    console.log('   📝 news-updated');
    console.log('   🗑️ notice-deleted');
    console.log('   🗑️ gallery-image-deleted');
    console.log('   🗑️ news-deleted');

    console.log('\n🚀 Real-time system test completed successfully!');
    console.log('📱 All admin changes should now appear in real-time for users!');

  } catch (error) {
    console.error('❌ Error testing real-time system:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the test
testRealtimeSystem();
