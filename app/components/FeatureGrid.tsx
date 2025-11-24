// app/components/FeatureGrid.tsx
<div class="sidebar">
    <div class="card">
        <img src="path/to/image1.png" alt="Description of Image 1" class="card-image">
        <h3 class="card-title">Title 1</h3>
        <p class="card-description">Description of the first block.</p>
        <button class="card-button">Action 1</button>
    </div>
    <div class="card">
        <img src="path/to/image2.png" alt="Description of Image 2" class="card-image">
        <h3 class="card-title">Title 2</h3>
        <p class="card-description">Description of the second block.</p>
        <button class="card-button">Action 2</button>
    </div>
    <div class="card">
        <img src="path/to/image3.png" alt="Description of Image 3" class="card-image">
        <h3 class="card-title">Title 3</h3>
        <p class="card-description">Description of the third block.</p>
        <button class="card-button">Action 3</button>
    </div>
    <!-- Add more cards as needed -->
</div>
```

### CSS Styles

```css
.sidebar {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px; /* Space between cards */
    padding: 16px;
}

.card {
    background-color: #fff; /* Card background */
    border: 1px solid #ddd; /* Card border */
    border-radius: 8px; /* Rounded corners */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
    padding: 16px;
    text-align: center; /* Center text */
    transition: transform 0.2s; /* Animation on hover */
}

.card:hover {
    transform: scale(1.05); /* Slightly enlarge on hover */
}

.card-image {
    width: 50px; /* Image width */
    height: 50px; /* Image height */
    margin-bottom: 8px; /* Space below image */
}

.card-title {
    font-size: 1.2em; /* Title size */
    margin: 8px 0; /* Space above and below title */
}

.card-description {
    font-size: 0.9em; /* Description size */
    margin-bottom: 16px; /* Space below description */
}

.card-button {
    background-color: #007BFF; /* Button color */
    color: white; /* Button text color */
    border: none; /* Remove border */
    border-radius: 4px; /* Rounded corners */
    padding: 10px 16px; /* Button padding */
    cursor: pointer; /* Pointer cursor */
    transition: background-color 0.2s; /* Animation on hover */
}

.card-button:hover {
    background-color: #0056b3; /* Darker button color on hover */
}
