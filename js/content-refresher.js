// updated-content-refresher.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SITE_DIR = 'path/to/your/github/pages/repo';
const SECTIONS_TO_REFRESH = ['article-intro', 'article-mid', 'article-close'];

// This maps section IDs to appropriate instructions for GitHub Copilot
const COPILOT_INSTRUCTIONS = {
  'article-intro': 'Rephrase this introduction paragraph to be more engaging and SEO-friendly. Keep key product names and maintain the same general meaning but make it sound fresh.',
  'article-mid': 'Rewrite this middle section to include more benefits and details. Maintain keywords but restructure sentences completely.',
  'article-close': 'Refresh this closing paragraph with a stronger call to action. Keep affiliate link contexts intact but make the pitch more compelling.'
};

// Find all HTML files in the repository
function findHtmlFiles(directory) {
  let results = [];
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results = results.concat(findHtmlFiles(filePath));
    } else if (path.extname(file) === '.html' && 
               !file.includes('navbar.html') && 
               !file.includes('footer.html') && 
               !file.includes('template.html')) {
      results.push(filePath);
    }
  }
  
  return results;
}

// Extract content from specific section
function extractSection(content, sectionId) {
  const regex = new RegExp(`<div id="${sectionId}">[\\s\\S]*?<h2[^>]*>(.*?)<\\/h2>([\\s\\S]*?)<\\/div>`, 's');
  const match = content.match(regex);
  
  if (match && match.length >= 3) {
    return {
      heading: match[1].trim(),
      content: match[2].trim()
    };
  }
  return null;
}

// Update content with refreshed section while preserving heading
function updateSection(content, sectionId, heading, newContent) {
  const regex = new RegExp(`(<div id="${sectionId}">[\\s\\S]*?<h2[^>]*>.*?<\\/h2>)([\\s\\S]*?)(<\\/div>)`, 's');
  return content.replace(regex, `$1\n${newContent}\n$3`);
}

// Use GitHub Copilot to refresh content
function refreshWithCopilot(originalContent, sectionId, productName) {
  // Create a temporary file with instructions and content
  const tempFile = `temp_${sectionId}_${Date.now()}.txt`;
  
  // Include product name in the instructions
  const customizedInstructions = COPILOT_INSTRUCTIONS[sectionId].replace(
    'this', 
    `this ${productName}`
  );
  
  fs.writeFileSync(tempFile, `
// ${customizedInstructions}
// ORIGINAL CONTENT:
/*
${originalContent}
*/

// REFRESHED CONTENT:
`);

  // Open the file with your preferred editor that has Copilot
  console.log(`Opening ${tempFile} for Copilot suggestions...`);
  console.log(`Please accept Copilot's suggestions and save the file.`);
  
  // This will open VSCode - you'll need to manually accept Copilot suggestions
  execSync(`code ${tempFile}`);
  
  // Wait for user to edit and save
  console.log('Press Enter when you have saved the file with fresh content...');
  require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  }).question('', () => {});
  
  // Read the updated content
  const fileContent = fs.readFileSync(tempFile, 'utf8');
  const refreshedContent = fileContent.split('// REFRESHED CONTENT:')[1].trim();
  
  // Clean up
  fs.unlinkSync(tempFile);
  
  return refreshedContent;
}

// Extract product name from file content or path
function extractProductName(content, filePath) {
  // Try to extract from h1 in the hero section
  const heroMatch = content.match(/<section class="hero">[\\s\\S]*?<h1>(.*?)<\/h1>/);
  if (heroMatch && heroMatch[1]) {
    return heroMatch[1].trim();
  }
  
  // Try to extract from title
  const titleMatch = content.match(/<title>(.*?)(?:\s*\|.*?)?<\/title>/);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }
  
  // Fall back to filename
  const filename = path.basename(filePath, '.html');
  return filename.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Date tracking for refreshes
function trackRefreshDate(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const today = new Date().toISOString().split('T')[0];
  
  // Check if we need to add the comment or update existing
  if (content.includes('<!-- Last refreshed:')) {
    return content.replace(
      /<!-- Last refreshed: .*? -->/,
      `<!-- Last refreshed: ${today} -->`
    );
  } else {
    return content.replace(
      /<html lang="en">/,
      `<html lang="en">\n<!-- Last refreshed: ${today} -->`
    );
  }
}

// Main function
async function refreshContent() {
  const htmlFiles = findHtmlFiles(SITE_DIR);
  console.log(`Found ${htmlFiles.length} HTML files to process.`);
  
  // Allow user to select files to process
  console.log('\nWhich files would you like to refresh?');
  console.log('1. All files');
  console.log('2. Files not refreshed in the last 60 days');
  console.log('3. Specific files');
  
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('Enter your choice (1-3): ', async (choice) => {
    readline.close();
    
    let filesToProcess = [];
    
    if (choice === '1') {
      filesToProcess = htmlFiles;
    } else if (choice === '2') {
      // Process files based on the last refresh date
      filesToProcess = htmlFiles.filter(file => {
        const content = fs.readFileSync(file, 'utf8');
        const match = content.match(/<!-- Last refreshed: (.*?) -->/);
        
        if (!match) return true; // No refresh date found, include it
        
        const lastRefresh = new Date(match[1]);
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        
        return lastRefresh < sixtyDaysAgo;
      });
    } else if (choice === '3') {
      // Let user select specific files
      console.log('\nAvailable files:');
      htmlFiles.forEach((file, index) => {
        console.log(`${index + 1}. ${path.basename(file)}`);
      });
      
      // New readline interface since we closed the previous one
      const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        rl.question('Enter file numbers separated by commas (e.g., 1,3,5): ', resolve);
      });
      rl.close();
      
      const selectedIndices = answer.split(',').map(n => parseInt(n.trim()) - 1);
      filesToProcess = selectedIndices.map(index => htmlFiles[index]);
    }
    
    console.log(`\nProcessing ${filesToProcess.length} files for content refresh.`);
    
    // Process selected files
    for (const file of filesToProcess) {
      console.log(`\nProcessing ${path.basename(file)}...`);
      let content = fs.readFileSync(file, 'utf8');
      const productName = extractProductName(content, file);
      
      let updated = false;
      
      for (const sectionId of SECTIONS_TO_REFRESH) {
        const section = extractSection(content, sectionId);
        
        if (section) {
          console.log(`Refreshing ${sectionId} section...`);
          const refreshedContent = refreshWithCopilot(section.content, sectionId, productName);
          content = updateSection(content, sectionId, section.heading, refreshedContent);
          updated = true;
        }
      }
      
      if (updated) {
        // Update refresh date tracking
        content = trackRefreshDate(file);
        fs.writeFileSync(file, content);
        console.log(`Updated ${path.basename(file)}`);
      } else {
        console.log(`No refreshable sections found in ${path.basename(file)}`);
      }
    }
    
    console.log('\nContent refresh complete!');
  });
}

refreshContent().catch(console.error);