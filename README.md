# Lin Bokai - Resume Website

A modern, responsive, and interactive resume website built with HTML, CSS, and JavaScript. This project creates a professional online presence that can be easily deployed on GitHub Pages.

## 🌟 Features

- **Responsive Design**: Looks great on desktop, tablet, and mobile devices
- **Interactive Elements**: 
  - Double-click text to edit content
  - Click profile image to upload a new photo
  - Copy contact information by clicking
  - Smooth scrolling animations
- **Modern UI**: Clean, professional design with gradient backgrounds and hover effects
- **Print-Friendly**: Optimized for PDF export and printing
- **Customizable**: Easy to modify colors, content, and layout

## 🚀 Live Demo

Visit the live website: [Your GitHub Pages URL will be here]

## 📁 Project Structure

```
resume-website/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript for interactivity
├── README.md           # This file
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions for deployment (optional)
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox, Grid, and animations
- **JavaScript**: Interactive features and DOM manipulation
- **Font Awesome**: Icons for contact information
- **Google Fonts**: Inter font family for typography

## 📋 Setup Instructions

### Option 1: Direct GitHub Pages Deployment

1. **Fork or Clone this repository**
   ```bash
   git clone https://github.com/yourusername/resume-website.git
   cd resume-website
   ```

2. **Customize the content**
   - Edit `index.html` to update personal information
   - Modify `styles.css` to change colors and styling
   - Update `script.js` for additional functionality

3. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial resume website"
   git push origin main
   ```

4. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll down to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

5. **Access your website**
   - Your site will be available at: `https://yourusername.github.io/repository-name`

### Option 2: Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/resume-website.git
   cd resume-website
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

## ✏️ Customization Guide

### Personal Information
Edit the following sections in `index.html`:

1. **Header Section** (lines 15-45):
   - Name and title
   - Contact information
   - Profile image

2. **About Section** (lines 48-55):
   - Personal description

3. **Experience Section** (lines 58-110):
   - Job titles, companies, and descriptions

4. **Education Section** (lines 113-128):
   - Degrees and institutions

5. **Skills Section** (lines 131-170):
   - Technical skills organized by category

6. **Projects Section** (lines 173-220):
   - Featured projects and technologies

### Styling
Modify `styles.css` to change:

- **Colors**: Update CSS custom properties at the top
- **Fonts**: Change the Google Fonts import and font-family declarations
- **Layout**: Adjust grid and flexbox properties
- **Animations**: Modify keyframes and transitions

### Interactive Features
Enhance `script.js` to add:

- **New animations**: Extend the Intersection Observer
- **Additional editing**: Make more elements editable
- **Data persistence**: Expand localStorage usage
- **Social sharing**: Add share buttons

## 🎨 Color Scheme

The default color scheme uses:
- **Primary**: #4A90E2 (Blue)
- **Secondary**: #667eea to #764ba2 (Gradient)
- **Accent Colors**: 
  - Experience: #4A90E2 (Blue)
  - Education: #27ae60 (Green)
  - Skills: #e74c3c (Red)
  - Projects: #9b59b6 (Purple)

## 📱 Responsive Breakpoints

- **Desktop**: 1000px and above
- **Tablet**: 768px to 999px
- **Mobile**: 480px to 767px
- **Small Mobile**: Below 480px

## ⌨️ Keyboard Shortcuts

- **Ctrl + P**: Print/Export to PDF
- **Ctrl + Shift + E**: Export to PDF
- **Ctrl + Shift + D**: Toggle dark mode (experimental)

## 🔧 Interactive Features

### Editable Content
- Double-click on most text elements to edit them
- Changes are saved to localStorage
- Perfect for quick customizations

### Profile Image Upload
- Click on the profile image to upload a new photo
- Supports common image formats (JPG, PNG, GIF)
- Image is saved locally in the browser

### Contact Information
- Click on email or phone to copy to clipboard
- Automatic notification when copied

## 📄 Print Optimization

The website is optimized for printing and PDF export:
- Clean layout without background gradients
- Proper page breaks
- High contrast text
- Compact spacing

## 🚀 Deployment Options

### GitHub Pages (Recommended)
- Free hosting
- Custom domain support
- Automatic HTTPS
- Easy updates via Git

### Alternative Platforms
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **Firebase Hosting**: Google's hosting platform
- **Surge.sh**: Simple static hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

If you have any questions or need help customizing the resume:

- Create an issue in this repository
- Check the documentation above
- Review the code comments for guidance

## 🎯 Future Enhancements

Planned features for future versions:
- [ ] Dark/Light theme toggle
- [ ] Multiple language support
- [ ] Contact form integration
- [ ] Blog section
- [ ] Analytics integration
- [ ] SEO optimization
- [ ] Progressive Web App (PWA) features

---

**Made with ❤️ for professional developers**

Remember to star ⭐ this repository if you found it helpful!
