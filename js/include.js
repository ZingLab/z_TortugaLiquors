// include.js - Simple component include system
document.addEventListener('DOMContentLoaded', function() {
    // Find all elements with data-include attribute
    const includes = document.querySelectorAll('[data-include]');
    
    // Process each include
    includes.forEach(function(element) {
        const file = element.getAttribute('data-include');
        
        // Fetch the component file
        fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Could not load ${file}`);
                }
                return response.text();
            })
            .then(html => {
                // Replace the element's content with the component
                element.innerHTML = html;
                
                // Execute any scripts in the included HTML
                const scripts = element.querySelectorAll('script');
                scripts.forEach(script => {
                    const newScript = document.createElement('script');
                    if (script.src) {
                        newScript.src = script.src;
                    } else {
                        newScript.textContent = script.textContent;
                    }
                    document.head.appendChild(newScript);
                    script.remove();
                });
            })
            .catch(error => {
                console.error(`Failed to include ${file}:`, error);
                element.innerHTML = `<p>Error loading component: ${file}</p>`;
            });
    });
});
