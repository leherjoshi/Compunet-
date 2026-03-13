# Image Upload Instructions

## 📸 How to Add Images to Your Website

### Step 1: Prepare Your Images

1. **Rename your images** with descriptive names:
   - Example: `student-rahul-sharma.jpg`
   - Example: `classroom-view.jpg`
   - Example: `certificate-ceremony.jpg`

2. **For WhatsApp tagged images**, add `-whatsapp` to the filename:
   - Example: `student-priya-whatsapp.jpg`
   - Example: `success-story-whatsapp.jpg`

### Step 2: Upload Images

1. **Copy your images** to the `public/images/` folder
2. **Supported formats**: JPG, JPEG, PNG, WebP
3. **Recommended size**: 
   - Gallery images: 800x600px or 1200x900px
   - Profile photos: 400x400px
   - Banner images: 1920x1080px

### Step 3: Add Images to Gallery

Open `public/gallery.html` and add your images in this format:

```html
<div class="gallery-item">
    <img src="images/your-image-name.jpg" alt="Description of image" loading="lazy">
    <div class="gallery-overlay">
        <h3>Student Name or Title</h3>
        <p>Description or achievement</p>
        <!-- For WhatsApp tagged images, add this: -->
        <a href="https://wa.me/919829293303" class="whatsapp-tag" target="_blank">
            <i class="fab fa-whatsapp"></i> Contact on WhatsApp
        </a>
    </div>
</div>
```

### Step 4: Add Names to Images

For images with student/staff names:

```html
<div class="gallery-item">
    <img src="images/student-rahul.jpg" alt="Rahul Sharma - RS-CIT Student">
    <div class="gallery-overlay">
        <h3>Rahul Sharma</h3>
        <p>RS-CIT Course - Batch 2024</p>
        <span class="achievement-badge">Top Performer</span>
    </div>
</div>
```

### Step 5: Add WhatsApp Tags

For images that should have WhatsApp contact:

```html
<div class="gallery-item whatsapp-featured">
    <img src="images/success-story-whatsapp.jpg" alt="Success Story">
    <div class="gallery-overlay">
        <h3>Success Story</h3>
        <p>Contact for more details</p>
        <a href="https://wa.me/919829293303?text=I%20want%20to%20know%20more%20about%20this" 
           class="whatsapp-contact-btn" target="_blank">
            <i class="fab fa-whatsapp"></i> Chat on WhatsApp
        </a>
    </div>
</div>
```

## 🎨 Styling for WhatsApp Tags

The CSS is already added. WhatsApp buttons will appear with:
- Green WhatsApp color
- Hover animation
- Icon + text
- Direct link to WhatsApp chat

## 📝 Example: Complete Gallery Item

```html
<div class="gallery-item">
    <img src="images/priya-patel-tally-student.jpg" alt="Priya Patel - Tally Student">
    <div class="gallery-overlay">
        <h3>Priya Patel</h3>
        <p>Tally Course Graduate - Now working at ABC Company</p>
        <div class="student-info">
            <span class="course-badge">Tally</span>
            <span class="year-badge">2024</span>
        </div>
        <a href="https://wa.me/919829293303?text=I%20want%20to%20know%20about%20Tally%20course" 
           class="whatsapp-contact-btn" target="_blank">
            <i class="fab fa-whatsapp"></i> Inquire About This Course
        </a>
    </div>
</div>
```

## 🔢 Quick Steps Summary

1. ✅ Rename images with descriptive names
2. ✅ Add `-whatsapp` suffix for WhatsApp tagged images
3. ✅ Copy images to `public/images/` folder
4. ✅ Edit `public/gallery.html`
5. ✅ Add image HTML with names and WhatsApp links
6. ✅ Save and refresh browser

## 📞 WhatsApp Numbers

- Director: 9829293303
- Principal: 9829621004

Use these in WhatsApp links:
- `https://wa.me/919829293303`
- `https://wa.me/919829621004`

## 💡 Tips

- Use high-quality images (not blurry)
- Compress images before uploading (use tinypng.com)
- Add meaningful alt text for SEO
- Test WhatsApp links before publishing
- Keep image filenames lowercase with hyphens

---

**Need help? Contact the admin portal or refer to the main README.md**
