#!/bin/bash

# Pages to update
pages=(
    "calculator.html"
    "privacy.html"
    "terms.html"
    "periochamp.html"
    "signup.html"
    "blog/best-ai-dental-companion-2025.html"
    "blog/dental-practice-ai-assistant-guide.html"
    "blog/patient-compliance-dental-apps.html"
)

# Path to blog/index.html for reference
INDEX_HTML="/root/.openclaw/workspace/perioskoup/landing_doctor/perioskoup_landing_doctor/blog/index.html"

# Function to extract navbar
extract_navbar() {
    sed -n '/<nav id="navbar"/,/<\/nav>/p' "$INDEX_HTML"
}

# Function to extract footer
extract_footer() {
    sed -n '/<footer/,/<\/footer>/p' "$INDEX_HTML"
}

# Function to extract navbar scroll script
extract_navbar_script() {
    sed -n '/<script>\s*\/\/ Navbar scroll effect/,/<\/script>/p' "$INDEX_HTML"
}

# Process each page
for page in "${pages[@]}"; do
    echo "Processing $page..."
    
    # Full path to the page
    FULL_PATH="/root/.openclaw/workspace/perioskoup/landing_doctor/perioskoup_landing_doctor/$page"
    
    # Temporary file
    TEMP_FILE=$(mktemp)
    
    # Extract navbar and footer from template
    NAVBAR=$(extract_navbar)
    FOOTER=$(extract_footer)
    NAVBAR_SCRIPT=$(extract_navbar_script)
    
    # Use sed to modify the page
    sed -E '
        # Add background gradient to body tag
        s/<body([^>]*)>/<body\1 style="background: linear-gradient(180deg, #234966 0%, #12222d 50%, #0a171e 100%);">/
        
        # Remove existing navbar
        /<nav /,/<\/nav>/d
        
        # Remove existing footer 
        /<footer/,/<\/footer>/d
        
        # Add new navbar just after body tag 
        /^<body/a '"$NAVBAR"'
        
        # Add new footer before ending body tag
        s/<\/body>/ '"$FOOTER"'\n\n'"$NAVBAR_SCRIPT"'\n\n<\/body>/
        
        # Replace text-nebula with text-white 
        s/text-nebula(-\/60)?/text-white\1/g
        
        # Replace bg-white or bg-rice with bg-white/5 
        s/(bg-white|bg-rice)/bg-white\/5 border-white\/10/g
    ' "$FULL_PATH" > "$TEMP_FILE"
    
    # Replace the original file with the modified version
    mv "$TEMP_FILE" "$FULL_PATH"
    
    echo "Updated $page"
done

echo "All pages updated successfully."