const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jamalpur:4hwq02K1y0cc811Y@jamalpur-cluster.pmjnmjc.mongodb.net/Jamalpur-chamber?retryWrites=true&w=majority&appName=jamalpur-cluster';

// Form Submission Schema
const formSubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  category: { type: String, default: 'general' },
  address: { type: String, default: '' },
  pdfFile: {
    filename: String,
    originalName: String,
    path: String,
    size: Number
  },
  submittedAt: { type: Date, default: Date.now }
});

const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

async function checkFormSubmissions() {
  try {
    console.log('🔍 Checking Form Submissions in MongoDB...\n');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check form submissions
    const submissions = await FormSubmission.find().sort({ submittedAt: -1 });
    console.log(`📋 Total Form Submissions: ${submissions.length}`);
    
    if (submissions.length > 0) {
      console.log('\n📝 Recent Form Submissions:');
      submissions.forEach((submission, index) => {
        console.log(`   ${index + 1}. ${submission.name} (${submission.email}) - ${submission.submittedAt.toISOString()}`);
        if (submission.pdfFile) {
          console.log(`      📄 PDF: ${submission.pdfFile.originalName}`);
        }
      });
    } else {
      console.log('📝 No form submissions found in database');
    }

    // Check submissions with PDF files
    const submissionsWithPDF = await FormSubmission.find({ 'pdfFile.filename': { $exists: true } });
    console.log(`\n📄 Submissions with PDF files: ${submissionsWithPDF.length}`);

    console.log('\n✅ Form submissions check completed!');

  } catch (error) {
    console.error('❌ Error checking form submissions:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the check
checkFormSubmissions();
