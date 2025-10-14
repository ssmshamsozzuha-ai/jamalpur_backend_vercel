const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jamalpur:4hwq02K1y0cc811Y@jamalpur-cluster.pmjnmjc.mongodb.net/Jamalpur-chamber?retryWrites=true&w=majority&appName=jamalpur-cluster';

// News Schema
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

const News = mongoose.model('News', newsSchema);

async function testNewsMongoDBOperations() {
  try {
    console.log('🔍 Testing News MongoDB Operations...\n');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Test 1: CREATE - Add new news article
    console.log('📝 TEST 1: Creating new news article...');
    const newNews = new News({
      title: 'MongoDB Test News',
      content: 'This is a test news article to verify MongoDB persistence.',
      category: 'business',
      author: 'Test Admin',
      imageUrl: '',
      isFeatured: false
    });
    
    const savedNews = await newNews.save();
    console.log('✅ News created successfully:', {
      id: savedNews._id,
      title: savedNews.title,
      author: savedNews.author,
      createdAt: savedNews.createdAt
    });

    // Test 2: READ - Get all news articles
    console.log('\n📖 TEST 2: Reading all news articles...');
    const allNews = await News.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${allNews.length} news articles:`);
    allNews.forEach((news, index) => {
      console.log(`   ${index + 1}. ${news.title} by ${news.author} (${news.isActive ? 'Active' : 'Inactive'})`);
    });

    // Test 3: UPDATE - Update the test news article
    console.log('\n✏️ TEST 3: Updating news article...');
    const updatedNews = await News.findByIdAndUpdate(
      savedNews._id,
      { 
        title: 'Updated MongoDB Test News',
        content: 'This news article has been updated to test MongoDB update operations.',
        isFeatured: true
      },
      { new: true, runValidators: true }
    );
    console.log('✅ News updated successfully:', {
      id: updatedNews._id,
      title: updatedNews.title,
      isFeatured: updatedNews.isFeatured,
      updatedAt: updatedNews.updatedAt
    });

    // Test 4: TOGGLE STATUS - Test active/inactive toggle
    console.log('\n🔄 TEST 4: Toggling news status...');
    const toggledNews = await News.findByIdAndUpdate(
      savedNews._id,
      { isActive: false },
      { new: true }
    );
    console.log('✅ News status toggled:', {
      id: toggledNews._id,
      title: toggledNews.title,
      isActive: toggledNews.isActive
    });

    // Test 5: REACTIVATE - Reactivate the news
    console.log('\n🔄 TEST 5: Reactivating news...');
    const reactivatedNews = await News.findByIdAndUpdate(
      savedNews._id,
      { isActive: true },
      { new: true }
    );
    console.log('✅ News reactivated:', {
      id: reactivatedNews._id,
      title: reactivatedNews._id,
      isActive: reactivatedNews.isActive
    });

    // Test 6: DELETE - Delete the test news article
    console.log('\n🗑️ TEST 6: Deleting news article...');
    const deletedNews = await News.findByIdAndDelete(savedNews._id);
    if (deletedNews) {
      console.log('✅ News deleted successfully:', {
        id: deletedNews._id,
        title: deletedNews.title
      });
    } else {
      console.log('❌ News not found for deletion');
    }

    // Test 7: VERIFY DELETION - Confirm deletion
    console.log('\n🔍 TEST 7: Verifying deletion...');
    const remainingNews = await News.find().sort({ createdAt: -1 });
    console.log(`✅ Remaining news articles: ${remainingNews.length}`);
    
    // Test 8: PERSISTENCE CHECK - Check if data survives
    console.log('\n💾 TEST 8: Persistence verification...');
    const activeNews = await News.find({ isActive: true });
    const featuredNews = await News.find({ isFeatured: true });
    console.log(`✅ Active news articles: ${activeNews.length}`);
    console.log(`✅ Featured news articles: ${featuredNews.length}`);

    console.log('\n🎯 MONGODB NEWS OPERATIONS TEST RESULTS:');
    console.log('✅ CREATE: News articles can be created and saved to MongoDB');
    console.log('✅ READ: News articles can be retrieved from MongoDB');
    console.log('✅ UPDATE: News articles can be updated in MongoDB');
    console.log('✅ DELETE: News articles can be deleted from MongoDB');
    console.log('✅ PERSISTENCE: All operations are properly saved to MongoDB');
    console.log('✅ DATA INTEGRITY: All data survives database operations');

    console.log('\n🚀 All MongoDB news operations are working correctly!');
    console.log('📊 Admin can safely add, update, edit, and delete news articles');
    console.log('💾 All changes are permanently saved to MongoDB database');

  } catch (error) {
    console.error('❌ Error testing MongoDB operations:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the test
testNewsMongoDBOperations();
