// Global variables for blog navigation
let currentPage = 0;
let allPosts = [];

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Function to get clean text from HTML content
function getCleanText(htmlContent) {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    return div.textContent || div.innerText || '';
}

// Function to get excerpt
function getExcerpt(text, length = 150) {
    const cleanText = getCleanText(text);
    return cleanText.length > length ? cleanText.slice(0, length) + '...' : cleanText;
}

// Function to extract image from Medium content
function extractImageFromContent(content) {
    const div = document.createElement('div');
    div.innerHTML = content;
    
    // Try to find Medium's full-size image first
    let img = div.querySelector('img[src*="medium.com/max/"]');
    if (img) return img.src;
    
    // Then try to find any image with medium.com domain
    img = div.querySelector('img[src*="medium.com"]');
    if (img) return img.src;
    
    // Finally, try to get the first image
    img = div.querySelector('img');
    return img ? img.src : null;
}

// Function to display posts for a specific page
function displayPosts(startIndex) {
    const postsPerPage = 3;
    const postsToShow = allPosts.slice(startIndex, startIndex + postsPerPage);
    const mediumPostsContainer = document.getElementById('medium-posts');
    
    mediumPostsContainer.innerHTML = '';
    
    postsToShow.forEach(post => {
        const postImage = post.thumbnail || extractImageFromContent(post.content) || '/api/placeholder/800/400';
        const postDate = formatDate(post.pubDate);
        
        const postElement = `
            <article class="post">
                <div class="post-content">
                    <div class="post-image">
                        <img src="${postImage}" 
                             alt="${post.title}"
                             onerror="this.onerror=null; this.src='/api/placeholder/800/400';"
                             loading="lazy" />
                    </div>
                    <div class="post-details">
                        <div>
                            <h3 class="post-title">
                                <a href="${post.link}" target="_blank" rel="noopener noreferrer">
                                    ${post.title}
                                </a>
                            </h3>
                            <div class="post-meta">
                                <span><i class="fas fa-calendar-alt"></i> ${postDate}</span>
                                <span><i class="fas fa-user"></i> ${post.author}</span>
                            </div>
                            <p class="post-excerpt">${getExcerpt(post.content)}</p>
                        </div>
                        <div class="post-buttons">
                            <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="read-more-btn">
                                Read More <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </article>
        `;
        
        mediumPostsContainer.innerHTML += postElement;
    });
}

// Function to update navigation button states
function updateNavButtons() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn && nextBtn) {
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage >= allPosts.length - 3;
    }
}

// Main function to fetch Medium posts
async function fetchMediumPosts() {
    const mediumUsername = '@ryanabynoe'; // Replace with your Medium username
    const mediumRssUrl = `https://medium.com/feed/${mediumUsername}`;
    const rssToJsonApi = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(mediumRssUrl)}`;
    const mediumPostsContainer = document.getElementById('medium-posts');

    // Show loading state
    mediumPostsContainer.innerHTML = '<div class="loading">Loading blog posts...</div>';

    try {
        const response = await fetch(rssToJsonApi);
        const data = await response.json();

        if (data.status === 'ok' && data.items && data.items.length > 0) {
            allPosts = data.items;
            displayPosts(0);
            updateNavButtons();
        } else {
            throw new Error('No posts found');
        }
    } catch (error) {
        console.error('Error fetching Medium posts:', error);
        mediumPostsContainer.innerHTML = `
            <div class="error-message">
                <p>Unable to load blog posts at the moment. Please try again later.</p>
                <p>You can visit my Medium profile directly at: 
                    <a href="https://medium.com/${mediumUsername}" target="_blank" rel="noopener noreferrer">
                        medium.com/${mediumUsername}
                    </a>
                </p>
            </div>
        `;
    }
}

// Function to handle smooth scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const additionalOffset = 20; // Add some extra padding
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - additionalOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Function to handle scroll animations
function handleScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const options = {
        root: null,
        threshold: 0.1,
        rootMargin: '-50px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Function to add header shadow on scroll
function handleHeaderScroll() {
    const header = document.querySelector('header');
    if (window.scrollY > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Initialize everything when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize blog navigation
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                displayPosts(currentPage);
                updateNavButtons();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentPage < allPosts.length - 3) {
                currentPage++;
                displayPosts(currentPage);
                updateNavButtons();
            }
        });
    }

    // Initialize other features
    initializeSmoothScrolling();
    handleScrollAnimations();
    fetchMediumPosts();

    // Add scroll event listener
    window.addEventListener('scroll', handleHeaderScroll);
});

// Scroll to top functionality
function handleScrollToTop() {
    const scrollBtn = document.getElementById('scroll-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Add this to your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    handleScrollToTop();
    // ... rest of your existing code
});

