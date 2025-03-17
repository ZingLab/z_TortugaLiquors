// create-page.js - Script to generate new product pages from template
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create interface for command line input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask questions to gather page details
async function promptUser() {
  return new Promise((resolve) => {
    const pageData = {};
    
    rl.question('Product/page name: ', (answer) => {
      pageData.name = answer;
      
      rl.question('Page title (for SEO): ', (answer) => {
        pageData.title = answer;
        
        rl.question('Page description (for SEO): ', (answer) => {
          pageData.description = answer;
          
          rl.question('Page headline: ', (answer) => {
            pageData.headline = answer;
            
            rl.question('Page tagline: ', (answer) => {
              pageData.tagline = answer;
              
              rl.question('Intro section heading: ', (answer) => {
                pageData.introHeading = answer;
                
                rl.question('Mid section heading: ', (answer) => {
                  pageData.midHeading = answer;
                  
                  rl.question('Closing section heading: ', (answer) => {
                    pageData.closeHeading = answer;
                    
                    rl.question('Call to action text: ', (answer) => {
                      pageData.ctaText = answer;
                      
                      rl.question('Output filename (without extension): ', (answer) => {
                        pageData.filename = answer;
                        rl.close();
                        resolve(pageData);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

// Create the new page from template
async function createPage() {
  try {
    // Get user input
    const pageData = await promptUser();
    
    // Read template file
    const templatePath = path.join(__dirname, 'template.html');
    let templateContent = fs.readFileSync(templatePath, 'utf8');
    
    // Replace placeholders with user input
    templateContent = templateContent
      .replace(/PAGE_TITLE/g, pageData.title)
      .replace(/PAGE_DESCRIPTION/g, pageData.description)
      .replace(/PAGE_HEADLINE/g, pageData.headline)
      .replace(/PAGE_TAGLINE/g, pageData.tagline)
      .replace(/INTRO_HEADING/g, pageData.introHeading)
      .replace(/MID_HEADING/g, pageData.midHeading)
      .replace(/CLOSE_HEADING/g, pageData.closeHeading)
      .replace(/CTA_TEXT/g, pageData.ctaText);
    
    // Write to new file
    const outputPath = path.join(__dirname, `${pageData.filename}.html`);
    fs.writeFileSync(outputPath, templateContent);
    
    console.log(`\nSuccess! New page created at: ${outputPath}`);
    console.log('\nNext steps:');
    console.log('1. Add your product-specific content to article sections');
    console.log('2. Add affiliate products to adspace sections');
    console.log('3. Update the hero image if needed');
    
  } catch (error) {
    console.error('Error creating page:', error);
  }
}

// Run the script
createPage();
