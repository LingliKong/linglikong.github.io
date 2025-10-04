# Personal Website for Young Professional

A modern, responsive personal website designed for young professionals in research and development who are actively job seeking.

## Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with smooth animations
- **Job-Seeking Focus**: Prominently displays availability status and contact information
- **Research Showcase**: Dedicated sections for research areas, projects, and publications
- **Interactive Elements**: Smooth scrolling, hover effects, and form validation
- **SEO Friendly**: Semantic HTML structure and meta tags

## Sections

1. **Hero/Home**: Eye-catching introduction with availability status
2. **About**: Personal background and core skills
3. **Research**: Research areas and methodologies
4. **Projects**: Portfolio of completed projects with links
5. **Publications**: Academic publications with citation links
6. **Contact**: Multiple contact methods and contact form

## Setup Instructions

1. **Clone or download** this repository
2. **Replace placeholder content** with your actual information:
   - Update `[Your Name]` throughout the files
   - Replace `[your.email@example.com]` with your email
   - Update social media links (LinkedIn, GitHub, Google Scholar)
   - Add your actual research areas, projects, and publications
3. **Add your images and videos** to the `assets/` folder:
   - `profile.jpg` - Your professional headshot (300x300px recommended)
   - `project1.jpg`, `project2.jpg`, `project3.jpg` - Project screenshots
   - `research-video-1.mp4` - Video for first publication (MP4 format)
   - `research-video-1.webm` - Video for first publication (WebM format, optional)
   - `video-poster-1.jpg` - Poster image for the video (shows before play)
   - `graphical-abstract-2.jpg`, `graphical-abstract-3.jpg` - Publication graphical abstracts
   - `software1-demo.mp4`, `software2-demo.mp4`, `software3-demo.mp4` - Software demo videos
   - `software1-poster.jpg`, `software2-poster.jpg`, `software3-poster.jpg` - Video poster images
   - `software1-installer.exe`, `software2-installer.exe` - Windows installers
   - `software1-mac.dmg`, `software2-linux.tar.gz`, `software3-offline.zip` - Platform-specific downloads
   - `resume.pdf` - Your resume/CV
4. **Customize colors and styling** in `styles.css` if desired
5. **Deploy** to your preferred hosting platform

## File Structure

```
├── index.html          # Main HTML file
├── software.html       # Software page
├── styles.css          # All CSS styles
├── script.js           # JavaScript functionality
├── assets/                      # Images, videos and documents
│   ├── profile.jpg              # Your profile photo
│   ├── project1.jpg             # Project images
│   ├── project2.jpg
│   ├── project3.jpg
│   ├── research-video-1.mp4     # Research video for first publication
│   ├── research-video-1.webm    # Research video (WebM format)
│   ├── video-poster-1.jpg       # Video poster image
│   ├── graphical-abstract-2.jpg # Publication graphical abstracts
│   ├── graphical-abstract-3.jpg
│   ├── software1-demo.mp4       # Software demo videos
│   ├── software2-demo.mp4
│   ├── software3-demo.mp4
│   ├── software1-poster.jpg     # Software video posters
│   ├── software2-poster.jpg
│   ├── software3-poster.jpg
│   ├── software1-installer.exe  # Software downloads
│   ├── software1-mac.dmg
│   ├── software2-installer.exe
│   ├── software2-linux.tar.gz
│   ├── software3-offline.zip
│   └── resume.pdf               # Your resume
└── README.md           # This file
```

## Customization Tips

### Colors
The main color scheme uses:
- Primary: `#2563eb` (blue)
- Accent: `#fbbf24` (yellow/gold)
- Success: `#22c55e` (green for availability badge)

### Content Updates
- Update the skills tags in the About section
- Modify research areas and methodologies
- Add your actual projects with GitHub/demo links
- Include your real publications with DOI/PDF links
- Update contact information and social media profiles

### Form Handling
The contact form currently shows an alert on submission. For production use, you'll want to:
- Set up a backend service to handle form submissions
- Use services like Formspree, Netlify Forms, or EmailJS
- Add proper form validation and error handling

## Deployment Options

- **GitHub Pages**: Free hosting for static sites
- **Netlify**: Easy deployment with form handling
- **Vercel**: Fast deployment with good performance
- **Traditional Web Hosting**: Upload files via FTP

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance Features

- Optimized CSS with minimal external dependencies
- Lazy loading for images (can be added)
- Smooth animations with CSS transitions
- Responsive images and layouts

## License

Feel free to use this template for your personal website. No attribution required.