/* ==========================================
   Re:anne clinic Ginza - Main JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== Header Scroll Effect =====
    const header = document.getElementById('main-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // ===== Mobile Menu Toggle =====
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            document.body.style.overflow = mobileMenu.classList.contains('hidden') ? '' : 'hidden';
        });
        
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = '';
            });
        }
        
        // Close mobile menu when clicking on a link
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = '';
            });
        });
    }
    
    // ===== Mobile Submenu Toggle =====
    window.toggleMobileSubmenu = function() {
        const submenu = document.getElementById('mobile-submenu');
        if (submenu) {
            submenu.classList.toggle('hidden');
        }
    }
    
    // ===== Smooth Scrolling =====
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ===== Horizontal Scroll for Treatment Menu =====
    const scrollContainer = document.getElementById('scroll-container');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');
    
    if (scrollContainer && scrollLeftBtn && scrollRightBtn) {
        // Get all cards in the scroll container
        function getCards() {
            return scrollContainer.querySelectorAll('.card');
        }
        
        // Calculate how many cards fit in the container
        function getVisibleCardCount() {
            const containerWidth = scrollContainer.clientWidth;
            const cards = getCards();
            if (cards.length === 0) return 0;
            
            const firstCard = cards[0];
            const cardStyle = window.getComputedStyle(firstCard);
            const cardWidth = firstCard.offsetWidth + parseInt(cardStyle.marginLeft) + parseInt(cardStyle.marginRight);
            
            return Math.floor(containerWidth / cardWidth);
        }
        
        // Get currently visible cards
        function getVisibleCards() {
            const cards = Array.from(getCards());
            const containerRect = scrollContainer.getBoundingClientRect();
            const visibleCards = [];
            
            cards.forEach((card, index) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2;
                
                // Check if card center is within container bounds
                if (cardCenter >= containerRect.left && cardCenter <= containerRect.right) {
                    visibleCards.push({ card, index });
                }
            });
            
            return visibleCards;
        }
        
        // Scroll to show next group of cards
        function scrollToNextGroup() {
            const cards = Array.from(getCards());
            const visibleCards = getVisibleCards();
            
            if (visibleCards.length === 0) return;
            
            // Get the last visible card index
            const lastVisibleIndex = visibleCards[visibleCards.length - 1].index;
            
            // Calculate next group starting index
            const visibleCount = getVisibleCardCount();
            let nextIndex = lastVisibleIndex + 1;
            
            // If we're near the end, adjust to show last cards
            if (nextIndex + visibleCount > cards.length) {
                nextIndex = Math.max(0, cards.length - visibleCount);
            }
            
            // Scroll to the next group
            if (nextIndex < cards.length) {
                const targetCard = cards[nextIndex];
                const targetPosition = targetCard.offsetLeft;
                
                scrollContainer.scrollTo({
                    left: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
        
        // Scroll to show previous group of cards
        function scrollToPreviousGroup() {
            const cards = Array.from(getCards());
            const visibleCards = getVisibleCards();
            
            if (visibleCards.length === 0) return;
            
            // Get the first visible card index
            const firstVisibleIndex = visibleCards[0].index;
            
            // Calculate previous group starting index
            const visibleCount = getVisibleCardCount();
            let prevIndex = Math.max(0, firstVisibleIndex - visibleCount);
            
            // Scroll to the previous group
            const targetCard = cards[prevIndex];
            const targetPosition = targetCard.offsetLeft;
            
            scrollContainer.scrollTo({
                left: targetPosition,
                behavior: 'smooth'
            });
        }
        
        // Scroll button handlers
        scrollLeftBtn.addEventListener('click', scrollToPreviousGroup);
        scrollRightBtn.addEventListener('click', scrollToNextGroup);
        
        // Update button visibility based on scroll position
        function updateScrollButtons() {
            const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            const currentScroll = scrollContainer.scrollLeft;
            
            // Left button
            if (currentScroll <= 0) {
                scrollLeftBtn.style.opacity = '0.5';
                scrollLeftBtn.style.cursor = 'default';
                scrollLeftBtn.disabled = true;
            } else {
                scrollLeftBtn.style.opacity = '1';
                scrollLeftBtn.style.cursor = 'pointer';
                scrollLeftBtn.disabled = false;
            }
            
            // Right button
            if (currentScroll >= maxScroll - 1) {
                scrollRightBtn.style.opacity = '0.5';
                scrollRightBtn.style.cursor = 'default';
                scrollRightBtn.disabled = true;
            } else {
                scrollRightBtn.style.opacity = '1';
                scrollRightBtn.style.cursor = 'pointer';
                scrollRightBtn.disabled = false;
            }
        }
        
        // Debounce scroll event for better performance
        let scrollTimeout;
        scrollContainer.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateScrollButtons, 50);
        });
        
        // Initial setup
        updateScrollButtons();
        
        // Update on window resize
        window.addEventListener('resize', debounce(function() {
            updateScrollButtons();
        }, 250));
    }
    
    // ===== Fade In Animation on Scroll =====
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(element => {
        fadeInObserver.observe(element);
    });
    
    // ===== Form Validation =====
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('border-red-500');
                    
                    // Remove error style after user starts typing
                    input.addEventListener('input', function() {
                        this.classList.remove('border-red-500');
                    }, { once: true });
                } else {
                    input.classList.remove('border-red-500');
                }
            });
            
            if (isValid) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                successMessage.textContent = '送信が完了しました。';
                document.body.appendChild(successMessage);
                
                // Remove success message after 3 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
                
                // Reset form
                form.reset();
            }
        });
    });
    
    // ===== Image Lazy Loading =====
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px'
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
    
    // ===== Accordion Functionality =====
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.accordion-icon');
            
            // Toggle active state
            this.classList.toggle('active');
            
            // Toggle content visibility
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
            
            // Rotate icon
            if (icon) {
                icon.style.transform = this.classList.contains('active') ? 'rotate(180deg)' : '';
            }
        });
    });
    
    // ===== Copy to Clipboard =====
    const copyButtons = document.querySelectorAll('.copy-button');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.dataset.copy;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = this.textContent;
                this.textContent = 'コピーしました！';
                
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('コピーに失敗しました:', err);
            });
        });
    });
    
    // ===== Initialize AOS-like animations =====
    function initAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animationType = entry.target.dataset.animate;
                    entry.target.classList.add('animate-' + animationType);
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    }
    
    initAnimations();
    
    // ===== Prevent default behavior for placeholder links =====
    // Removed to allow price modal links to work
    
    // ===== Price Modal Functionality =====
    const priceModal = document.getElementById('priceModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const closeModalBtn = document.getElementById('closeModal');
    
    // Price data for each treatment category
    const priceData = {
        '脱毛': {
            title: '医療脱毛 料金表',
            content: `
                <table class="price-table">
                    <thead>
                        <tr>
                            <th>部位</th>
                            <th>初回料金</th>
                            <th>通常料金</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>全身＋顔＋VIO</td>
                            <td><span class="price-tag">¥50,000</span></td>
                            <td>¥98,000</td>
                        </tr>
                        <tr>
                            <td>全身脱毛</td>
                            <td><span class="price-tag">¥35,000</span></td>
                            <td>¥68,000</td>
                        </tr>
                        <tr>
                            <td>VIO脱毛</td>
                            <td><span class="price-tag">¥15,000</span></td>
                            <td>¥28,000</td>
                        </tr>
                        <tr>
                            <td>顔脱毛</td>
                            <td><span class="price-tag">¥12,000</span></td>
                            <td>¥25,000</td>
                        </tr>
                        <tr>
                            <td>ワキ脱毛</td>
                            <td><span class="price-tag">¥3,000</span></td>
                            <td>¥8,000</td>
                        </tr>
                    </tbody>
                </table>
                <p class="text-sm text-gray-600 mt-4">※すべて税込価格です。</p>
            `
        },
        'ハイフ': {
            title: 'ハイフ（HIFU） 料金表',
            content: `
                <table class="price-table">
                    <thead>
                        <tr>
                            <th>メニュー</th>
                            <th>初回料金</th>
                            <th>通常料金</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>両頬＋顎下（400ショット）</td>
                            <td><span class="price-tag">¥29,800</span></td>
                            <td>¥50,000</td>
                        </tr>
                        <tr>
                            <td>全顔（600ショット）</td>
                            <td><span class="price-tag">¥45,000</span></td>
                            <td>¥75,000</td>
                        </tr>
                        <tr>
                            <td>全顔＋首（800ショット）</td>
                            <td><span class="price-tag">¥58,000</span></td>
                            <td>¥95,000</td>
                        </tr>
                        <tr>
                            <td>目元集中（200ショット）</td>
                            <td><span class="price-tag">¥18,000</span></td>
                            <td>¥30,000</td>
                        </tr>
                    </tbody>
                </table>
                <p class="text-sm text-gray-600 mt-4">※すべて税込価格です。</p>
            `
        },
        'ダーマペン': {
            title: 'ダーマペン4 料金表',
            content: `
                <table class="price-table">
                    <thead>
                        <tr>
                            <th>メニュー</th>
                            <th>初回料金</th>
                            <th>通常料金</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>全顔</td>
                            <td><span class="price-tag">¥11,000</span></td>
                            <td>¥25,000</td>
                        </tr>
                        <tr>
                            <td>全顔＋成長因子</td>
                            <td><span class="price-tag">¥18,000</span></td>
                            <td>¥35,000</td>
                        </tr>
                        <tr>
                            <td>ヴェルヴェットスキン</td>
                            <td><span class="price-tag">¥25,000</span></td>
                            <td>¥45,000</td>
                        </tr>
                        <tr>
                            <td>頬のみ</td>
                            <td><span class="price-tag">¥8,000</span></td>
                            <td>¥18,000</td>
                        </tr>
                    </tbody>
                </table>
                <p class="text-sm text-gray-600 mt-4">※すべて税込価格です。</p>
            `
        },
        'レーザー': {
            title: 'レーザー治療 料金表',
            content: `
                <table class="price-table">
                    <thead>
                        <tr>
                            <th>メニュー</th>
                            <th>初回料金</th>
                            <th>通常料金</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>レーザーシャワー（全顔）</td>
                            <td><span class="price-tag">¥9,800</span></td>
                            <td>¥20,000</td>
                        </tr>
                        <tr>
                            <td>シミ取りレーザー（1個）</td>
                            <td><span class="price-tag">¥5,000</span></td>
                            <td>¥10,000</td>
                        </tr>
                        <tr>
                            <td>レーザートーニング</td>
                            <td><span class="price-tag">¥12,000</span></td>
                            <td>¥25,000</td>
                        </tr>
                        <tr>
                            <td>フラクショナルレーザー</td>
                            <td><span class="price-tag">¥20,000</span></td>
                            <td>¥40,000</td>
                        </tr>
                    </tbody>
                </table>
                <p class="text-sm text-gray-600 mt-4">※すべて税込価格です。</p>
            `
        },
        'ピーリング': {
            title: 'ハイドラフェイシャル・ピーリング 料金表',
            content: `
                <table class="price-table">
                    <thead>
                        <tr>
                            <th>メニュー</th>
                            <th>初回料金</th>
                            <th>通常料金</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>ハイドラフェイシャル（全顔）</td>
                            <td><span class="price-tag">¥10,000</span></td>
                            <td>¥25,000</td>
                        </tr>
                        <tr>
                            <td>ケミカルピーリング</td>
                            <td><span class="price-tag">¥8,000</span></td>
                            <td>¥15,000</td>
                        </tr>
                        <tr>
                            <td>マッサージピール</td>
                            <td><span class="price-tag">¥12,000</span></td>
                            <td>¥22,000</td>
                        </tr>
                        <tr>
                            <td>背中ピーリング</td>
                            <td><span class="price-tag">¥15,000</span></td>
                            <td>¥28,000</td>
                        </tr>
                    </tbody>
                </table>
                <p class="text-sm text-gray-600 mt-4">※すべて税込価格です。</p>
            `
        },
        '注入': {
            title: '水光注射・注入治療 料金表',
            content: `
                <table class="price-table">
                    <thead>
                        <tr>
                            <th>メニュー</th>
                            <th>初回料金</th>
                            <th>通常料金</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>水光注射（ヒアルロン酸）</td>
                            <td><span class="price-tag">¥11,000</span></td>
                            <td>¥25,000</td>
                        </tr>
                        <tr>
                            <td>ボツリヌストキシン（額）</td>
                            <td><span class="price-tag">¥15,000</span></td>
                            <td>¥30,000</td>
                        </tr>
                        <tr>
                            <td>ヒアルロン酸（ほうれい線）</td>
                            <td><span class="price-tag">¥35,000</span></td>
                            <td>¥60,000</td>
                        </tr>
                        <tr>
                            <td>エクソソーム水光注射</td>
                            <td><span class="price-tag">¥25,000</span></td>
                            <td>¥50,000</td>
                        </tr>
                    </tbody>
                </table>
                <p class="text-sm text-gray-600 mt-4">※すべて税込価格です。</p>
            `
        }
    };
    
    // Show modal function
    function showPriceModal(category) {
        const data = priceData[category];
        if (data) {
            modalTitle.textContent = data.title;
            modalContent.innerHTML = data.content;
            priceModal.classList.remove('hidden');
            setTimeout(() => {
                priceModal.classList.add('show');
            }, 10);
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Close modal function
    function closePriceModal() {
        priceModal.classList.remove('show');
        setTimeout(() => {
            priceModal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }
    
    // Close modal event listeners
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closePriceModal);
    }
    
    if (priceModal) {
        priceModal.addEventListener('click', function(e) {
            if (e.target === priceModal) {
                closePriceModal();
            }
        });
    }
    
    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !priceModal.classList.contains('hidden')) {
            closePriceModal();
        }
    });
    
    // Check if inline script already set up the modal
    if (typeof window.openModal === 'function') {
        console.log('Modal already configured by inline script');
        // Don't set up duplicate listeners - inline script is handling it
        return;
    }
    
    // Remove any duplicate event listeners and use a single approach
    // Wait for DOM to be fully loaded
    setTimeout(() => {
        // Add click handlers to price check links using data attributes
        const priceModalLinks = document.querySelectorAll('[data-price-modal]');
        console.log('Found price modal links:', priceModalLinks.length); // Debug log
        
        if (priceModalLinks.length === 0) {
            console.error('No price modal links found!');
            return;
        }
        
        // Clear any existing event listeners
        priceModalLinks.forEach(link => {
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
        });
        
        // Re-select after cloning
        const freshLinks = document.querySelectorAll('[data-price-modal]');
        
        freshLinks.forEach((link, index) => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Stop event bubbling
                const modalType = this.getAttribute('data-price-modal');
                console.log(`Price modal clicked [${index}]:`, modalType); // Debug log
                
                // Check if modal elements exist
                if (!priceModal || !modalTitle || !modalContent) {
                    console.error('Modal elements not found:', {
                        priceModal: !!priceModal,
                        modalTitle: !!modalTitle,
                        modalContent: !!modalContent
                    });
                    return;
                }
                
                // Check if price data exists
                if (!priceData[modalType]) {
                    console.error('Price data not found for:', modalType);
                    console.log('Available keys:', Object.keys(priceData));
                    return;
                }
                
                showPriceModal(modalType);
            });
            
            // Mark as listener attached
            link._listenerAttached = true;
            console.log(`Event listener attached to link ${index}:`, link.textContent.trim());
        });
    }, 500); // Increased delay to ensure DOM is ready
    
    // Make functions globally accessible for debugging
    window.showPriceModal = showPriceModal;
    window.closePriceModal = closePriceModal;
    window.priceData = priceData;
    
});

// ===== Utility Functions =====

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}