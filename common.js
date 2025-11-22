
        const API_BASE = '/api';
        
        // Custom Notification System
        function showNotification(message, type = 'info', duration = 5000) {
            const container = document.getElementById('notificationContainer');
            if (!container) {
                // Create container if it doesn't exist
                const newContainer = document.createElement('div');
                newContainer.id = 'notificationContainer';
                document.body.appendChild(newContainer);
                return showNotification(message, type, duration);
            }
            
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            
            const icons = {
                error: '❌',
                success: '✓',
                warning: '⚠️',
                info: 'ℹ️'
            };
            
            notification.innerHTML = `
                <div class="notification-content">
                    <span class="notification-icon">${icons[type] || icons.info}</span>
                    <span class="notification-text">${escapeHtml(message)}</span>
                    <button class="notification-close" aria-label="Close">&times;</button>
                </div>
            `;
            
            container.appendChild(notification);
            
            // Auto-dismiss after duration
            const autoDismiss = setTimeout(() => {
                dismissNotification(notification);
            }, duration);
            
            // Manual dismiss on close button
            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => {
                clearTimeout(autoDismiss);
                dismissNotification(notification);
            });
            
            // Remove from DOM after animation
            notification.addEventListener('animationend', (e) => {
                if (e.animationName === 'slideOutLeft') {
                    notification.remove();
                }
            });
        }
        
        function dismissNotification(notification) {
            notification.classList.add('hiding');
        }
        
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Toggle Account Menu
// Toggle Account Menu - FIXED VERSION
        function toggleAccountMenu() {
            console.log('[ACCOUNT] toggleAccountMenu called');
            const content = document.getElementById('accountMenuContent');
            const toggle = document.getElementById('accountMenuToggle');
            
            if (!content || !toggle) {
                console.error('[ACCOUNT] Missing elements:', { content: !!content, toggle: !!toggle });
                return;
            }

            const isCollapsed = content.style.maxHeight === '0px' || !content.style.maxHeight || content.style.display === 'none';

            if (isCollapsed) {
                // Expand
                content.style.display = 'block'; // Show the content
                const height = content.scrollHeight + 'px';
                content.style.maxHeight = height;
                toggle.style.transform = 'rotate(180deg)';
                
                // Force reflow to ensure transition works
                void content.offsetHeight;
            } else {
                // Collapse
                content.style.maxHeight = content.scrollHeight + 'px';
                void content.offsetHeight; // Trigger reflow
                content.style.maxHeight = '0px';
                toggle.style.transform = 'rotate(0deg)';
                // Don't set display to none here - let max-height handle the hiding
            }
        }

        // Make it global
        window.toggleAccountMenu = toggleAccountMenu;

        // Simple Mobile Menu Modal
        function initMobileMenu() {
            const menuToggle = document.getElementById('menuToggle');
            const mobileMenu = document.getElementById('mobileMenu');
            const closeButton = document.getElementById('mobileMenuClose');
            
            if (!menuToggle || !mobileMenu) return;
            
            function openMenu() {
                menuToggle.classList.add('active');
                mobileMenu.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            
            function closeMenu() {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            menuToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (mobileMenu.classList.contains('active')) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });
            
            // Close button click handler
            if (closeButton) {
                closeButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeMenu();
                });
            }
            
            // Close menu when clicking links
            const menuContent = mobileMenu.querySelector('.mobile-menu-content');
            if (menuContent) {
                menuContent.querySelectorAll('.nav-tab').forEach(link => {
                    link.addEventListener('click', function() {
                        closeMenu();
                    });
                });
            }
            
            // Close menu when clicking backdrop
            mobileMenu.addEventListener('click', function(e) {
                if (e.target === mobileMenu) {
                    closeMenu();
                }
            });
            
            window.closeMobileMenu = closeMenu;
        }

        // Mobile Dropdown Toggle
        function initMobileDropdown() {
            const tradingToggle = document.getElementById('mobileTradingToggle');
            const tradingMenu = document.getElementById('mobileTradingMenu');
            
            if (tradingToggle && tradingMenu) {
                tradingToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const isExpanded = tradingToggle.classList.contains('expanded');
                    
                    if (isExpanded) {
                        tradingToggle.classList.remove('expanded');
                        tradingMenu.classList.remove('expanded');
                    } else {
                        tradingToggle.classList.add('expanded');
                        tradingMenu.classList.add('expanded');
                    }
                });

                // Close dropdown when clicking on a dropdown item
                tradingMenu.querySelectorAll('.mobile-dropdown-item').forEach(item => {
                    item.addEventListener('click', function() {
                        tradingToggle.classList.remove('expanded');
                        tradingMenu.classList.remove('expanded');
                        if (window.closeMobileMenu) {
                            window.closeMobileMenu();
                        }
                    });
                });
            }
        }
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initMobileMenu();
                initMobileDropdown();
                // Show mobile login button by default if authManager isn't ready
                const mobileLoginBtn = document.getElementById('mobileLoginBtn');
                if (mobileLoginBtn && (!window.authManager || !window.authManager.isAuthenticated())) {
                    mobileLoginBtn.style.display = 'block';
                }
                
                // Add event delegation for mobile login button
                document.addEventListener('click', function(e) {
                    const target = e.target.closest('.mobile-login-button');
                    if (target) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        console.log('[MOBILE] Login button clicked via delegation');
                        if (window.handleMobileLogin) {
                            window.handleMobileLogin();
                        } else if (window.authManager) {
                            window.authManager.login();
                        }
                        return false;
                    }
                }, true);
            });
        } else {
            initMobileMenu();
            initMobileDropdown();
            // Show mobile login button by default if authManager isn't ready
            const mobileLoginBtn = document.getElementById('mobileLoginBtn');
            if (mobileLoginBtn && (!window.authManager || !window.authManager.isAuthenticated())) {
                mobileLoginBtn.style.display = 'block';
            }
            
            // Add event delegation for mobile login button
            document.addEventListener('click', function(e) {
                const target = e.target.closest('.mobile-login-button');
                if (target) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    console.log('[MOBILE] Login button clicked via delegation');
                    if (window.handleMobileLogin) {
                        window.handleMobileLogin();
                    } else if (window.authManager) {
                        window.authManager.login();
                    }
                    return false;
                }
            }, true);
        }

        // Handle mobile login button click (make it global)
        window.handleMobileLogin = function() {
            if (window.closeMobileMenu) {
                window.closeMobileMenu();
            }
            
            if (!window.authManager) {
                console.error('[MOBILE] authManager not available');
                showNotification('Authentication system not ready. Please refresh the page.', 'error');
                return;
            }
            
            try {
                window.authManager.login();
            } catch (error) {
                console.error('[MOBILE] Error during login:', error);
                showNotification('Error starting login. Please try again.', 'error');
            }
        };

        // Navigation is now handled in each HTML file

        // Trading dropdown - no JavaScript needed, pure CSS!
        
        // Poké Designer JavaScript
        let pokeDesignerData = {
            pokemon: [],
            balls: [],
            items: [],
            moves: [],
            encounters: [],
            selectedPokemon: null,
            selectedGame: 'plza',
            relearnMoves: []
        };

        // Initialize EV/IV sliders and hexagon graph
        function initStatSliders(type) {
            const container = document.getElementById(`${type}Sliders`);
            if (!container) return;
            
            const stats = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'];
            const maxValue = type === 'ev' ? 252 : 31;
            
            // Create hexagon graph only for EVs
            if (type === 'ev') {
                const hexagonContainer = document.getElementById(`${type}Hexagon`);
                if (hexagonContainer) {
                    createHexagonGraph(type, hexagonContainer);
                }
            }
            
            // Create sliders for EVs, number inputs for IVs
            container.innerHTML = '';
            stats.forEach(stat => {
                const inputContainer = document.createElement('div');
                if (type === 'ev') {
                    inputContainer.style.display = 'flex';
                    inputContainer.style.alignItems = 'center';
                    inputContainer.style.gap = '0.5rem';
                } else {
                    // IVs don't need special container styling, handled in the inputWrapper
                }
                
                const label = document.createElement('label');
                if (type === 'ev') {
                    label.style.minWidth = '40px';
                    label.style.color = 'var(--text-light)';
                    label.style.fontSize = '0.8rem';
                    label.style.fontWeight = '500';
                    label.textContent = stat;
                    label.htmlFor = `${type}${stat}`;
                }
                
                if (type === 'ev') {
                    // EV sliders (smaller)
                    const slider = document.createElement('input');
                    slider.type = 'range';
                    slider.id = `${type}${stat}`;
                    slider.min = '0';
                    slider.max = maxValue;
                    slider.value = '0';
                    slider.style.flex = '1';
                    slider.style.height = '4px';
                    slider.dataset.stat = stat;
                    
                    const value = document.createElement('span');
                    value.style.minWidth = '35px';
                    value.style.color = 'var(--text)';
                    value.style.textAlign = 'right';
                    value.style.fontSize = '0.8rem';
                    value.style.fontWeight = '600';
                    value.textContent = '0';
                    value.id = `${type}${stat}Value`;
                    
                    slider.addEventListener('input', () => {
                        updateStats(type);
                    });
                    
                    inputContainer.appendChild(label);
                    inputContainer.appendChild(slider);
                    inputContainer.appendChild(value);
                } else {
                    // IV number inputs (compact)
                    const inputWrapper = document.createElement('div');
                    inputWrapper.style.display = 'flex';
                    inputWrapper.style.flexDirection = 'column';
                    inputWrapper.style.gap = '0.25rem';
                    
                    const inputLabel = document.createElement('label');
                    inputLabel.textContent = stat;
                    inputLabel.style.fontSize = '0.75rem';
                    inputLabel.style.color = 'var(--text-light)';
                    inputLabel.style.fontWeight = '500';
                    inputLabel.htmlFor = `${type}${stat}`;
                    
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.id = `${type}${stat}`;
                    input.min = '0';
                    input.max = '31';
                    input.value = '31'; // Default to 31
                    input.style.width = '100%';
                    input.style.padding = '0.4rem';
                    input.style.border = '2px solid var(--border)';
                    input.style.borderRadius = '6px';
                    input.style.background = 'var(--surface)';
                    input.style.color = 'var(--text)';
                    input.style.fontSize = '0.85rem';
                    input.style.textAlign = 'center';
                    input.dataset.stat = stat;
                    
                    input.addEventListener('input', () => {
                        // Clamp value between 0 and 31
                        let val = parseInt(input.value) || 0;
                        if (val < 0) val = 0;
                        if (val > 31) val = 31;
                        input.value = val;
                        updateStats(type);
                    });
                    
                    inputWrapper.appendChild(inputLabel);
                    inputWrapper.appendChild(input);
                    inputContainer.appendChild(inputWrapper);
                }
                
                container.appendChild(inputContainer);
            });
        }
        
        function randomizeEVs() {
            const stats = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'];
            const totalMax = 510;
            
            // Pick 2 random stats to set to 252
            const shuffled = [...stats].sort(() => Math.random() - 0.5);
            const maxStats = shuffled.slice(0, 2);
            const remainingStats = shuffled.slice(2);
            
            // Set max stats to 252
            maxStats.forEach(stat => {
                const slider = document.getElementById(`ev${stat}`);
                if (slider) slider.value = 252;
            });
            
            // Distribute remaining 6 EVs among the other 4 stats
            const remaining = totalMax - (252 * 2); // 6 EVs remaining
            let distributed = 0;
            remainingStats.forEach((stat, index) => {
                const slider = document.getElementById(`ev${stat}`);
                if (slider) {
                    if (index === remainingStats.length - 1) {
                        // Last stat gets whatever is left
                        slider.value = remaining - distributed;
                    } else {
                        // Distribute evenly (1 or 2 EVs each)
                        const amount = Math.floor(remaining / remainingStats.length);
                        slider.value = amount;
                        distributed += amount;
                    }
                }
            });
            
            updateStats('ev');
        }
        
        function createHexagonGraph(type, container) {
            const stats = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'];
            const maxValue = type === 'ev' ? 252 : 31;
            const size = 300;
            const centerX = size / 2;
            const centerY = size / 2;
            const radius = size * 0.38;
            
            container.innerHTML = '';
            
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', size);
            svg.setAttribute('height', size);
            svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
            svg.style.display = 'block';
            
            // Create hexagon background
            const hexagon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            const points = [];
            stats.forEach((stat, index) => {
                const angle = (index * 60 - 90) * (Math.PI / 180);
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                points.push(`${x},${y}`);
            });
            hexagon.setAttribute('points', points.join(' '));
            hexagon.setAttribute('fill', 'var(--surface)');
            hexagon.setAttribute('stroke', 'var(--border)');
            hexagon.setAttribute('stroke-width', '2');
            svg.appendChild(hexagon);
            
            // Create stat lines and labels
            stats.forEach((stat, index) => {
                const angle = (index * 60 - 90) * (Math.PI / 180);
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                
                // Line from center to stat point
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', centerX);
                line.setAttribute('y1', centerY);
                line.setAttribute('x2', x);
                line.setAttribute('y2', y);
                line.setAttribute('stroke', 'var(--border)');
                line.setAttribute('stroke-width', '1');
                line.setAttribute('opacity', '0.5');
                svg.appendChild(line);
                
                // Stat label
                const labelX = centerX + (radius + 25) * Math.cos(angle);
                const labelY = centerY + (radius + 25) * Math.sin(angle);
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', labelX);
                text.setAttribute('y', labelY);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('dominant-baseline', 'middle');
                text.setAttribute('fill', 'var(--text-light)');
                text.setAttribute('font-size', '12');
                text.setAttribute('font-weight', '500');
                text.textContent = stat;
                svg.appendChild(text);
                
                // Value label
                const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                valueText.setAttribute('x', centerX + radius * 0.7 * Math.cos(angle));
                valueText.setAttribute('y', centerY + radius * 0.7 * Math.sin(angle));
                valueText.setAttribute('text-anchor', 'middle');
                valueText.setAttribute('dominant-baseline', 'middle');
                valueText.setAttribute('fill', 'var(--text)');
                valueText.setAttribute('font-size', '11');
                valueText.setAttribute('font-weight', '600');
                valueText.id = `${type}${stat}HexValue`;
                valueText.textContent = '0';
                svg.appendChild(valueText);
            });
            
            // Create fill polygon (will be updated)
            const fillPolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            fillPolygon.id = `${type}FillPolygon`;
            fillPolygon.setAttribute('fill', 'var(--primary)');
            fillPolygon.setAttribute('fill-opacity', '0.3');
            fillPolygon.setAttribute('stroke', 'var(--primary)');
            fillPolygon.setAttribute('stroke-width', '2');
            svg.appendChild(fillPolygon);
            
            container.appendChild(svg);
        }
        
        function updateStats(type) {
            const stats = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'];
            const maxValue = type === 'ev' ? 252 : 31;
            const totalMax = type === 'ev' ? 510 : 186;
            const size = 300;
            const centerX = size / 2;
            const centerY = size / 2;
            const radius = size * 0.38;
            let total = 0;
            const values = [];
            
            stats.forEach((stat, index) => {
                const input = document.getElementById(`${type}${stat}`);
                const valueEl = document.getElementById(`${type}${stat}Value`); // Only exists for EVs
                const hexValueEl = document.getElementById(`${type}${stat}HexValue`);
                
                if (input) {
                    let val = parseInt(input.value) || 0;
                    
                    // For EVs, prevent exceeding total
                    if (type === 'ev') {
                        const currentTotal = stats.reduce((sum, s) => {
                            if (s === stat) return sum;
                            const sInput = document.getElementById(`${type}${s}`);
                            return sum + (parseInt(sInput?.value) || 0);
                        }, 0);
                        
                        if (currentTotal + val > totalMax) {
                            val = Math.max(0, totalMax - currentTotal);
                            input.value = val;
                        }
                        
                        // Update value display for EV sliders
                        if (valueEl) {
                            valueEl.textContent = val;
                        }
                    } else {
                        // For IVs, clamp value between 0 and 31
                        if (val < 0) val = 0;
                        if (val > 31) val = 31;
                        if (val !== parseInt(input.value)) {
                            input.value = val;
                        }
                    }
                    
                    if (hexValueEl) hexValueEl.textContent = val;
                    values.push(val);
                    total += val;
                } else {
                    values.push(0);
                }
            });
            
            // Update hexagon fill (only for EVs)
            if (type === 'ev') {
                const fillPolygon = document.getElementById(`${type}FillPolygon`);
                if (fillPolygon) {
                    const points = [];
                    stats.forEach((stat, index) => {
                        const val = values[index];
                        const percentage = val / maxValue;
                        const angle = (index * 60 - 90) * (Math.PI / 180);
                        const x = centerX + radius * percentage * Math.cos(angle);
                        const y = centerY + radius * percentage * Math.sin(angle);
                        points.push(`${x},${y}`);
                    });
                    fillPolygon.setAttribute('points', points.join(' '));
                }
            }
            
            const totalEl = document.getElementById(`${type}Total`);
            if (totalEl) {
                totalEl.textContent = total;
                if (type === 'ev') {
                    totalEl.style.color = total > totalMax ? 'var(--error)' : total === totalMax ? 'var(--success)' : 'var(--text-light)';
                } else if (type === 'iv') {
                    totalEl.style.color = total > totalMax ? 'var(--error)' : 'var(--text-light)';
                }
            }
            
            generateShowdownSet();
        }


        // Load Pokemon list
        async function loadPokemon(game) {
            try {
                if (!game) {
                    console.warn('No game specified for loading Pokemon');
                    return;
                }
                
                const select = document.getElementById('pokemonSelect');
                if (select) {
                    // Show loading state
                    select.innerHTML = '<option value="">Loading Pokemon...</option>';
                    select.disabled = true;
                }
                
                const response = await fetch(`/api/pokemon/${game}`);
                if (!response.ok) {
                    throw new Error(`Failed to load Pokemon: ${response.status} ${response.statusText}`);
                }
                
                const data = await response.json();
                if (data.success && Array.isArray(data.pokemon)) {
                    pokeDesignerData.pokemon = data.pokemon;
                    
                    if (select) {
                        // Clear and populate select
                        select.innerHTML = '<option value="">Select a Pokemon...</option>';
                        
                        // Sort Pokemon by dex number for better UX
                        const sortedPokemon = [...data.pokemon].sort((a, b) => {
                            const dexA = parseInt(a['dex-number'] || a.dex_number || 0);
                            const dexB = parseInt(b['dex-number'] || b.dex_number || 0);
                            return dexA - dexB;
                        });
                        
                        sortedPokemon.forEach(p => {
                            const option = document.createElement('option');
                            const dexNumber = p['dex-number'] || p.dex_number;
                            option.value = dexNumber;
                            option.textContent = p.content || p.name || `Pokemon ${dexNumber}`;
                            option.dataset.form = p.form || '0';
                            select.appendChild(option);
                        });
                        
                        select.disabled = false;
                        
                        // Log for debugging
                        console.log(`Loaded ${sortedPokemon.length} Pokemon for game: ${game}`);
                    }
                } else {
                    console.error('Invalid Pokemon data received:', data);
                    if (select) {
                        select.innerHTML = '<option value="">Error loading Pokemon</option>';
                        select.disabled = false;
                    }
                }
            } catch (error) {
                console.error('Error loading Pokemon:', error);
                const select = document.getElementById('pokemonSelect');
                if (select) {
                    select.innerHTML = '<option value="">Error loading Pokemon</option>';
                    select.disabled = false;
                }
            }
        }

        // Load balls with images
        async function loadBalls(game) {
            try {
                const response = await fetch(`/api/balls/${game}`);
                const data = await response.json();
                if (data.success) {
                    pokeDesignerData.balls = data.balls;
                    renderBallDropdown(data.balls);
                }
            } catch (error) {
                console.error('Error loading balls:', error);
            }
        }
        
        // Helper function to convert ball name to image filename (global for URL loading)
        function getBallImagePath(ballName) {
            // Convert ball name to lowercase, remove special characters, and map to ball image
            const nameMap = {
                'poké ball': 'pokeball',
                'poke ball': 'pokeball',
                'master ball': 'masterball',
                'ultra ball': 'ultraball',
                'great ball': 'greatball',
                'net ball': 'netball',
                'dive ball': 'diveball',
                'nest ball': 'nestball',
                'repeat ball': 'repeatball',
                'timer ball': 'timerball',
                'luxury ball': 'luxuryball',
                'premier ball': 'premierball',
                'dusk ball': 'duskball',
                'heal ball': 'healball',
                'quick ball': 'quickball',
                'fast ball': 'fastball',
                'level ball': 'levelball',
                'lure ball': 'lureball',
                'heavy ball': 'heavyball',
                'love ball': 'loveball',
                'friend ball': 'friendball',
                'moon ball': 'moonball',
                'sport ball': 'sportball'
            };
            
            const normalizedName = ballName.toLowerCase();
            const ballFileName = nameMap[normalizedName] || normalizedName.replace(/[^a-z0-9]/g, '').toLowerCase();
            return `balls/${ballFileName}.png`;
        }
        
        function renderBallDropdown(balls, searchTerm = '') {
            const dropdown = document.getElementById('ballDropdown');
            const searchInput = document.getElementById('ballSearchInput');
            if (!dropdown) return;
            
            const filtered = balls.filter(ball => 
                !searchTerm || ball.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (ball.description && ball.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            
            dropdown.innerHTML = '';
            
            filtered.forEach(ball => {
                const option = document.createElement('div');
                option.className = 'item-option';
                option.dataset.value = ball.name;
                
                // Use the balls folder path instead of items folder
                const ballImagePath = getBallImagePath(ball.name);
                const imageUrl = `/pkm/${pokeDesignerData.selectedGame}/${ballImagePath}`;
                
                option.innerHTML = `
                    <img src="${imageUrl}" alt="${ball.name}" class="item-option-image" onerror="this.style.display='none'">
                    <div class="item-option-text">
                        <strong>${ball.name}</strong>
                        ${ball.description ? `<small>${ball.description}</small>` : ''}
                    </div>
                `;
                
                option.addEventListener('click', () => {
                    selectBall(ball.name, ballImagePath);
                    if (searchInput) searchInput.value = ball.name;
                    dropdown.style.display = 'none';
                });
                
                dropdown.appendChild(option);
            });
        }
        
        function selectBall(ballName, imagePath = '') {
            pokeDesignerData.selectedBall = ballName;
            
            // Update ball preview in the preview container
            const ballPreviewImage = document.getElementById('ballPreviewImage');
            if (ballPreviewImage) {
                if (ballName && imagePath) {
                    ballPreviewImage.src = `/pkm/${pokeDesignerData.selectedGame}/${imagePath}`;
                    ballPreviewImage.style.display = 'block';
                    ballPreviewImage.onerror = () => {
                        // Fallback to pokeball.png
                        ballPreviewImage.src = `/pkm/${pokeDesignerData.selectedGame}/balls/pokeball.png`;
                    };
                } else {
                    // Default to pokeball.png
                    ballPreviewImage.src = `/pkm/${pokeDesignerData.selectedGame}/balls/pokeball.png`;
                    ballPreviewImage.style.display = 'block';
                }
            }
            
            // Also update the small preview in the ball selector (if it exists)
            const ballImage = document.getElementById('ballImage');
            const ballPreview = document.getElementById('ballPreview');
            if (ballImage && ballPreview) {
                if (imagePath) {
                    ballImage.src = `/pkm/${pokeDesignerData.selectedGame}/${imagePath}`;
                    ballImage.style.display = 'block';
                    ballImage.onerror = () => {
                        ballImage.style.display = 'none';
                    };
                } else {
                    ballImage.style.display = 'none';
                }
            }
            
            generateShowdownSet();
        }

        // Load items with images
        async function loadItems(game) {
            try {
                const response = await fetch(`/api/items/${game}`);
                const data = await response.json();
                if (data.success) {
                    pokeDesignerData.items = data.items;
                    renderItemDropdown(data.items);
                }
            } catch (error) {
                console.error('Error loading items:', error);
            }
        }
        
        function renderItemDropdown(items, searchTerm = '') {
            const dropdown = document.getElementById('itemDropdown');
            const searchInput = document.getElementById('itemSearchInput');
            if (!dropdown) return;
            
            const filtered = items.filter(item => 
                !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            
            dropdown.innerHTML = '';
            
            // Add "None" option
            const noneOption = document.createElement('div');
            noneOption.className = 'item-option';
            noneOption.dataset.value = '';
            noneOption.innerHTML = `
                <div class="item-option-text">
                    <strong>None</strong>
                </div>
            `;
            noneOption.addEventListener('click', () => {
                selectItem('');
                searchInput.value = '';
                dropdown.style.display = 'none';
            });
            dropdown.appendChild(noneOption);
            
            filtered.forEach(item => {
                const option = document.createElement('div');
                option.className = 'item-option';
                option.dataset.value = item.name;
                
                const imagePath = item.image || item['img-path'] || item.img_path || '';
                const imageUrl = imagePath ? `/pkm/${pokeDesignerData.selectedGame}/${imagePath}` : '';
                
                option.innerHTML = `
                    ${imageUrl ? `<img src="${imageUrl}" alt="${item.name}" class="item-option-image" onerror="this.style.display='none'">` : ''}
                    <div class="item-option-text">
                        <strong>${item.name}</strong>
                        ${item.description ? `<small>${item.description}</small>` : ''}
                    </div>
                `;
                
                option.addEventListener('click', () => {
                    selectItem(item.name);
                    searchInput.value = item.name;
                    dropdown.style.display = 'none';
                });
                
                dropdown.appendChild(option);
            });
        }
        
        function selectItem(itemName) {
            pokeDesignerData.selectedItem = itemName;
            generateShowdownSet();
        }

        // Load moves for selected Pokemon
        async function loadMoves(game, dexNumber) {
            try {
                const response = await fetch(`/api/pokemon/${game}/${dexNumber}/moves`);
                const data = await response.json();
                if (data.success) {
                    pokeDesignerData.moves = data.moves;
                    renderMovesList(data.moves);
                }
            } catch (error) {
                console.error('Error loading moves:', error);
            }
        }
        
        function renderMovesList(moves, searchTerm = '') {
            const container = document.getElementById('movesListContainer');
            if (!container) return;
            
            // Filter by search term and remove duplicates (same move_name, regardless of is_plus_move)
            const seenMoves = new Set();
            const filtered = moves.filter(move => {
                const matchesSearch = !searchTerm || move.move_name.toLowerCase().includes(searchTerm.toLowerCase());
                if (!matchesSearch) return false;
                
                // Only show first occurrence of each move name (prefer non-plus moves)
                if (seenMoves.has(move.move_name)) {
                    return false;
                }
                seenMoves.add(move.move_name);
                return true;
            });
            
            if (filtered.length === 0) {
                container.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 2rem;">No moves found</div>';
                return;
            }
            
            container.innerHTML = '';
            
            filtered.forEach(move => {
                const card = document.createElement('div');
                card.className = 'move-card';
                card.dataset.moveName = move.move_name;
                
                // Check if this move is already selected
                const isSelected = selectedMoves.includes(move.move_name);
                if (isSelected) {
                    card.style.opacity = '0.6';
                    card.style.cursor = 'not-allowed';
                }
                
                const typeColors = {
                    'Normal': '#A8A878', 'Fire': '#F08030', 'Water': '#6890F0', 'Electric': '#F8D030',
                    'Grass': '#78C850', 'Ice': '#98D8D8', 'Fighting': '#C03028', 'Poison': '#A040A0',
                    'Ground': '#E0C068', 'Flying': '#A890F0', 'Psychic': '#F85888', 'Bug': '#A8B820',
                    'Rock': '#B8A038', 'Ghost': '#705898', 'Dragon': '#7038F8', 'Dark': '#705848',
                    'Steel': '#B8B8D0', 'Fairy': '#EE99AC'
                };
                
                const typeColor = typeColors[move.move_type] || '#68A090';
                const isPlusMove = move.is_plus_move === 1;
                const plusMoveIcon = isPlusMove ? `<img src="/pkm/${pokeDesignerData.selectedGame}/misc/plusmove.png" alt="Plus Move" style="width: 18px; height: 18px; margin-left: 0.4rem; vertical-align: middle; display: inline-block;">` : '';
                
                card.innerHTML = `
                    <div class="move-header">
                        <div class="move-name" style="display: flex; align-items: center; flex-wrap: wrap;">
                            <span>${move.move_name}</span>${plusMoveIcon}
                        </div>
                        <div class="move-type-badge" style="background: ${typeColor}; color: white;">${move.move_type}</div>
                    </div>
                    <div class="move-details">
                        <div class="move-detail-item">
                            <strong>Power:</strong> ${move.power || '-'}
                        </div>
                        <div class="move-detail-item">
                            <strong>Accuracy:</strong> ${move.accuracy || '-'}%
                        </div>
                        <div class="move-detail-item">
                            <strong>PP:</strong> ${move.pp || '-'}
                        </div>
                        <div class="move-detail-item">
                            <strong>Category:</strong> ${move.category || '-'}
                        </div>
                        <div class="move-detail-item">
                            <strong>Level:</strong> ${move.level || '-'}
                        </div>
                    </div>
                `;
                
                if (!isSelected) {
                    card.addEventListener('click', () => {
                        selectMove(move.move_name);
                    });
                }
                
                container.appendChild(card);
            });
        }
        
        let selectedMoves = ['', '', '', ''];
        
        function selectMove(moveName) {
            // Prevent selecting the same move twice
            if (selectedMoves.includes(moveName)) {
                return;
            }
            
            // Find first empty slot or replace last
            let slotIndex = selectedMoves.findIndex(m => !m);
            if (slotIndex === -1) slotIndex = 3;
            
            selectedMoves[slotIndex] = moveName;
            updateSelectedMoves();
            // Re-render moves list to update selected state
            if (pokeDesignerData.moves && pokeDesignerData.moves.length > 0) {
                const searchInput = document.getElementById('moveSearchInput');
                const searchTerm = searchInput ? searchInput.value : '';
                renderMovesList(pokeDesignerData.moves, searchTerm);
            }
            generateShowdownSet();
        }
        
        function updateSelectedMoves() {
            const slots = document.querySelectorAll('.selected-move-slot');
            const countEl = document.querySelector('#movesTab h3');
            
            let filledCount = selectedMoves.filter(m => m).length;
            if (countEl) {
                countEl.textContent = `Selected Moves (${filledCount}/4)`;
            }
            
            slots.forEach((slot, index) => {
                const moveName = selectedMoves[index];
                if (moveName) {
                    const move = pokeDesignerData.moves.find(m => m.move_name === moveName);
                    if (move) {
                        slot.classList.add('filled');
                        const isPlusMove = move.is_plus_move === 1;
                        const plusMoveIcon = isPlusMove ? `<img src="/pkm/${pokeDesignerData.selectedGame}/misc/plusmove.png" alt="Plus Move" style="width: 16px; height: 16px; margin-left: 0.4rem; vertical-align: middle; display: inline-block;">` : '';
                        slot.innerHTML = `
                            <div style="width: 100%;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                    <strong style="color: var(--text); display: flex; align-items: center;">
                                        ${move.move_name}${plusMoveIcon}
                                    </strong>
                                    <button class="remove-move-btn" data-index="${index}" style="background: var(--error); color: white; border: none; border-radius: 4px; padding: 0.25rem 0.5rem; cursor: pointer; font-size: 0.85rem; transition: all 0.2s ease;">Remove</button>
                                </div>
                                <div style="color: var(--text-muted); font-size: 0.9rem;">
                                    ${move.move_type} | Power: ${move.power || '-'} | Acc: ${move.accuracy || '-'}%
                                </div>
                            </div>
                        `;
                        
                        // Attach event listener to the remove button
                        const removeBtn = slot.querySelector('.remove-move-btn');
                        if (removeBtn) {
                            removeBtn.addEventListener('click', (e) => {
                                e.stopPropagation();
                                removeMove(index);
                            });
                        }
                    }
                } else {
                    slot.classList.remove('filled');
                    slot.innerHTML = `<div style="color: var(--text-muted); text-align: center;">Click to select move ${index + 1}</div>`;
                }
            });
        }
        
        function removeMove(index) {
            selectedMoves[index] = '';
            updateSelectedMoves();
            // Re-render moves list to update selected state
            if (pokeDesignerData.moves && pokeDesignerData.moves.length > 0) {
                const searchInput = document.getElementById('moveSearchInput');
                const searchTerm = searchInput ? searchInput.value : '';
                renderMovesList(pokeDesignerData.moves, searchTerm);
            }
            generateShowdownSet();
        }
        
        // Make removeMove available globally
        window.removeMove = removeMove;

        // Load encounters for selected Pokemon
        async function loadEncounters(game, dexNumber) {
            try {
                const response = await fetch(`/api/pokemon/${game}/${dexNumber}/encounters`);
                const data = await response.json();
                if (data.success) {
                    pokeDesignerData.encounters = data.encounters;
                    const select = document.getElementById('metLocationSelect');
                    if (select) {
                        select.innerHTML = '<option value="">Select a location...</option>';
                        const uniqueLocations = {};
                        data.encounters.forEach(enc => {
                            const key = `${enc.location_id}-${enc.location_name}`;
                            if (!uniqueLocations[key]) {
                                uniqueLocations[key] = enc;
                                const option = document.createElement('option');
                                option.value = enc.location_id;
                                option.textContent = enc.location_name;
                                option.dataset.minLevel = enc.min_level;
                                option.dataset.maxLevel = enc.max_level;
                                option.dataset.metLevel = enc.met_level || enc.min_level;
                                select.appendChild(option);
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('Error loading encounters:', error);
            }
        }

        // Update Pokemon image
        function updatePokemonImage(pokemon) {
            const pokemonImageContainer = document.getElementById('pokemonImageContainer');
            const pokemonImage = document.getElementById('pokemonImage');
            if ((!pokemonImageContainer && !pokemonImage) || !pokemon) return;
            
            // Get shiny status from select or checkbox
            const shinySelect = document.getElementById('shinySelect');
            const shinyCheck = document.getElementById('shinyCheck');
            const isShiny = (shinySelect?.value === 'Yes') || (shinyCheck?.checked) || false;
            const imagePath = isShiny ? pokemon['img-shiny'] : pokemon['img-non-shiny'];
            
            if (imagePath) {
                const imgHtml = `<img src="/pkm/${pokeDesignerData.selectedGame}/${imagePath}" alt="${pokemon.content}" style="max-width: 240px; max-height: 240px; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5)); position: relative; z-index: 3;">`;
                if (pokemonImageContainer) {
                    // Only update the pokemonImage div, not the entire container (to preserve ball preview)
                    const pokemonImage = document.getElementById('pokemonImage');
                    if (pokemonImage) {
                        // Clear and add the image
                        pokemonImage.innerHTML = '';
                        const img = document.createElement('img');
                        img.src = `/pkm/${pokeDesignerData.selectedGame}/${imagePath}`;
                        img.alt = pokemon.content;
                        img.style.cssText = 'max-width: 240px; max-height: 240px; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5)); position: relative; z-index: 3;';
                        pokemonImage.appendChild(img);
                    } else {
                        // Fallback if pokemonImage doesn't exist
                        const ballContainer = pokemonImageContainer.querySelector('#ballPreviewContainer');
                        pokemonImageContainer.innerHTML = imgHtml;
                        if (ballContainer) {
                            pokemonImageContainer.appendChild(ballContainer);
                        }
                    }
                } else if (pokemonImage) {
                    pokemonImage.innerHTML = `<img src="/pkm/${pokeDesignerData.selectedGame}/${imagePath}" alt="${pokemon.content}" style="max-width: 100%; max-height: 300px; border-radius: 8px;">`;
                }
            } else {
                const placeholderHtml = '<div style="color: var(--text-muted); font-size: 0.9rem;">Image not available</div>';
                if (pokemonImageContainer) {
                    const pokemonImage = document.getElementById('pokemonImage');
                    if (pokemonImage) {
                        pokemonImage.innerHTML = placeholderHtml;
                    } else {
                        pokemonImageContainer.innerHTML = placeholderHtml;
                    }
                } else if (pokemonImage) {
                    pokemonImage.innerHTML = '<div style="color: var(--text-muted);">Image not available</div>';
                }
            }
            
            // Update ball preview - show selected ball or default to pokeball.png
            const ballPreviewImage = document.getElementById('ballPreviewImage');
            if (ballPreviewImage) {
                if (pokeDesignerData.selectedBall) {
                    const ball = pokeDesignerData.balls?.find(b => b.name === pokeDesignerData.selectedBall);
                    if (ball && ball.image) {
                        ballPreviewImage.src = `/pkm/${pokeDesignerData.selectedGame}/${ball.image}`;
                        ballPreviewImage.style.display = 'block';
                    } else {
                        // Default to pokeball.png if ball not found
                        ballPreviewImage.src = `/pkm/${pokeDesignerData.selectedGame}/balls/pokeball.png`;
                        ballPreviewImage.style.display = 'block';
                    }
                } else {
                    // Default to pokeball.png if no ball selected
                    ballPreviewImage.src = `/pkm/${pokeDesignerData.selectedGame}/balls/pokeball.png`;
                    ballPreviewImage.style.display = 'block';
                }
                ballPreviewImage.onerror = () => {
                    // Fallback if image doesn't exist
                    ballPreviewImage.src = `/pkm/${pokeDesignerData.selectedGame}/balls/pokeball.png`;
                };
            }
            
            // Update item preview
            const itemPreviewContainer = document.getElementById('itemPreviewContainer');
            if (itemPreviewContainer && pokeDesignerData.selectedItem) {
                const item = pokeDesignerData.items?.find(i => i.name === pokeDesignerData.selectedItem);
                if (item && (item.image || item['img-path'])) {
                    const itemImagePath = item.image || item['img-path'];
                    itemPreviewContainer.innerHTML = `<img src="/pkm/${pokeDesignerData.selectedGame}/${itemImagePath}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: contain;">`;
                } else {
                    itemPreviewContainer.innerHTML = '';
                }
            }
        }

        // Function to reset copy button if showdown set changed (global scope)
        let copyButtonTimeout = null;
        let copyButtonOriginalHTML = null;
        let copiedShowdownSet = null;
        
        function resetCopyButtonIfChanged() {
            const btn = document.getElementById('copySetBtn');
            const output = document.getElementById('showdownOutput');
            
            if (!btn || !output || !copyButtonOriginalHTML) return;
            
            // If button is showing "Copied!" and the showdown set has changed
            if (btn.textContent.includes('Copied!') && copiedShowdownSet !== null) {
                if (output.value !== copiedShowdownSet) {
                    // Clear timeout and reset button
                    if (copyButtonTimeout) {
                        clearTimeout(copyButtonTimeout);
                        copyButtonTimeout = null;
                    }
                    btn.innerHTML = copyButtonOriginalHTML;
                    btn.disabled = false;
                    copiedShowdownSet = null;
                }
            }
        }

        // Generate Pokemon Showdown set (only include provided fields)
        function generateShowdownSet() {
            // Reset copy button if showdown set changed
            resetCopyButtonIfChanged();
            
            const pokemonSelect = document.getElementById('pokemonSelect');
            const selectedPokemon = pokeDesignerData.pokemon.find(p => 
                (p['dex-number'] || p.dex_number) === pokemonSelect?.value
            );
            
            if (!selectedPokemon) {
                document.getElementById('showdownOutput').value = '';
                return;
            }
            
            // Get gender from radio buttons (Basics tab) or select (Core Options)
            const genderRadio = document.querySelector('input[name="gender"]:checked')?.value || '';
            const genderSelect = document.getElementById('genderSelect')?.value || '';
            const gender = genderRadio || genderSelect;
            
            // Get shiny from checkbox (Basics tab) or select (Core Options)
            const shinyCheck = document.getElementById('shinyCheck')?.checked;
            const shinySelect = document.getElementById('shinySelect')?.value;
            const shiny = shinyCheck || shinySelect === 'Yes';
            // Get alpha from checkbox
            const alphaCheck = document.getElementById('alphaCheck')?.checked;
            const level = document.getElementById('levelInput')?.value?.trim();
            const ball = pokeDesignerData.selectedBall || '';
            const item = pokeDesignerData.selectedItem || '';
            const ot = document.getElementById('otInput')?.value?.trim();
            const tid = document.getElementById('tidInput')?.value?.trim();
            const sid = document.getElementById('sidInput')?.value?.trim();
            const language = document.getElementById('languageSelect')?.value?.trim();
            const nature = document.getElementById('natureSelect')?.value?.trim();
            const metLocation = document.getElementById('metLocationSelect');
            const metLocationId = metLocation?.value?.trim();
            const metLocationName = metLocation?.selectedOptions[0]?.textContent || '';
            const metDate = document.getElementById('metDateInput')?.value?.trim();
            const friendship = document.getElementById('friendshipInput')?.value?.trim();
            const scale = document.getElementById('scaleInput')?.value?.trim();
            
            // Get EVs
            const evStats = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'];
            const evs = evStats.map(stat => {
                const slider = document.getElementById(`ev${stat}`);
                return slider ? parseInt(slider.value) || 0 : 0;
            });
            const evString = evs.map((ev, i) => ev > 0 ? `${ev} ${evStats[i]}` : '').filter(e => e).join(' / ');
            
            // Get IVs
            const ivStats = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'];
            const ivs = ivStats.map(stat => {
                const input = document.getElementById(`iv${stat}`);
                return input ? parseInt(input.value) || 31 : 31;
            });
            
            // Get moves from selectedMoves array
            const moves = selectedMoves.filter(m => m);
            
            // Get nickname if provided
            const nickname = document.getElementById('pokemonNickname')?.value?.trim();
            const pokemonNameDisplay = nickname || selectedPokemon.content;
            
            // Build showdown set - only include provided fields
            // Format: nickname (PokemonName) (Gender) if nickname exists, otherwise PokemonName (Gender)
            let set;
            if (nickname) {
                set = `${nickname} (${selectedPokemon.content})`;
                if (gender) set += ` (${gender})`;
            } else {
                set = selectedPokemon.content;
                if (gender) set += ` (${gender})`;
            }
            if (item) set += ` @ ${item}`;
            set += '\n';
            
            if (ball) set += `Ball: ${ball}\n`;
            if (level) set += `Level: ${level}\n`;
            if (shiny !== undefined) set += `Shiny: ${shiny ? 'Yes' : 'No'}\n`;
            if (alphaCheck) set += `Alpha: Yes\n`;
            if (ot) set += `OT: ${ot}\n`;
            if (tid) set += `TID: ${tid}\n`;
            if (sid) set += `SID: ${sid}\n`;
            if (language) set += `Language: ${language}\n`;
            if (evString) set += `EVs: ${evString}\n`;
            if (nature) {
                const natureName = nature.split(' ')[0];
                set += `${natureName} Nature\n`;
            }
            if (metLocationId) {
                set += `.MetLocation=${metLocationId}\n`;
                const metLevelOption = metLocation?.selectedOptions[0];
                const metLevel = metLevelOption?.dataset.metLevel;
                if (metLevel) set += `.MetLevel=${metLevel}\n`;
                
                if (metLocationName.includes('Version')) {
                    const versionMatch = metLocationName.match(/Version (\d+)/);
                    if (versionMatch) set += `.Version=${versionMatch[1]}\n`;
                }
            }
            if (scale && scale !== '0') set += `.Scale=${scale}\n`;
            // Add Relearn Moves if checked
            const relearnSuggestAll = document.getElementById('relearnSuggestAll')?.checked;
            const relearnSuggestNone = document.getElementById('relearnSuggestNone')?.checked;
            if (relearnSuggestAll) set += `.RelearnMoves=$suggestAll\n`;
            if (relearnSuggestNone) set += `.RelearnMoves=$suggestNone\n`;
            if (metDate) {
                const date = new Date(metDate);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                set += `.MetDate=${year}${month}${day}\n`;
            }
            if (friendship && friendship !== '0') {
                set += `Friendship: ${friendship}\n`;
                set += `.OriginalTrainerFriendship=${friendship}\n`;
            }
            moves.forEach(move => {
                set += `- ${move}\n`;
            });
            
            document.getElementById('showdownOutput').value = set;
        }
        
        // Make generateShowdownSet globally accessible for inline HTML handlers
        window.generateShowdownSet = generateShowdownSet;

        // Tab switching
        function switchDesignerTab(tabName) {
            // Remove active from all tabs and hide all panels
            document.querySelectorAll('.designer-tab').forEach(tab => {
                tab.classList.remove('active');
                // Reset tab indicator
                const indicator = tab.querySelector('div[style*="position: absolute; bottom"]');
                if (indicator) indicator.style.width = '0';
            });
            document.querySelectorAll('.designer-tab-panel').forEach(panel => {
                panel.classList.remove('active');
                panel.style.display = 'none';
            });
            
            // Activate selected tab and panel
            const tab = document.querySelector(`.designer-tab[data-tab="${tabName}"]`);
            const panel = document.getElementById(`${tabName}Tab`);
            
            if (tab) {
                tab.classList.add('active');
                // Show tab indicator
                const indicator = tab.querySelector('div[style*="position: absolute; bottom"]');
                if (indicator) indicator.style.width = '80%';
            }
            if (panel) {
                panel.classList.add('active');
                panel.style.display = 'block';
            }
        }
        
        // Initialize Poké Designer
        function initPokeDesigner() {
            if (window.location.pathname !== '/trading/poke-designer') return;
            
            // Show Poké Designer tab
            document.getElementById('homeTab')?.classList.remove('active');
            document.getElementById('accountTab')?.classList.remove('active');
            document.getElementById('pokeDesignerTab')?.classList.add('active');
            
            // Initialize stat sliders (only EVs get hexagon)
            // Initialize EV sliders and hexagon
            initStatSliders('ev');
            // Initialize IV number inputs
            initStatSliders('iv');
            // Initialize IV totals (default all 31)
            updateStats('iv');
            
            // Tab switching
            document.querySelectorAll('.designer-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    switchDesignerTab(tab.dataset.tab);
                });
            });
            
            // Game selection handler
            const gameSelect = document.getElementById('gameSelect');
            if (gameSelect) {
                gameSelect.addEventListener('change', async (e) => {
                    pokeDesignerData.selectedGame = e.target.value;
                    await loadPokemon(e.target.value);
                    await loadBalls(e.target.value);
                    await loadItems(e.target.value);
                });
                
                // Load initial data - await to ensure it completes
                (async () => {
                    try {
                        await loadPokemon(gameSelect.value);
                        await loadBalls(gameSelect.value);
                        await loadItems(gameSelect.value);
                    } catch (error) {
                        console.error('Error loading initial data:', error);
                    }
                })();
            }
            
            // Pokemon selection handler
            const pokemonSelect = document.getElementById('pokemonSelect');
            if (pokemonSelect) {
                pokemonSelect.addEventListener('change', async (e) => {
                    const dexNumber = e.target.value;
                    if (dexNumber) {
                        const pokemon = pokeDesignerData.pokemon.find(p => 
                            (p['dex-number'] || p.dex_number) === dexNumber
                        );
                        pokeDesignerData.selectedPokemon = pokemon;
                        updatePokemonImage(pokemon);
                        await loadMoves(pokeDesignerData.selectedGame, dexNumber);
                        await loadEncounters(pokeDesignerData.selectedGame, dexNumber);
                    }
                    generateShowdownSet();
                });
            }
            
            // Shiny checkbox handler
            const shinyCheck = document.getElementById('shinyCheck');
            if (shinyCheck) {
                shinyCheck.addEventListener('change', () => {
                    if (pokeDesignerData.selectedPokemon) {
                        updatePokemonImage(pokeDesignerData.selectedPokemon);
                    }
                    generateShowdownSet();
                });
            }
            
            // Alpha checkbox handler
            const alphaCheck = document.getElementById('alphaCheck');
            if (alphaCheck) {
                alphaCheck.addEventListener('change', () => {
                    generateShowdownSet();
                });
            }
            
            // Item search and dropdown
            const itemSearchInput = document.getElementById('itemSearchInput');
            const itemDropdown = document.getElementById('itemDropdown');
            if (itemSearchInput && itemDropdown) {
                itemSearchInput.addEventListener('focus', () => {
                    if (pokeDesignerData.items.length > 0) {
                        itemDropdown.style.display = 'block';
                        renderItemDropdown(pokeDesignerData.items, '');
                    }
                });
                
                itemSearchInput.addEventListener('input', (e) => {
                    renderItemDropdown(pokeDesignerData.items, e.target.value);
                    itemDropdown.style.display = 'block';
                });
                
                // Close dropdown when clicking outside
                const itemContainer = document.getElementById('itemSelectContainer');
                document.addEventListener('click', (e) => {
                    if (itemContainer && !itemContainer.contains(e.target)) {
                        itemDropdown.style.display = 'none';
                    }
                });
            }
            
            // Move search
            const moveSearchInput = document.getElementById('moveSearchInput');
            if (moveSearchInput) {
                moveSearchInput.addEventListener('input', (e) => {
                    renderMovesList(pokeDesignerData.moves, e.target.value);
                });
            }
            
            // Selected move slots
            document.querySelectorAll('.selected-move-slot').forEach(slot => {
                slot.addEventListener('click', () => {
                    // Switch to moves tab if not already there
                    switchDesignerTab('moves');
                });
            });
            
            // Met location handler
            const metLocationSelect = document.getElementById('metLocationSelect');
            if (metLocationSelect) {
                metLocationSelect.addEventListener('change', (e) => {
                    const option = e.target.selectedOptions[0];
                    const minLevel = option?.dataset.minLevel;
                    const maxLevel = option?.dataset.maxLevel;
                    const levelInput = document.getElementById('levelInput');
                    const levelError = document.getElementById('levelError');
                    const locationLevelRange = document.getElementById('locationLevelRange');
                    
                    if (minLevel && maxLevel) {
                        locationLevelRange.textContent = `Level range: ${minLevel} - ${maxLevel}`;
                        if (levelInput) {
                            levelInput.min = minLevel;
                            levelInput.max = maxLevel;
                            if (parseInt(levelInput.value) < parseInt(minLevel)) {
                                levelInput.value = minLevel;
                            }
                            if (parseInt(levelInput.value) > parseInt(maxLevel)) {
                                levelInput.value = maxLevel;
                            }
                        }
                    } else {
                        locationLevelRange.textContent = '';
                    }
                    generateShowdownSet();
                });
            }
            
            // Level input handler
            const levelInput = document.getElementById('levelInput');
            if (levelInput) {
                levelInput.addEventListener('input', () => {
                    const metLocation = document.getElementById('metLocationSelect');
                    const option = metLocation?.selectedOptions[0];
                    const minLevel = option?.dataset.minLevel;
                    const maxLevel = option?.dataset.maxLevel;
                    const levelError = document.getElementById('levelError');
                    
                    if (minLevel && maxLevel) {
                        const level = parseInt(levelInput.value);
                        if (level < parseInt(minLevel) || level > parseInt(maxLevel)) {
                            levelError.textContent = `Level must be between ${minLevel} and ${maxLevel}`;
                            levelError.style.display = 'block';
                        } else {
                            levelError.style.display = 'none';
                        }
                    }
                    generateShowdownSet();
                });
                
                // Level increment/decrement buttons
                const levelIncrement = document.getElementById('levelIncrement');
                const levelDecrement = document.getElementById('levelDecrement');
                
                if (levelIncrement) {
                    levelIncrement.addEventListener('click', () => {
                        const metLocation = document.getElementById('metLocationSelect');
                        const option = metLocation?.selectedOptions[0];
                        const maxLevel = option?.dataset.maxLevel ? parseInt(option.dataset.maxLevel) : 100;
                        const currentLevel = parseInt(levelInput.value) || 1;
                        const newLevel = Math.min(currentLevel + 1, maxLevel);
                        levelInput.value = newLevel;
                        levelInput.dispatchEvent(new Event('input'));
                    });
                }
                
                if (levelDecrement) {
                    levelDecrement.addEventListener('click', () => {
                        const metLocation = document.getElementById('metLocationSelect');
                        const option = metLocation?.selectedOptions[0];
                        const minLevel = option?.dataset.minLevel ? parseInt(option.dataset.minLevel) : 1;
                        const currentLevel = parseInt(levelInput.value) || 1;
                        const newLevel = Math.max(currentLevel - 1, minLevel);
                        levelInput.value = newLevel;
                        levelInput.dispatchEvent(new Event('input'));
                    });
                }
            }
            
            // SID input validation (4 digits max, value max 4293)
            const sidInput = document.getElementById('sidInput');
            if (sidInput) {
                sidInput.addEventListener('input', (e) => {
                    // Only allow digits
                    let value = sidInput.value.replace(/[^0-9]/g, '');
                    
                    // Limit to 4 digits
                    if (value.length > 4) {
                        value = value.substring(0, 4);
                    }
                    
                    // Check if numeric value exceeds 4293
                    const numValue = parseInt(value) || 0;
                    if (numValue > 4293) {
                        value = '4293';
                    }
                    
                    sidInput.value = value;
                    generateShowdownSet();
                });
            }
            
            // OT input maxlength based on language
            const otInput = document.getElementById('otInput');
            const languageSelect = document.getElementById('languageSelect');
            if (otInput && languageSelect) {
                const updateOTMaxLength = () => {
                    const language = languageSelect.value;
                    const asianLanguages = ['ChineseS', 'ChineseT', 'Korean', 'Japanese'];
                    if (asianLanguages.includes(language)) {
                        otInput.maxLength = 6;
                    } else {
                        otInput.maxLength = 12;
                    }
                    // Truncate if current value exceeds new limit
                    if (otInput.value.length > otInput.maxLength) {
                        otInput.value = otInput.value.substring(0, otInput.maxLength);
                    }
                };
                
                languageSelect.addEventListener('change', () => {
                    updateOTMaxLength();
                    generateShowdownSet();
                });
                
                // Set initial maxlength
                updateOTMaxLength();
            }
            
            // Gender radio buttons (for Basics tab)
            document.querySelectorAll('input[name="gender"]').forEach(radio => {
                radio.addEventListener('change', generateShowdownSet);
            });
            
            // Gender select (for Core Options)
            const genderSelect = document.getElementById('genderSelect');
            if (genderSelect) {
                genderSelect.addEventListener('change', generateShowdownSet);
            }
            
            // Shiny select (for Core Options)
            const shinySelect = document.getElementById('shinySelect');
            if (shinySelect) {
                shinySelect.addEventListener('change', () => {
                    if (pokeDesignerData.selectedPokemon) {
                        updatePokemonImage(pokeDesignerData.selectedPokemon);
                    }
                    generateShowdownSet();
                });
            }
            
            // Level buttons removed - using simple number input only
            
            // Pokemon nickname
            const pokemonNickname = document.getElementById('pokemonNickname');
            if (pokemonNickname) {
                pokemonNickname.addEventListener('input', generateShowdownSet);
            }
            
            // Ball search and dropdown
            const ballSearchInput = document.getElementById('ballSearchInput');
            const ballDropdown = document.getElementById('ballDropdown');
            if (ballSearchInput && ballDropdown) {
                ballSearchInput.addEventListener('focus', () => {
                    if (pokeDesignerData.balls.length > 0) {
                        ballDropdown.style.display = 'block';
                        renderBallDropdown(pokeDesignerData.balls, '');
                    }
                });
                
                ballSearchInput.addEventListener('input', (e) => {
                    renderBallDropdown(pokeDesignerData.balls, e.target.value);
                    ballDropdown.style.display = 'block';
                });
                
                // Close dropdown when clicking outside
                const ballContainer = document.getElementById('ballSelectContainer');
                document.addEventListener('click', (e) => {
                    if (ballContainer && !ballContainer.contains(e.target)) {
                        ballDropdown.style.display = 'none';
                    }
                });
            }
            
            // Randomize EVs button
            document.getElementById('randomizeEVBtn')?.addEventListener('click', randomizeEVs);
            
            // All other inputs
            ['natureSelect', 'otInput', 'tidInput', 'sidInput', 'languageSelect', 'metDateInput', 'friendshipInput', 'scaleInput'].forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('change', generateShowdownSet);
                    element.addEventListener('input', generateShowdownSet);
                }
            });
            
            // Relearn moves checkboxes
            const relearnSuggestAll = document.getElementById('relearnSuggestAll');
            const relearnSuggestNone = document.getElementById('relearnSuggestNone');
            
            if (relearnSuggestAll) {
                relearnSuggestAll.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        pokeDesignerData.relearnMoves.push('$suggestAll');
                        // Uncheck the other if both can't be selected
                        if (relearnSuggestNone) relearnSuggestNone.checked = false;
                        pokeDesignerData.relearnMoves = pokeDesignerData.relearnMoves.filter(m => m !== '$suggestNone');
                    } else {
                        pokeDesignerData.relearnMoves = pokeDesignerData.relearnMoves.filter(m => m !== '$suggestAll');
                    }
                    generateShowdownSet();
                });
            }
            
            if (relearnSuggestNone) {
                relearnSuggestNone.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        pokeDesignerData.relearnMoves.push('$suggestNone');
                        // Uncheck the other if both can't be selected
                        if (relearnSuggestAll) relearnSuggestAll.checked = false;
                        pokeDesignerData.relearnMoves = pokeDesignerData.relearnMoves.filter(m => m !== '$suggestAll');
                    } else {
                        pokeDesignerData.relearnMoves = pokeDesignerData.relearnMoves.filter(m => m !== '$suggestNone');
                    }
                    generateShowdownSet();
                });
            }
            
            // Friendship and scale value displays
            const friendshipInput = document.getElementById('friendshipInput');
            const friendshipValue = document.getElementById('friendshipValue');
            if (friendshipInput && friendshipValue) {
                friendshipInput.addEventListener('input', (e) => {
                    friendshipValue.textContent = e.target.value;
                    generateShowdownSet();
                });
            }
            
            const scaleInput = document.getElementById('scaleInput');
            const scaleValue = document.getElementById('scaleValue');
            if (scaleInput && scaleValue) {
                scaleInput.addEventListener('input', (e) => {
                    scaleValue.textContent = e.target.value;
                    generateShowdownSet();
                });
            }
            
            // Copy set button - track state
            // Store original HTML on first access
            const copyBtn = document.getElementById('copySetBtn');
            if (copyBtn && !copyButtonOriginalHTML) {
                copyButtonOriginalHTML = copyBtn.innerHTML;
            }
            
            document.getElementById('copySetBtn')?.addEventListener('click', async () => {
                const btn = document.getElementById('copySetBtn');
                if (!btn) return;
                
                // Store original HTML if not already stored
                if (!copyButtonOriginalHTML) {
                    copyButtonOriginalHTML = btn.innerHTML;
                }
                
                // If already showing "Copied!", don't do anything
                if (btn.textContent.includes('Copied!')) return;
                
                // Clear any existing timeout
                if (copyButtonTimeout) {
                    clearTimeout(copyButtonTimeout);
                }
                
                const output = document.getElementById('showdownOutput');
                if (output && output.value) {
                    // Store the copied showdown set
                    copiedShowdownSet = output.value;
                    
                    try {
                        await navigator.clipboard.writeText(output.value);
                        btn.innerHTML = '<i class="fas fa-check" style="margin-right: 0.5rem;"></i> Copied!';
                        btn.disabled = true;
                        copyButtonTimeout = setTimeout(() => {
                            // Only revert if the showdown set hasn't changed
                            if (copiedShowdownSet === output.value) {
                                btn.innerHTML = copyButtonOriginalHTML;
                                btn.disabled = false;
                            }
                            copyButtonTimeout = null;
                        }, 2500);
                    } catch (err) {
                        // Fallback for older browsers
                        output.select();
                        document.execCommand('copy');
                        btn.innerHTML = '<i class="fas fa-check" style="margin-right: 0.5rem;"></i> Copied!';
                        btn.disabled = true;
                        copyButtonTimeout = setTimeout(() => {
                            // Only revert if the showdown set hasn't changed
                            if (copiedShowdownSet === output.value) {
                                btn.innerHTML = copyButtonOriginalHTML;
                                btn.disabled = false;
                            }
                            copyButtonTimeout = null;
                        }, 2500);
                    }
                }
            });
            
            // Share button - create shareable URL
            let shareButtonTimeout = null;
            document.getElementById('shareBtn')?.addEventListener('click', () => {
                const btn = document.getElementById('shareBtn');
                if (!btn) return;
                
                // If already showing "Link Copied!", don't do anything
                if (btn.textContent.includes('Link Copied!')) return;
                
                // Clear any existing timeout
                if (shareButtonTimeout) {
                    clearTimeout(shareButtonTimeout);
                }
                
                const params = new URLSearchParams();
                
                // Get current editor state
                const gameSelect = document.getElementById('gameSelect');
                const pokemonSelect = document.getElementById('pokemonSelect');
                const levelInput = document.getElementById('levelInput');
                const ballSearchInput = document.getElementById('ballSearchInput');
                const genderM = document.getElementById('genderM');
                const genderF = document.getElementById('genderF');
                const shinyCheck = document.getElementById('shinyCheck');
                const scaleInput = document.getElementById('scaleInput');
                
                if (gameSelect?.value) params.set('game', gameSelect.value);
                if (pokemonSelect?.value) {
                    const pokemon = pokeDesignerData.pokemon.find(p => 
                        (p['dex-number'] || p.dex_number) === pokemonSelect.value
                    );
                    if (pokemon) {
                        params.set('pokemon', pokemon.content || pokemon.name);
                    }
                }
                if (levelInput?.value) params.set('level', levelInput.value);
                if (ballSearchInput?.value) params.set('ball', encodeURIComponent(ballSearchInput.value));
                
                // Gender
                if (genderM?.checked) params.set('gender', 'Male');
                else if (genderF?.checked) params.set('gender', 'Female');
                
                // Shiny (using gmax as the example showed, but it's actually shiny)
                if (shinyCheck?.checked) params.set('gmax', 'Yes');
                else params.set('gmax', 'No');
                
                if (scaleInput?.value) params.set('scale', scaleInput.value);
                
                // Create shareable URL
                const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
                
                // Copy to clipboard
                navigator.clipboard.writeText(shareUrl).then(() => {
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-check" style="margin-right: 0.5rem;"></i> Link Copied!';
                    btn.disabled = true;
                    shareButtonTimeout = setTimeout(() => {
                        btn.innerHTML = originalHTML;
                        btn.disabled = false;
                        shareButtonTimeout = null;
                    }, 2500);
                }).catch(err => {
                    console.error('Failed to copy share URL:', err);
                    // Fallback: show URL in prompt
                    const userUrl = prompt('Copy this URL:', shareUrl);
                    if (userUrl) {
                        const originalHTML = btn.innerHTML;
                        btn.innerHTML = '<i class="fas fa-check" style="margin-right: 0.5rem;"></i> Link Copied!';
                        btn.disabled = true;
                        shareButtonTimeout = setTimeout(() => {
                            btn.innerHTML = originalHTML;
                            btn.disabled = false;
                            shareButtonTimeout = null;
                        }, 2500);
                    }
                });
            });
            
            // Trade button - redirect to trade page with showdown set
            document.getElementById('tradeBtn')?.addEventListener('click', () => {
                const output = document.getElementById('showdownOutput');
                const gameSelect = document.getElementById('gameSelect');
                
                if (!output || !output.value || !output.value.trim()) {
                    showNotification('Please generate a Pokemon set first!', 'warning');
                    return;
                }
                
                if (!gameSelect || !gameSelect.value) {
                    showNotification('Please select a game first!', 'warning');
                    return;
                }
                
                // Encode the showdown set for URL
                const encodedSet = encodeURIComponent(output.value);
                const gameMode = gameSelect.value;
                
                // Redirect to trade page
                window.location.href = `/trading/trade?showdownSet=${encodedSet}&gameMode=${gameMode}`;
            });
            
            // Load editor state from URL parameters
            async function loadFromURLParams() {
                const urlParams = new URLSearchParams(window.location.search);
                
                if (urlParams.size === 0) return; // No parameters, skip
                
                // Load showdownSet and gameMode from URL (for direct links to designer with trade data)
                const showdownSet = urlParams.get('showdownSet');
                const gameMode = urlParams.get('gameMode');
                
                if (showdownSet || gameMode) {
                    // If showdownSet is provided, load it into the output
                    if (showdownSet) {
                        const output = document.getElementById('showdownOutput');
                        if (output) {
                            const decodedSet = decodeURIComponent(showdownSet);
                            output.value = decodedSet;
                        }
                    }
                    
                    // If gameMode is provided, set the game select
                    if (gameMode) {
                        const gameSelect = document.getElementById('gameSelect');
                        if (gameSelect) {
                            gameSelect.value = gameMode;
                            pokeDesignerData.selectedGame = gameMode;
                            // Wait for game data to load
                            await loadPokemon(gameMode);
                            await loadBalls(gameMode);
                            await loadItems(gameMode);
                        }
                    }
                    
                    // If we loaded from URL params, don't continue with other parameter loading
                    // (to avoid overwriting the showdown set)
                    return;
                }
                
                // Load game
                const game = urlParams.get('game');
                if (game) {
                    const gameSelect = document.getElementById('gameSelect');
                    if (gameSelect) {
                        gameSelect.value = game;
                        pokeDesignerData.selectedGame = game;
                        // Wait for game data to load
                        await loadPokemon(game);
                        await loadBalls(game);
                        await loadItems(game);
                    }
                }
                
                // Wait a bit for data to populate, then load Pokemon
                await new Promise(resolve => setTimeout(resolve, 300));
                
                const pokemonName = urlParams.get('pokemon');
                if (pokemonName && pokeDesignerData.pokemon.length > 0) {
                    const pokemon = pokeDesignerData.pokemon.find(p => 
                        (p.content || p.name || '').toLowerCase() === pokemonName.toLowerCase()
                    );
                    if (pokemon) {
                        const pokemonSelect = document.getElementById('pokemonSelect');
                        if (pokemonSelect) {
                            pokemonSelect.value = pokemon['dex-number'] || pokemon.dex_number;
                            // Wait for moves and encounters to load
                            await loadMoves(pokeDesignerData.selectedGame, pokemon['dex-number'] || pokemon.dex_number);
                            await loadEncounters(pokeDesignerData.selectedGame, pokemon['dex-number'] || pokemon.dex_number);
                            // Trigger change event to update image and generate set
                            pokemonSelect.dispatchEvent(new Event('change'));
                        }
                    }
                }
                
                // Wait a bit more for Pokemon to fully load
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Load other fields
                const level = urlParams.get('level');
                if (level) {
                    const levelInput = document.getElementById('levelInput');
                    if (levelInput) {
                        levelInput.value = level;
                        levelInput.dispatchEvent(new Event('input'));
                    }
                }
                
                const ball = urlParams.get('ball');
                if (ball && pokeDesignerData.balls && pokeDesignerData.balls.length > 0) {
                    const ballSearchInput = document.getElementById('ballSearchInput');
                    if (ballSearchInput) {
                        const decodedBall = decodeURIComponent(ball);
                        ballSearchInput.value = decodedBall;
                        // Trigger ball selection
                        const ballOption = pokeDesignerData.balls.find(b => b.name === decodedBall);
                        if (ballOption) {
                            const ballImagePath = getBallImagePath(decodedBall);
                            selectBall(decodedBall, ballImagePath);
                        }
                    }
                }
                
                const gender = urlParams.get('gender');
                if (gender) {
                    if (gender === 'Male') {
                        const genderM = document.getElementById('genderM');
                        if (genderM) {
                            genderM.checked = true;
                            genderM.dispatchEvent(new Event('change'));
                        }
                    } else if (gender === 'Female') {
                        const genderF = document.getElementById('genderF');
                        if (genderF) {
                            genderF.checked = true;
                            genderF.dispatchEvent(new Event('change'));
                        }
                    }
                }
                
                const gmax = urlParams.get('gmax');
                if (gmax) {
                    const shinyCheck = document.getElementById('shinyCheck');
                    if (shinyCheck) {
                        shinyCheck.checked = gmax === 'Yes';
                        shinyCheck.dispatchEvent(new Event('change'));
                    }
                }
                
                const scale = urlParams.get('scale');
                if (scale) {
                    const scaleInput = document.getElementById('scaleInput');
                    const scaleValue = document.getElementById('scaleValue');
                    if (scaleInput) {
                        scaleInput.value = scale;
                        if (scaleValue) scaleValue.textContent = scale;
                        scaleInput.dispatchEvent(new Event('input'));
                    }
                }
                
                // Regenerate showdown set after loading
                setTimeout(() => {
                    generateShowdownSet();
                }, 300);
            }
            
            // Call loadFromURLParams after initial data loads
            // Also call it immediately if URL has parameters
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('showdownSet') || urlParams.has('gameMode') || urlParams.has('game') || urlParams.has('pokemon')) {
                // If URL has parameters, load them immediately after a short delay
                setTimeout(() => {
                    loadFromURLParams();
                }, 100);
            } else {
                // Otherwise wait for full data load
                setTimeout(() => {
                    loadFromURLParams();
                }, 500);
            }
            
            // Also listen for URL changes (for SPA navigation)
            let lastUrl = window.location.href;
            setInterval(() => {
                if (window.location.href !== lastUrl) {
                    lastUrl = window.location.href;
                    const newParams = new URLSearchParams(window.location.search);
                    if (newParams.has('showdownSet') || newParams.has('gameMode') || newParams.has('game') || newParams.has('pokemon')) {
                        setTimeout(() => {
                            loadFromURLParams();
                        }, 100);
                    }
                }
            }, 500);
        }
        
        // Global trade status functions (must be defined before any page initialization)
        // Hide file trader form after submission (global so it can be called from anywhere)
        window.hideFileTraderForm = function() {
            const fileTraderPage = document.getElementById('fileTraderPage');
            const form = document.getElementById('fileTraderForm');
            const backBtn = document.getElementById('fileTradeBackBtn');
            
            // Hide the header section (title and description) - same as showdown trader
            if (fileTraderPage) {
                // Find the header div (the one with margin-bottom: 3rem containing h1 and p)
                const leftSideSection = fileTraderPage.querySelector('div[style*="padding: 4rem 3rem"]');
                if (leftSideSection) {
                    const innerContainer = leftSideSection.querySelector('div[style*="max-width: 600px"]');
                    if (innerContainer) {
                        const headerDiv = innerContainer.querySelector('div[style*="margin-bottom: 3rem"]');
                        if (headerDiv) {
                            headerDiv.style.display = 'none';
                        }
                    }
                }
            }
            
            // Show back button first (before hiding container) - same as showdown trader
            if (backBtn) {
                backBtn.style.display = 'flex';
            }
            
            // Hide the entire form section - same as showdown trader
            if (form) {
                form.style.display = 'none';
            }
            
            // Hide individual form elements as fallback - same as showdown trader
            const gameModeSelect = document.getElementById('fileGameModeSelect');
            const gameModeLabel = document.querySelector('label[for="fileGameModeSelect"]');
            const fileUploadArea = document.getElementById('fileUploadArea');
            const fileInputLabel = document.querySelector('label[for="pkmFileInput"]');
            const submitBtn = document.getElementById('fileTradeSubmitBtn');
            const actionsContainer = document.querySelector('#fileTraderForm .trade-page-actions');
            
            if (gameModeSelect) gameModeSelect.style.display = 'none';
            if (gameModeLabel) gameModeLabel.style.display = 'none';
            if (fileUploadArea) fileUploadArea.style.display = 'none';
            if (fileInputLabel) fileInputLabel.style.display = 'none';
            if (submitBtn) submitBtn.style.display = 'none';
            if (actionsContainer) actionsContainer.style.display = 'none';
        };
        
        // Show trade status UI with logs (make global so both trade pages can use it)
        window.showTradeStatus = function(tradeData) {
            // Check which page is active - file trader or showdown trader
            const currentPath = window.location.pathname;
            const fileTraderPage = document.getElementById('fileTraderPage');
            const tradePageContainer = document.getElementById('tradePageContainer');
            
            // On showdown trade page, replace the bot status container with trade status
            if (currentPath === '/trading/trade' && tradePageContainer) {
                const botStatusContainer = document.getElementById('tradeStatusContainer');
                if (botStatusContainer) {
                    // Hide bot status loading/content/error
                    const botStatusLoading = document.getElementById('tradeStatusLoading');
                    const botStatusContent = document.getElementById('tradeStatusContent');
                    const botStatusError = document.getElementById('tradeStatusError');
                    if (botStatusLoading) botStatusLoading.style.display = 'none';
                    if (botStatusContent) botStatusContent.style.display = 'none';
                    if (botStatusError) botStatusError.style.display = 'none';
                    
                    // Hide the "Bot Status" heading and icon/image above the container
                    const rightSideSection = botStatusContainer.closest('div[style*="padding: 4rem 3rem"]');
                    if (rightSideSection) {
                        // Find and hide the icon/image div (the one with pokemon_showdown.png)
                        const iconDiv = rightSideSection.querySelector('div[style*="width: 200px"]');
                        if (iconDiv) iconDiv.style.display = 'none';
                        
                        // Find and hide the "Bot Status" h2 heading
                        const heading = rightSideSection.querySelector('h2');
                        if (heading && heading.textContent.includes('Bot Status')) {
                            heading.style.display = 'none';
                        }
                        
                        // Adjust padding to start higher up and use full height
                        rightSideSection.style.paddingTop = '2rem';
                        rightSideSection.style.paddingBottom = '2rem';
                        rightSideSection.style.justifyContent = 'flex-start';
                        rightSideSection.style.overflowY = 'auto';
                        
                        // Remove max-width constraint on inner container to use full width
                        const innerContainer = rightSideSection.querySelector('div[style*="max-width: 600px"]');
                        if (innerContainer) {
                            innerContainer.style.maxWidth = '100%';
                            innerContainer.style.width = '100%';
                        }
                    }
                    
                    // Replace the container content with trade status
                    botStatusContainer.innerHTML = '';
                    botStatusContainer.style.textAlign = 'left';
                    botStatusContainer.style.maxWidth = '100%';
                    botStatusContainer.style.width = '100%';
                    
                    // Create trade status display inside the container
                    const statusDiv = document.createElement('div');
                    statusDiv.id = 'tradeStatusDisplay';
                    statusDiv.className = 'trade-status-display';
                    statusDiv.style.cssText = 'width: 100%; padding: 0;';
                    botStatusContainer.appendChild(statusDiv);
                    
                    // Compact, efficient layout
                    statusDiv.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 2px solid rgba(140, 82, 255, 0.3);">
                    <h2 style="margin: 0; color: var(--text); font-size: 1.25rem; font-weight: 700;">Trade Status</h2>
                    <span id="tradeStatusBadge" style="padding: 0.4rem 0.875rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; background: rgba(140, 82, 255, 0.2); color: var(--primary); text-transform: capitalize;">
                        ${tradeData.status === 'in_progress' ? 'In Progress' : (tradeData.status || 'Pending').charAt(0).toUpperCase() + (tradeData.status || 'Pending').slice(1).replace('_', ' ')}
                    </span>
                </div>
                
                <div id="currentStatus" style="margin-bottom: 1rem; padding: 0.875rem; background: rgba(140, 82, 255, 0.1); border-left: 3px solid var(--primary); border-radius: 8px;">
                    <div style="color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.375rem; text-transform: uppercase; letter-spacing: 0.05em;">Current Status</div>
                    <div id="currentStatusText" style="color: var(--text); font-weight: 600; font-size: 0.95rem;">Waiting for bot assignment...</div>
                </div>
                
                <div id="tradeStatusDetails" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.25rem; padding: 1.25rem; background: rgba(0, 0, 0, 0.2); border-radius: 8px;">
                    <div>
                        <div style="color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Trade Code</div>
                        <div style="color: var(--text); font-weight: 700; font-family: monospace; font-size: 1.5rem; letter-spacing: 0.1em;">${tradeData.trade_code || 'N/A'}</div>
                    </div>
                    <div>
                        <div style="color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Game</div>
                        <div style="color: var(--text); font-weight: 600; text-transform: uppercase; font-size: 1.1rem;">${tradeData.game_mode || 'N/A'}</div>
                    </div>
                    ${tradeData.queue_position ? `
                    <div>
                        <div style="color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Queue</div>
                        <div style="color: var(--text); font-weight: 600; font-size: 1.1rem;">${tradeData.queue_position}${tradeData.total_in_queue ? ` / ${tradeData.total_in_queue}` : ''}</div>
                    </div>
                    ` : ''}
                    <div>
                        <div style="color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Trade ID</div>
                        <div style="color: var(--text); font-weight: 600; font-family: monospace; font-size: 1rem;">${tradeData.trade_id ? tradeData.trade_id.substring(0, 8) + '...' : 'N/A'}</div>
                    </div>
                </div>
                
                <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                        <h3 style="color: var(--text); font-size: 0.95rem; font-weight: 600; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">Trade Logs</h3>
                        <button id="toggleLogsBtn" style="background: transparent; border: 1px solid var(--border); color: var(--text-muted); padding: 0.375rem 0.75rem; border-radius: 6px; font-size: 0.8rem; cursor: pointer; transition: var(--transition);" onclick="toggleTradeLogs(this);">
                            Hide Logs
                        </button>
                    </div>
                    <div id="tradeLogs" style="display: block; max-height: calc(100vh - 500px); min-height: 300px; overflow-y: auto; background: rgba(0, 0, 0, 0.3); border-radius: 8px; padding: 0.875rem; font-family: monospace; font-size: 0.8rem; line-height: 1.6;">
                        <!-- Logs will be populated here -->
                    </div>
                </div>
            `;
                    
                    // Add toggle function for logs
                    window.toggleTradeLogs = function(btn) {
                        const logs = document.getElementById('tradeLogs');
                        if (logs) {
                            const isHidden = logs.style.display === 'none';
                            logs.style.display = isHidden ? 'block' : 'none';
                            if (btn) {
                                btn.textContent = isHidden ? 'Hide Logs' : 'Show Logs';
                            }
                        }
                    };
                    
                    // Update display with initial data
                    if (typeof window.updateTradeStatusDisplay === 'function') {
                        window.updateTradeStatusDisplay(tradeData);
                    }
                    
                    return; // Exit early for showdown trade page
                }
            }
            
            // On file trader page, replace the bot status container with trade status
            if ((currentPath === '/trading/file-trader' || currentPath === '/file-trader') && fileTraderPage) {
                const botStatusContainer = document.getElementById('fileStatusContainer');
                if (botStatusContainer) {
                    // Hide bot status loading/content/error
                    const botStatusLoading = document.getElementById('fileStatusLoading');
                    const botStatusContent = document.getElementById('fileStatusContent');
                    const botStatusError = document.getElementById('fileStatusError');
                    if (botStatusLoading) botStatusLoading.style.display = 'none';
                    if (botStatusContent) botStatusContent.style.display = 'none';
                    if (botStatusError) botStatusError.style.display = 'none';
                    
                    // Hide the "Bot Status" heading and icon/image above the container
                    const rightSideSection = botStatusContainer.closest('div[style*="padding: 4rem 3rem"]');
                    if (rightSideSection) {
                        // Find and hide the icon/image div
                        const iconDiv = rightSideSection.querySelector('div[style*="width: 200px"]');
                        if (iconDiv) iconDiv.style.display = 'none';
                        
                        // Find and hide the "Bot Status" h2 heading
                        const heading = rightSideSection.querySelector('h2');
                        if (heading && heading.textContent.includes('Bot Status')) {
                            heading.style.display = 'none';
                        }
                        
                        // Adjust padding to start higher up and use full height
                        rightSideSection.style.paddingTop = '2rem';
                        rightSideSection.style.paddingBottom = '2rem';
                        rightSideSection.style.justifyContent = 'flex-start';
                        rightSideSection.style.overflowY = 'auto';
                        
                        // Remove max-width constraint on inner container to use full width
                        const innerContainer = rightSideSection.querySelector('div[style*="max-width: 600px"]');
                        if (innerContainer) {
                            innerContainer.style.maxWidth = '100%';
                            innerContainer.style.width = '100%';
                        }
                    }
                    
                    // Replace the container content with trade status
                    botStatusContainer.innerHTML = '';
                    botStatusContainer.style.textAlign = 'left';
                    botStatusContainer.style.maxWidth = '100%';
                    botStatusContainer.style.width = '100%';
                    
                    // Create trade status display inside the container
                    const statusDiv = document.createElement('div');
                    statusDiv.id = 'tradeStatusDisplay';
                    statusDiv.className = 'trade-status-display';
                    statusDiv.style.cssText = 'width: 100%; padding: 0;';
                    botStatusContainer.appendChild(statusDiv);
                    
                    // Compact, efficient layout (same as showdown trader)
                    statusDiv.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 2px solid rgba(140, 82, 255, 0.3);">
                    <h2 style="margin: 0; color: var(--text); font-size: 1.25rem; font-weight: 700;">Trade Status</h2>
                    <span id="tradeStatusBadge" style="padding: 0.4rem 0.875rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; background: rgba(140, 82, 255, 0.2); color: var(--primary); text-transform: capitalize;">
                        ${tradeData.status === 'in_progress' ? 'In Progress' : (tradeData.status || 'Pending').charAt(0).toUpperCase() + (tradeData.status || 'Pending').slice(1).replace('_', ' ')}
                    </span>
                </div>
                
                <div id="currentStatus" style="margin-bottom: 1rem; padding: 0.875rem; background: rgba(140, 82, 255, 0.1); border-left: 3px solid var(--primary); border-radius: 8px;">
                    <div style="color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.375rem; text-transform: uppercase; letter-spacing: 0.05em;">Current Status</div>
                    <div id="currentStatusText" style="color: var(--text); font-weight: 600; font-size: 0.95rem;">Waiting for bot assignment...</div>
                </div>
                
                <div id="tradeStatusDetails" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.25rem; padding: 1.25rem; background: rgba(0, 0, 0, 0.2); border-radius: 8px;">
                    <div>
                        <div style="color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Trade Code</div>
                        <div style="color: var(--text); font-weight: 700; font-family: monospace; font-size: 1.5rem; letter-spacing: 0.1em;">${tradeData.trade_code || 'N/A'}</div>
                    </div>
                    <div>
                        <div style="color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Game</div>
                        <div style="color: var(--text); font-weight: 600; text-transform: uppercase; font-size: 1.1rem;">${tradeData.game_mode || 'N/A'}</div>
                    </div>
                    ${tradeData.queue_position ? `
                    <div>
                        <div style="color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Queue</div>
                        <div style="color: var(--text); font-weight: 600; font-size: 1.1rem;">${tradeData.queue_position}${tradeData.total_in_queue ? ` / ${tradeData.total_in_queue}` : ''}</div>
                    </div>
                    ` : ''}
                    <div>
                        <div style="color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Trade ID</div>
                        <div style="color: var(--text); font-weight: 600; font-family: monospace; font-size: 1rem;">${tradeData.trade_id ? tradeData.trade_id.substring(0, 8) + '...' : 'N/A'}</div>
                    </div>
                </div>
                
                <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                        <h3 style="color: var(--text); font-size: 0.95rem; font-weight: 600; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">Trade Logs</h3>
                        <button id="toggleLogsBtn" style="background: transparent; border: 1px solid var(--border); color: var(--text-muted); padding: 0.375rem 0.75rem; border-radius: 6px; font-size: 0.8rem; cursor: pointer; transition: var(--transition);" onclick="toggleTradeLogs(this);">
                            Hide Logs
                        </button>
                    </div>
                    <div id="tradeLogs" style="display: block; max-height: calc(100vh - 500px); min-height: 300px; overflow-y: auto; background: rgba(0, 0, 0, 0.3); border-radius: 8px; padding: 0.875rem; font-family: monospace; font-size: 0.8rem; line-height: 1.6;">
                        <!-- Logs will be populated here -->
                    </div>
                </div>
            `;
                    
                    // Add toggle function for logs
                    window.toggleTradeLogs = function(btn) {
                        const logs = document.getElementById('tradeLogs');
                        if (logs) {
                            const isHidden = logs.style.display === 'none';
                            logs.style.display = isHidden ? 'block' : 'none';
                            if (btn) {
                                btn.textContent = isHidden ? 'Hide Logs' : 'Show Logs';
                            }
                        }
                    };
                    
                    // Update display with initial data
                    if (typeof window.updateTradeStatusDisplay === 'function') {
                        window.updateTradeStatusDisplay(tradeData);
                    }
                    
                    return; // Exit early for file trader page
                }
            }
            
            // For other pages, use the original logic
            // Create or update status display
            let statusDiv = document.getElementById('tradeStatusDisplay');
            if (!statusDiv) {
                statusDiv = document.createElement('div');
                statusDiv.id = 'tradeStatusDisplay';
                statusDiv.className = 'trade-status-display';
                statusDiv.style.cssText = 'margin-top: 2rem; padding: 0;';
                
                if (currentPath === '/trading/file-trader' && fileTraderPage && fileTraderPage.classList.contains('active')) {
                    // On file trader page - append to file trader page
                    fileTraderPage.appendChild(statusDiv);
                } else if (tradePageContainer && (tradePageContainer.hasAttribute('data-active') || currentPath === '/trading/trade')) {
                    // On showdown trader page - append to trade page container
                    const formContainer = document.querySelector('.trade-page-form');
                    if (formContainer) {
                        formContainer.parentNode.insertBefore(statusDiv, formContainer.nextSibling);
                    } else {
                        tradePageContainer.appendChild(statusDiv);
                    }
                } else if (fileTraderPage && fileTraderPage.classList.contains('active')) {
                    // Fallback: file trader is active
                    fileTraderPage.appendChild(statusDiv);
                } else if (tradePageContainer) {
                    // Fallback: trade page container exists
                    tradePageContainer.appendChild(statusDiv);
                }
            }
            
            statusDiv.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(140, 82, 255, 0.2);">
                    <h2 style="margin: 0; color: var(--text); font-size: 1.5rem; font-weight: 700;">Trade Status</h2>
                    <span id="tradeStatusBadge" style="padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600; background: rgba(140, 82, 255, 0.2); color: var(--primary); text-transform: capitalize;">
                        ${tradeData.status === 'in_progress' ? 'In Progress' : (tradeData.status || 'Pending').charAt(0).toUpperCase() + (tradeData.status || 'Pending').slice(1).replace('_', ' ')}
                    </span>
                </div>
                
                <div id="tradeStatusDetails" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; padding: 1rem; background: rgba(0, 0, 0, 0.2); border-radius: 8px;">
                    <div>
                        <div style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.25rem;">Trade ID</div>
                        <div style="color: var(--text); font-weight: 600; font-family: monospace; font-size: 0.9rem;">${tradeData.trade_id ? tradeData.trade_id.substring(0, 8) + '...' : 'N/A'}</div>
                    </div>
                    <div>
                        <div style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.25rem;">Game Mode</div>
                        <div style="color: var(--text); font-weight: 600; text-transform: uppercase;">${tradeData.game_mode || 'N/A'}</div>
                    </div>
                    <div>
                        <div style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.25rem;">Trade Code</div>
                        <div style="color: var(--text); font-weight: 600; font-family: monospace; font-size: 1.1rem;">${tradeData.trade_code || 'N/A'}</div>
                    </div>
                    ${tradeData.queue_position ? `
                    <div>
                        <div style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.25rem;">Queue Position</div>
                        <div style="color: var(--text); font-weight: 600;">${tradeData.queue_position}${tradeData.total_in_queue ? ` / ${tradeData.total_in_queue}` : ''}</div>
                    </div>
                    ` : ''}
                </div>
                
                <div id="currentStatus" style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(140, 82, 255, 0.1); border-left: 4px solid var(--primary); border-radius: 8px;">
                    <div style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.5rem;">Current Status</div>
                    <div id="currentStatusText" style="color: var(--text); font-weight: 600; font-size: 1rem;">Waiting for bot assignment...</div>
                </div>
                
                <div>
                    <h3 style="color: var(--text); font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem;">Trade Logs</h3>
                    <div id="tradeLogs" style="max-height: 400px; overflow-y: auto; background: rgba(0, 0, 0, 0.3); border-radius: 8px; padding: 1rem; font-family: monospace; font-size: 0.85rem;">
                        <!-- Logs will be populated here -->
                    </div>
                </div>
            `;
            
            // Update display with initial data
            if (typeof window.updateTradeStatusDisplay === 'function') {
                window.updateTradeStatusDisplay(tradeData);
            }
        };
        
        // Poll for trade status updates (make global so both trade pages can use it)
        let statusPollInterval = null;
        let completedPollCount = 0;
        window.startStatusPolling = function(tradeId) {
            // Clear any existing polling
            if (statusPollInterval) {
                clearInterval(statusPollInterval);
            }
            
            completedPollCount = 0;
            
            // Poll every 3 seconds
            statusPollInterval = setInterval(async () => {
                try {
                    const response = await fetch(`${API_BASE}/trade/${tradeId}`, {
                        credentials: 'include'
                    });
                    
                    if (!response.ok) {
                        throw new Error('Failed to fetch trade status');
                    }
                    
                    const data = await response.json();
                    
                    if (data.success && data.trade) {
                        window.updateTradeStatusDisplay(data.trade);
                        
                        // Continue polling for a few more cycles after completion to catch final events
                        if (data.trade.status === 'completed' || data.trade.status === 'failed') {
                            completedPollCount++;
                            
                            // Refresh trade usage when trade completes
                            if (data.trade.status === 'completed') {
                                // Refresh immediately, then again after delays to ensure backend has updated
                                const refreshUsage = () => {
                                    if (typeof window.loadTradeUsage === 'function') {
                                        window.loadTradeUsage();
                                    }
                                    if (typeof window.loadFileTradeUsage === 'function') {
                                        window.loadFileTradeUsage();
                                    }
                                };
                                
                                // Refresh immediately
                                refreshUsage();
                                
                                // Refresh after 1 second (backend should have recorded by then)
                                setTimeout(refreshUsage, 1000);
                                
                                // Refresh after 2 seconds (extra safety)
                                setTimeout(refreshUsage, 2000);
                            }
                            
                            // Poll 3 more times (9 seconds) after completion to catch any final events
                            if (completedPollCount >= 3) {
                                clearInterval(statusPollInterval);
                                statusPollInterval = null;
                                completedPollCount = 0;
                                
                                // Final refresh of trade usage after polling stops
                                if (data.trade.status === 'completed') {
                                    setTimeout(() => {
                                        if (typeof window.loadTradeUsage === 'function') {
                                            window.loadTradeUsage();
                                        }
                                        if (typeof window.loadFileTradeUsage === 'function') {
                                            window.loadFileTradeUsage();
                                        }
                                    }, 1500);
                                }
                            }
                        } else {
                            // Reset counter if trade is still active
                            completedPollCount = 0;
                        }
                    }
                } catch (error) {
                    console.error('[TRADE] Status polling error', error);
                }
            }, 3000);
        };
        
        // Update trade status display with logs (make global so both trade pages can use it)
        window.updateTradeStatusDisplay = function(trade) {
            const badge = document.getElementById('tradeStatusBadge');
            const details = document.getElementById('tradeStatusDetails');
            const logsContainer = document.getElementById('tradeLogs');
            const currentStatusText = document.getElementById('currentStatusText');
            
            // Refresh trade usage when trade completes
            if (trade.status === 'completed') {
                // Refresh trade usage display on both pages with multiple attempts
                const refreshUsage = () => {
                    if (typeof window.loadTradeUsage === 'function') {
                        window.loadTradeUsage();
                    }
                    if (typeof window.loadFileTradeUsage === 'function') {
                        window.loadFileTradeUsage();
                    }
                };
                
                // Refresh immediately
                refreshUsage();
                
                // Refresh after delays to ensure backend has updated
                setTimeout(refreshUsage, 1000);
                setTimeout(refreshUsage, 2000);
                setTimeout(refreshUsage, 3000);
            }
            
            if (badge) {
                // Determine actual status - if assigned but not started, show as "Queued"
                let displayStatus = trade.status;
                let statusText = '';
                
                if (trade.status === 'assigned' && !trade.events?.some(e => e.event_type === 'started' || e.event_type === 'in_progress')) {
                    displayStatus = 'queued';
                    statusText = 'Queued';
                } else if (trade.status === 'in_progress') {
                    statusText = 'In Progress';
                } else {
                    statusText = trade.status.charAt(0).toUpperCase() + trade.status.slice(1).replace('_', ' ');
                }
                
                badge.textContent = statusText;
                
                // Update badge color based on status
                if (trade.status === 'completed') {
                    badge.style.background = 'rgba(16, 185, 129, 0.2)';
                    badge.style.color = '#10b981';
                } else if (trade.status === 'failed') {
                    badge.style.background = 'rgba(239, 68, 68, 0.2)';
                    badge.style.color = '#ef4444';
                } else if (trade.status === 'in_progress') {
                    badge.style.background = 'rgba(59, 130, 246, 0.2)';
                    badge.style.color = '#3b82f6';
                } else if (trade.status === 'assigned') {
                    // Show as "Queued" if not actually started
                    if (!trade.events?.some(e => e.event_type === 'started' || e.event_type === 'in_progress')) {
                        badge.style.background = 'rgba(99, 102, 241, 0.2)';
                        badge.style.color = '#6366f1';
                    } else {
                        badge.style.background = 'rgba(140, 82, 255, 0.2)';
                        badge.style.color = '#8c52ff';
                    }
                } else if (trade.status === 'pending' || trade.status === 'queued') {
                    badge.style.background = 'rgba(99, 102, 241, 0.2)';
                    badge.style.color = '#6366f1';
                }
            }
            
            if (details) {
                let detailsHTML = `
                    <div>
                        <div style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.25rem;">Trade ID</div>
                        <div style="color: var(--text); font-weight: 600; font-family: monospace; font-size: 0.9rem;">${trade.trade_id ? trade.trade_id.substring(0, 8) + '...' : 'N/A'}</div>
                    </div>
                    <div>
                        <div style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.25rem;">Game Mode</div>
                        <div style="color: var(--text); font-weight: 600; text-transform: uppercase;">${trade.game_mode || 'N/A'}</div>
                    </div>
                `;
                
                if (trade.trade_code) {
                    detailsHTML += `
                        <div>
                            <div style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.25rem;">Trade Code</div>
                            <div style="color: var(--text); font-weight: 600; font-family: monospace; font-size: 1.1rem;">${trade.trade_code}</div>
                        </div>
                    `;
                }
                
                if (trade.queue_position) {
                    detailsHTML += `
                        <div>
                            <div style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.25rem;">Queue Position</div>
                            <div style="color: var(--text); font-weight: 600;">${trade.queue_position}${trade.total_in_queue ? ` / ${trade.total_in_queue}` : ''}</div>
                        </div>
                    `;
                }
                
                if (trade.bot) {
                    detailsHTML += `
                        <div>
                            <div style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.25rem;">Assigned Bot</div>
                            <div style="color: var(--text); font-weight: 600;">${trade.bot.bot_name || 'Unknown'}</div>
                        </div>
                    `;
                }
                
                details.innerHTML = detailsHTML;
            }
            
            // Update current status from latest event or queue position
            if (currentStatusText) {
                let statusMessage = 'Waiting for bot assignment...';
                
                if (trade.status === 'assigned' && !trade.events?.some(e => e.event_type === 'started' || e.event_type === 'in_progress')) {
                    if (trade.queue_position) {
                        statusMessage = `Waiting in queue... (position ${trade.queue_position}${trade.total_in_queue ? `/${trade.total_in_queue}` : ''})`;
                    } else {
                        statusMessage = 'Waiting in queue...';
                    }
                } else if (trade.events && trade.events.length > 0) {
                    const latestEvent = trade.events[trade.events.length - 1];
                    if (latestEvent.message) {
                        statusMessage = latestEvent.message;
                    }
                }
                
                currentStatusText.textContent = statusMessage;
            }
            
            // Update logs
            if (logsContainer) {
                const seenMessages = new Set();
                let logsHTML = '';
                
                if (trade.events && trade.events.length > 0) {
                    trade.events.forEach(event => {
                        const messageKey = `${event.event_type}-${event.message}`;
                        if (seenMessages.has(messageKey)) {
                            return;
                        }
                        seenMessages.add(messageKey);
                        
                        const timestamp = new Date(event.created_at).toLocaleTimeString();
                        let logColor = 'var(--text-muted)';
                        let icon = '';
                        
                        if (event.message.includes('Found trade partner') || event.message.includes('Waiting for')) {
                            logColor = '#10b981';
                            icon = '✓ ';
                        } else if (event.event_type === 'completed') {
                            logColor = '#10b981';
                            icon = '✓ ';
                        } else if (event.event_type === 'failed') {
                            logColor = '#ef4444';
                            icon = '✗ ';
                        } else if (event.event_type === 'started' || event.event_type === 'in_progress') {
                            logColor = '#3b82f6';
                            icon = '→ ';
                        }
                        
                        logsHTML += `<div style="color: ${logColor}; margin-bottom: 0.5rem;">${icon}[${timestamp}] ${escapeHtml(event.message || event.event_type)}</div>`;
                    });
                }
                
                if (!logsHTML) {
                    logsHTML = '<div style="color: var(--text-muted);">No logs yet...</div>';
                }
                
                logsContainer.innerHTML = logsHTML;
                
                // Auto-scroll to bottom
                logsContainer.scrollTop = logsContainer.scrollHeight;
            }
        };
        
        // Initialize Trade Page - COMPLETE REVAMP
        async function initTradePage() {
            const currentPath = window.location.pathname;
            
            // Support both /trade and /trading/trade routes
            if (currentPath !== '/trading/trade' && currentPath !== '/trade') {
                return;
            }
            
            // Get all elements
            const mainContent = document.querySelector('main.main-content');
            const tradeContainer = document.getElementById('tradePageContainer');
            const homeTab = document.getElementById('homeTab');
            const accountTab = document.getElementById('accountTab');
            const pokeDesignerTab = document.getElementById('pokeDesignerTab');
            
            // Hide all other tabs
            if (homeTab) homeTab.classList.remove('active');
            if (accountTab) accountTab.classList.remove('active');
            if (pokeDesignerTab) pokeDesignerTab.classList.remove('active');
            
            // Hide main site content
            if (mainContent) {
                mainContent.style.display = 'none';
            }
            
            // Show trade page container
            if (tradeContainer) {
                tradeContainer.style.display = 'block';
                tradeContainer.setAttribute('data-active', 'true');
            } else {
                return;
            }
            
            // Check for existing active trade first
            async function checkForActiveTrade() {
                try {
                    const response = await fetch(`${API_BASE}/trade/active`, {
                        credentials: 'include'
                    });
                    
                    if (!response.ok) {
                        return null;
                    }
                    
                    const data = await response.json();
                    if (data.success && data.trade) {
                        // User has an active trade, show it instead of form
                        hideTradeForm();
                        window.showTradeStatus(data.trade);
                        window.startStatusPolling(data.trade.trade_id);
                        return data.trade;
                    }
                } catch (error) {
                    // Silently fail - just show the form
                }
                return null;
            }
            
            // Check for active trade first
            const activeTrade = await checkForActiveTrade();
            
            // If no active trade, show the form
            if (!activeTrade) {
                // Load showdown set and game mode from URL parameters
                const urlParams = new URLSearchParams(window.location.search);
                const showdownSet = urlParams.get('showdownSet');
                const gameMode = urlParams.get('gameMode');
                
                // Set game mode from URL parameter
                const gameModeSelect = document.getElementById('tradeGameModeSelect');
                if (gameModeSelect && gameMode) {
                    gameModeSelect.value = gameMode;
                }
                
                const tradeTextarea = document.getElementById('tradeShowdownSet');
                if (tradeTextarea) {
                    if (showdownSet) {
                        // Decode the showdown set
                        const decodedSet = decodeURIComponent(showdownSet);
                        tradeTextarea.value = decodedSet;
                    }
                    
                    // Add styling for textarea focus
                    tradeTextarea.addEventListener('focus', function() {
                        this.style.borderColor = 'var(--primary)';
                        this.style.boxShadow = '0 0 0 3px rgba(140, 82, 255, 0.1)';
                    });
                    tradeTextarea.addEventListener('blur', function() {
                        this.style.borderColor = 'var(--border)';
                        this.style.boxShadow = 'none';
                    });
                    tradeTextarea.addEventListener('mouseenter', function() {
                        if (document.activeElement !== this) {
                            this.style.borderColor = 'rgba(140, 82, 255, 0.5)';
                        }
                    });
                    tradeTextarea.addEventListener('mouseleave', function() {
                        if (document.activeElement !== this) {
                            this.style.borderColor = 'var(--border)';
                        }
                    });
                }
                
                // Store Turnstile token globally for this widget
                window.turnstileToken = null;
                
                // Callback functions for implicit rendering (invisible mode)
                if (!window.onTurnstileSuccess) {
                    window.onTurnstileSuccess = function(token) {
                        console.log('Turnstile token received (implicit rendering):', token);
                        console.log('Token type:', typeof token);
                        console.log('Token length:', token ? token.length : 0);
                        window.turnstileToken = token;
                        console.log('Token stored in window.turnstileToken:', window.turnstileToken ? 'Yes' : 'No');
                    };
                }
                
                if (!window.onTurnstileError) {
                    window.onTurnstileError = function(error) {
                        console.error('Turnstile error:', error);
                        window.turnstileToken = null;
                    };
                }
                
                if (!window.onTurnstileExpired) {
                    window.onTurnstileExpired = function() {
                        console.log('Turnstile token expired');
                        window.turnstileToken = null;
                    };
                }
                
                // Trade button handler - submit trade
                const tradeBtn = document.getElementById('tradeSubmitBtn');
                if (tradeBtn) {
                    // Remove any existing listeners by cloning
                    const newBtn = tradeBtn.cloneNode(true);
                    tradeBtn.parentNode.replaceChild(newBtn, tradeBtn);
                    
                    newBtn.addEventListener('click', async () => {
                        await submitTrade();
                    });
                }
            }
            
            // Hide trade form after submission (defined before submitTrade so it's accessible)
            function hideTradeForm() {
                const tradePageContainer = document.getElementById('tradePageContainer');
                const tradeFormSection = document.getElementById('tradeFormSection');
                const textarea = document.getElementById('tradeShowdownSet');
                const gameModeSelect = document.getElementById('tradeGameModeSelect');
                const gameModeLabel = document.querySelector('#tradePageContainer label[for="tradeGameModeSelect"]');
                const showdownSetLabel = document.querySelector('#tradePageContainer label[for="tradeShowdownSet"]');
                const btn = document.getElementById('tradeSubmitBtn');
                const actionsContainer = document.querySelector('#tradePageContainer .trade-page-actions');
                const backBtn = document.getElementById('tradeBackBtn');
                
                // Hide the header section (title and description) first
                if (tradePageContainer) {
                    const header = tradePageContainer.querySelector('.trade-page-header');
                    if (header) {
                        header.style.display = 'none';
                    }
                }
                
                // Show back button first (before hiding container)
                if (backBtn) {
                    backBtn.style.display = 'flex';
                }
                
                // Hide the entire form section
                if (tradeFormSection) {
                    tradeFormSection.style.display = 'none';
                }
                
                // Hide individual form elements as fallback
                if (textarea) {
                    textarea.style.display = 'none';
                }
                if (gameModeSelect) {
                    gameModeSelect.style.display = 'none';
                }
                if (gameModeLabel) {
                    gameModeLabel.style.display = 'none';
                }
                if (showdownSetLabel) {
                    showdownSetLabel.style.display = 'none';
                }
                if (btn) {
                    btn.style.display = 'none';
                }
                if (actionsContainer) {
                    actionsContainer.style.display = 'none';
                }
            }
            
            // Note: hideFileTraderForm is already defined globally above
            // Note: showTradeStatus, startStatusPolling, and updateTradeStatusDisplay are already defined globally above
            
            // Submit trade function for showdown trader
            async function submitTrade() {
                const btn = document.getElementById('tradeSubmitBtn');
                const textarea = document.getElementById('tradeShowdownSet');
                
                if (!btn || !textarea) {
                    return;
                }
                
                // Disable button and show loading
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 0.5rem;"></i> Submitting...';
                btn.disabled = true;
                
                try {
                    const showdownSet = textarea.value.trim();
                    
                    if (!showdownSet) {
                        showNotification('Please enter a Showdown set', 'warning');
                        btn.innerHTML = originalHTML;
                        btn.disabled = false;
                        return;
                    }
                    
                    // Get game mode from select dropdown or default to plza
                    const gameModeSelect = document.getElementById('tradeGameModeSelect');
                    const gameMode = gameModeSelect ? gameModeSelect.value : 'plza';
                    
                    // Get Turnstile token - try multiple methods
                    let turnstileToken = '';
                    
                    // Method 0: Get from hidden input field (most reliable)
                    const hiddenInput = document.querySelector('input[name="cf-turnstile-response"]');
                    if (hiddenInput && hiddenInput.value) {
                        turnstileToken = hiddenInput.value;
                        console.log('Method 0 - Token from hidden input:', turnstileToken ? 'Found' : 'Not found');
                        console.log('Hidden input value length:', turnstileToken.length);
                    }
                    
                    // Method 1: Get from stored callback value
                    if (!turnstileToken) {
                        turnstileToken = window.turnstileToken || '';
                        console.log('Method 1 - Stored callback token:', turnstileToken ? 'Found' : 'Not found');
                    }
                    
                    // Method 2: Get directly from widget element using Turnstile API
                    if (!turnstileToken && window.turnstile) {
                        try {
                            const turnstileWidget = document.querySelector('.cf-turnstile[data-sitekey="0x4AAAAAACBJOjTk1J-lAEX8"]');
                            if (turnstileWidget) {
                                console.log('Widget element found:', turnstileWidget);
                                // Get widget ID from the element
                                const widgetId = turnstileWidget.getAttribute('data-widget-id');
                                console.log('Widget ID from attribute:', widgetId);
                                
                                // If no widget ID, try to find it by checking all rendered widgets
                                if (!widgetId) {
                                    // Try to get widget ID by finding the iframe inside
                                    const iframe = turnstileWidget.querySelector('iframe');
                                    if (iframe) {
                                        console.log('Found iframe in widget');
                                    }
                                    // Try to get response using the element itself
                                    try {
                                        turnstileToken = window.turnstile.getResponse(turnstileWidget) || '';
                                        console.log('Method 2a - Token from element:', turnstileToken ? 'Found' : 'Not found');
                                    } catch (e) {
                                        console.log('Method 2a failed:', e.message);
                                    }
                                } else {
                                    // Use widget ID to get response
                                    try {
                                        turnstileToken = window.turnstile.getResponse(widgetId) || '';
                                        console.log('Method 2b - Token from widget ID:', turnstileToken ? 'Found' : 'Not found');
                                    } catch (e) {
                                        console.log('Method 2b failed:', e.message);
                                    }
                                }
                                
                                // Also try getting response using the element directly
                                if (!turnstileToken) {
                                    try {
                                        turnstileToken = window.turnstile.getResponse(turnstileWidget) || '';
                                        console.log('Method 2c - Token from element directly:', turnstileToken ? 'Found' : 'Not found');
                                    } catch (e) {
                                        console.log('Method 2c failed:', e.message);
                                    }
                                }
                            } else {
                                console.log('Widget element not found');
                            }
                        } catch (error) {
                            console.error('Error getting Turnstile token from widget:', error);
                        }
                    }
                    
                    // Method 3: Wait a moment and try again
                    if (!turnstileToken || turnstileToken.trim() === '') {
                        console.log('Method 3 - Waiting for token...');
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        turnstileToken = window.turnstileToken || '';
                        console.log('Method 3 - Token after wait:', turnstileToken ? 'Found' : 'Still not found');
                        
                        // Try widget again after wait
                        if (!turnstileToken && window.turnstile) {
                            try {
                                const turnstileWidget = document.querySelector('.cf-turnstile[data-sitekey="0x4AAAAAACBJOjTk1J-lAEX8"]');
                                if (turnstileWidget) {
                                    const widgetId = turnstileWidget.getAttribute('data-widget-id');
                                    if (widgetId) {
                                        turnstileToken = window.turnstile.getResponse(widgetId) || '';
                                        console.log('Method 3b - Token from widget after wait:', turnstileToken ? 'Found' : 'Not found');
                                    }
                                }
                            } catch (e) {
                                console.log('Method 3b failed:', e.message);
                            }
                        }
                    }
                    
                    // Ensure turnstileToken is always a string
                    turnstileToken = (turnstileToken && typeof turnstileToken === 'string') ? turnstileToken : '';
                    
                    // Validate it's not empty
                    if (!turnstileToken || turnstileToken.trim() === '') {
                        showNotification('CAPTCHA verification is required. Please wait a moment and try again.', 'warning');
                        btn.innerHTML = originalHTML;
                        btn.disabled = false;
                        return;
                    }
                    
                    console.log('Sending Turnstile token with request:', turnstileToken.substring(0, 20) + '...');
                    console.log('Full token length:', turnstileToken.length);
                    
                    // Build request body - ABSOLUTELY MUST INCLUDE turnstileToken
                    const requestBody = {
                        showdownSet: showdownSet,
                        gameMode: gameMode,
                        turnstileToken: turnstileToken
                    };
                    
                    // Double-check turnstileToken is in the body
                    if (!requestBody.turnstileToken) {
                        console.error('ERROR: turnstileToken is missing from requestBody!');
                        showNotification('CAPTCHA token error. Please refresh and try again.', 'error');
                        btn.innerHTML = originalHTML;
                        btn.disabled = false;
                        return;
                    }
                    
                    console.log('Request body keys:', Object.keys(requestBody));
                    console.log('Request body turnstileToken exists:', 'turnstileToken' in requestBody);
                    console.log('Request body turnstileToken value length:', requestBody.turnstileToken ? requestBody.turnstileToken.length : 0);
                    console.log('Request body (first 200 chars):', JSON.stringify(requestBody).substring(0, 200));
                    
                    // FORCE include turnstileToken - make absolutely sure it's in the body
                    const finalBody = {
                        showdownSet: showdownSet,
                        gameMode: gameMode,
                        turnstileToken: turnstileToken
                    };
                    
                    // Log the final body to verify
                    console.log('FINAL REQUEST BODY:', JSON.stringify(finalBody));
                    console.log('FINAL BODY HAS turnstileToken:', 'turnstileToken' in finalBody);
                    console.log('FINAL BODY turnstileToken VALUE:', finalBody.turnstileToken ? finalBody.turnstileToken.substring(0, 50) + '...' : 'MISSING!');
                    
                    const response = await fetch(`${API_BASE}/trade/submit`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            showdownSet: showdownSet,
                            gameMode: gameMode,
                            turnstileToken: window.turnstileToken || turnstileToken || ''
                        })
                    });
                    
                    // Check if response is JSON
                    const contentType = response.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                        throw new Error(`Server returned non-JSON response. Status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    
                    if (!response.ok) {
                        throw new Error(data.error || data.message || 'Failed to submit trade');
                    }
                    
                    if (data.success) {
                        // Store trade ID for status polling
                        window.currentTradeId = data.trade_id;
                        
                        // Hide trade form and show status/logs
                        hideTradeForm();
                        window.showTradeStatus(data);
                        
                        // Start polling for status updates
                        window.startStatusPolling(data.trade_id);
                    } else {
                        throw new Error(data.error || data.message || 'Unknown error');
                    }
                } catch (error) {
                    // Show error message - if it's about existing trade, make it more user-friendly
                    let errorMessage = error.message;
                    if (errorMessage.includes('already have an active trade')) {
                        errorMessage = errorMessage.replace('You already have an active trade in queue', 'You already have an active trade');
                    }
                    showNotification(`Failed to submit trade: ${errorMessage}`, 'error');
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                }
            }
            
            // Back button handlers
            const backBtn = document.getElementById('tradeBackBtn');
            if (backBtn) {
                backBtn.addEventListener('click', () => {
                    window.location.href = '/';
                });
            }
        }
        
        // Initialize File Trader Page - COMPLETELY RECREATED
        async function initFileTraderPage() {
            const currentPath = window.location.pathname;
            
            if (currentPath !== '/trading/file-trader') {
                return;
            }
            
            // Get elements
            const fileTraderPage = document.getElementById('fileTraderPage');
            const mainContent = document.querySelector('main.main-content');
            const tradeContainer = document.getElementById('tradePageContainer');
            
            if (!fileTraderPage) {
                return;
            }
            
            // Hide main content and trade container
            if (mainContent) {
                mainContent.style.display = 'none';
            }
            if (tradeContainer) {
                tradeContainer.style.display = 'none';
                tradeContainer.removeAttribute('data-active');
            }
            
            // Show file trader page
            fileTraderPage.classList.add('active');
            document.body.classList.add('file-trader-active');
            
            // Ensure form is visible first
            const fileTraderForm = document.getElementById('fileTraderForm');
            if (fileTraderForm) {
                fileTraderForm.style.display = 'block';
                fileTraderForm.style.visibility = 'visible';
            }
            
            // Check for existing active trade
            try {
                const response = await fetch(`${API_BASE}/trade/active`, {
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.trade) {
                        // User has an active trade, show it instead of form
                        window.hideFileTraderForm();
                        window.showTradeStatus(data.trade);
                        window.startStatusPolling(data.trade.trade_id);
                        return;
                    }
                }
            } catch (error) {
                // Silently fail - just show the form
            }
            
            // Make sure form is visible if no active trade
            if (fileTraderForm) {
                fileTraderForm.style.display = 'block';
                fileTraderForm.style.visibility = 'visible';
            }
            
            // Set up file upload handling
            const fileInput = document.getElementById('pkmFileInput');
            const fileUploadArea = document.getElementById('fileUploadArea');
            const selectedFileName = document.getElementById('selectedFileName');
            const allowedExtensions = ['.pk9', '.wb7full', '.pb7', '.pk8', '.pa9', '.pb8', '.wc'];
            
            function validateFile(file) {
                const fileName = file.name.toLowerCase();
                const extension = fileName.substring(fileName.lastIndexOf('.'));
                return allowedExtensions.includes(extension);
            }
            
            function handleFileSelect(file) {
                if (!file) return;
                
                if (!validateFile(file)) {
                    showNotification(`Invalid file type. Only the following formats are allowed: ${allowedExtensions.join(', ')}`, 'error');
                    fileInput.value = '';
                    if (selectedFileName) selectedFileName.style.display = 'none';
                    return;
                }
                
                if (selectedFileName) {
                    selectedFileName.textContent = `Selected: ${file.name}`;
                    selectedFileName.style.display = 'block';
                }
            }
            
            if (fileInput && fileUploadArea) {
                fileUploadArea.addEventListener('click', () => fileInput.click());
                
                fileInput.addEventListener('change', (e) => {
                    handleFileSelect(e.target.files[0]);
                });
                
                fileUploadArea.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    fileUploadArea.style.borderColor = 'var(--primary)';
                    fileUploadArea.style.background = 'var(--surface-hover)';
                    fileUploadArea.style.transform = 'translateY(-2px)';
                    fileUploadArea.style.boxShadow = 'var(--shadow-lg)';
                });
                
                fileUploadArea.addEventListener('dragleave', (e) => {
                    e.preventDefault();
                    fileUploadArea.style.borderColor = 'var(--border)';
                    fileUploadArea.style.background = 'var(--surface)';
                    fileUploadArea.style.transform = 'translateY(0)';
                    fileUploadArea.style.boxShadow = 'var(--shadow)';
                });
                
                fileUploadArea.addEventListener('drop', (e) => {
                    e.preventDefault();
                    fileUploadArea.style.borderColor = 'var(--border)';
                    fileUploadArea.style.background = 'var(--surface)';
                    fileUploadArea.style.transform = 'translateY(0)';
                    fileUploadArea.style.boxShadow = 'var(--shadow)';
                    const file = e.dataTransfer.files[0];
                    if (file) {
                        fileInput.files = e.dataTransfer.files;
                        handleFileSelect(file);
                    }
                });
            }
            
            // Store Turnstile token globally for file trader widget
            window.fileTurnstileToken = null;
            
            // Callback functions for implicit rendering (invisible mode) - File Trader
            if (!window.onFileTurnstileSuccess) {
                window.onFileTurnstileSuccess = function(token) {
                    console.log('File Trader Turnstile token received (implicit rendering):', token);
                    window.fileTurnstileToken = token;
                };
            }
            
            if (!window.onFileTurnstileError) {
                window.onFileTurnstileError = function(error) {
                    console.error('File Trader Turnstile error:', error);
                    window.fileTurnstileToken = null;
                };
            }
            
            if (!window.onFileTurnstileExpired) {
                window.onFileTurnstileExpired = function() {
                    console.log('File Trader Turnstile token expired');
                    window.fileTurnstileToken = null;
                };
            }
            
            const fileTradeBtn = document.getElementById('fileTradeSubmitBtn');
            if (fileTradeBtn) {
                fileTradeBtn.addEventListener('click', async () => {
                    await submitFileTrade();
                });
            }
            
            // Back button
            const fileBackBtn = document.getElementById('fileTradeBackBtn');
            if (fileBackBtn) {
                fileBackBtn.addEventListener('click', () => {
                    window.location.href = '/';
                });
            }
            
            // File trade submission function
            async function submitFileTrade() {
                const btn = document.getElementById('fileTradeSubmitBtn');
                
                if (!btn) {
                    return;
                }
                
                // Disable button and show loading
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 0.5rem;"></i> Submitting...';
                btn.disabled = true;
                
                try {
                    const fileInput = document.getElementById('pkmFileInput');
                    const gameModeSelect = document.getElementById('fileGameModeSelect');
                    
                    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
                        showNotification('Please select a PKHeX file to upload', 'warning');
                        btn.innerHTML = originalHTML;
                        btn.disabled = false;
                        return;
                    }
                    
                    const file = fileInput.files[0];
                    const gameMode = gameModeSelect ? gameModeSelect.value : 'plza';
                    
                    // Validate file extension
                    const allowedExtensions = ['.pk9', '.wb7full', '.pb7', '.pk8', '.pa9', '.pb8', '.wc'];
                    const fileName = file.name.toLowerCase();
                    const extension = fileName.substring(fileName.lastIndexOf('.'));
                    
                    if (!allowedExtensions.includes(extension)) {
                        showNotification(`Invalid file type. Only the following formats are allowed: ${allowedExtensions.join(', ')}`, 'error');
                        btn.innerHTML = originalHTML;
                        btn.disabled = false;
                        return;
                    }
                    
                    // Convert file to base64
                    const fileData = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const base64 = reader.result.split(',')[1]; // Remove data:...;base64, prefix
                            resolve(base64);
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                    
                    // Get Turnstile token from implicit rendering callback
                    let turnstileToken = window.fileTurnstileToken || '';
                    
                    // If no token, try to get it from the widget using Turnstile API
                    if (!turnstileToken && window.turnstile) {
                        try {
                            const fileTurnstileWidget = document.querySelector('.cf-turnstile[data-callback="onFileTurnstileSuccess"]');
                            if (fileTurnstileWidget) {
                                // Try to get response from widget
                                const widgetId = fileTurnstileWidget.getAttribute('data-widget-id');
                                if (widgetId) {
                                    turnstileToken = window.turnstile.getResponse(widgetId) || '';
                                }
                            }
                        } catch (error) {
                            console.error('Error getting File Trader Turnstile token:', error);
                        }
                    }
                    
                    // If still no token, wait a moment for it to be generated
                    if (!turnstileToken || turnstileToken.trim() === '') {
                        console.log('Waiting for File Trader Turnstile token...');
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        turnstileToken = window.fileTurnstileToken || '';
                    }
                    
                    // Ensure turnstileToken is always a string
                    turnstileToken = (turnstileToken && typeof turnstileToken === 'string') ? turnstileToken : '';
                    
                    // Validate it's not empty
                    if (!turnstileToken || turnstileToken.trim() === '') {
                        showNotification('CAPTCHA verification is required. Please wait a moment and try again.', 'warning');
                        btn.innerHTML = originalHTML;
                        btn.disabled = false;
                        return;
                    }
                    
                    console.log('Sending File Trader Turnstile token with request:', turnstileToken.substring(0, 20) + '...');
                    
                    const response = await fetch(`${API_BASE}/trade/submit-file`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            fileName: file.name,
                            fileData: fileData,
                            gameMode: gameMode,
                            turnstileToken: turnstileToken // Always a string
                        })
                    });
                    
                    // Check if response is JSON
                    const contentType = response.headers.get('content-type');
                    let data;
                    
                    if (contentType && contentType.includes('application/json')) {
                        try {
                            data = await response.json();
                        } catch (parseError) {
                            // If JSON parsing fails, response might be text
                            const text = await response.clone().text().catch(() => 'Unknown error');
                            throw new Error(text || `Server error: ${response.status}`);
                        }
                    } else {
                        // Not JSON, get text
                        const text = await response.text();
                        throw new Error(text || `Server returned non-JSON response. Status: ${response.status}`);
                    }
                    
                    if (!response.ok) {
                        throw new Error(data.error || data.message || `Failed to submit trade (${response.status})`);
                    }
                    
                    if (data.success) {
                        // Store trade ID for status polling
                        window.currentTradeId = data.trade_id;
                        
                        // Hide trade form and show status/logs
                        window.hideFileTraderForm();
                        window.showTradeStatus(data);
                        
                        // Start polling for status updates
                        window.startStatusPolling(data.trade_id);
                    } else {
                        throw new Error(data.error || data.message || 'Unknown error');
                    }
                } catch (error) {
                    // Show error message - if it's about existing trade, make it more user-friendly
                    let errorMessage = error.message;
                    if (errorMessage.includes('already have an active trade')) {
                        errorMessage = errorMessage.replace('You already have an active trade in queue', 'You already have an active trade');
                    }
                    showNotification(`Failed to submit trade: ${errorMessage}`, 'error');
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                }
            }
            
            // Note: hideFileTraderForm is already defined above and made globally accessible
            // Note: startStatusPolling and updateTradeStatusDisplay are already defined globally above
        }
        
        // Handle current route on page load and update tab highlighting
        function updateActiveTab() {
            const currentPath = window.location.pathname;
            const accountTabs = document.querySelectorAll('.nav-tab[data-tab="account"]');
            const homeTabs = document.querySelectorAll('.nav-tab[data-tab="home"]');
            const mainContent = document.querySelector('main.main-content');
            const tradeContainer = document.getElementById('tradePageContainer');
            const showMainContent = () => {
                // NEVER show main content if we're on file trader page
                if (currentPath === '/trading/file-trader') {
                    const fileTraderPage = document.getElementById('fileTraderPage');
                    if (fileTraderPage) {
                        fileTraderPage.classList.add('active');
                        document.body.classList.add('file-trader-active');
                    }
                    if (mainContent) mainContent.style.display = 'none';
                    return;
                }
                if (mainContent) {
                    mainContent.style.display = '';
                }
                if (tradeContainer) {
                    tradeContainer.style.display = 'none';
                    tradeContainer.removeAttribute('data-active');
                }
                const fileTraderPage = document.getElementById('fileTraderPage');
                if (fileTraderPage) {
                    fileTraderPage.classList.remove('active');
                    document.body.classList.remove('file-trader-active');
                }
            };
            
            if (currentPath === '/trading/trade') {
                // Trade page route
                // Stop bot status polling when navigating away
                if (typeof stopBotStatusPolling === 'function') {
                    stopBotStatusPolling();
                }
                
                // Hide status page
                const statusPage = document.getElementById('statusPage');
                if (statusPage) {
                    statusPage.classList.remove('active');
                    statusPage.style.display = 'none';
                }
                
                // Hide all tab content
                document.getElementById('homeTab')?.classList.remove('active');
                document.getElementById('accountTab')?.classList.remove('active');
                document.getElementById('pokeDesignerTab')?.classList.remove('active');
                document.getElementById('statusTab')?.classList.remove('active');
                
                // Hide main content and show trade container
                if (mainContent) {
                    mainContent.style.display = 'none';
                }
                if (tradeContainer) {
                    tradeContainer.style.display = 'block';
                    tradeContainer.setAttribute('data-active', 'true');
                }
                const fileTraderPage = document.getElementById('fileTraderPage');
                if (fileTraderPage) {
                    fileTraderPage.classList.remove('active');
                    fileTraderPage.style.display = 'none';
                    document.body.classList.remove('file-trader-active');
                }
                
                // No nav tab highlighted
                homeTabs.forEach(t => t.classList.remove('active'));
                accountTabs.forEach(t => t.classList.remove('active'));
            } else if (currentPath === '/trading/file-trader') {
                // File Trader page route
                // Stop bot status polling when navigating away
                if (typeof stopBotStatusPolling === 'function') {
                    stopBotStatusPolling();
                }
                
                // Hide status page
                const statusPage = document.getElementById('statusPage');
                if (statusPage) {
                    statusPage.classList.remove('active');
                    statusPage.style.display = 'none';
                }
                
                document.getElementById('homeTab')?.classList.remove('active');
                document.getElementById('accountTab')?.classList.remove('active');
                document.getElementById('pokeDesignerTab')?.classList.remove('active');
                
                if (mainContent) {
                    mainContent.style.display = 'none';
                }
                if (tradeContainer) {
                    tradeContainer.style.display = 'none';
                    tradeContainer.removeAttribute('data-active');
                }
                const fileTraderPage = document.getElementById('fileTraderPage');
                if (fileTraderPage) {
                    fileTraderPage.classList.add('active');
                    document.body.classList.add('file-trader-active');
                }
                
                // No nav tab highlighted
                homeTabs.forEach(t => t.classList.remove('active'));
                accountTabs.forEach(t => t.classList.remove('active'));
            } else if (currentPath === '/account' || currentPath === '/account/') {
                // Account page
                // Stop bot status polling when navigating away
                if (typeof stopBotStatusPolling === 'function') {
                    stopBotStatusPolling();
                }
                
                // Hide status page
                const statusPage = document.getElementById('statusPage');
                if (statusPage) {
                    statusPage.classList.remove('active');
                    statusPage.style.display = 'none';
                }
                
                showMainContent();
                document.getElementById('homeTab')?.classList.remove('active');
                document.getElementById('accountTab')?.classList.add('active');
                document.getElementById('pokeDesignerTab')?.classList.remove('active');
                document.getElementById('statusTab')?.classList.remove('active');
                
                homeTabs.forEach(t => t.classList.remove('active'));
                accountTabs.forEach(t => {
                    t.classList.add('active');
                    t.style.display = 'inline-block';
                });
            } else if (currentPath === '/trading/poke-designer') {
                // Poké Designer page
                // Stop bot status polling when navigating away
                if (typeof stopBotStatusPolling === 'function') {
                    stopBotStatusPolling();
                }
                
                // Hide status page
                const statusPage = document.getElementById('statusPage');
                if (statusPage) {
                    statusPage.classList.remove('active');
                    statusPage.style.display = 'none';
                }
                
                showMainContent();
                document.getElementById('homeTab')?.classList.remove('active');
                document.getElementById('accountTab')?.classList.remove('active');
                document.getElementById('pokeDesignerTab')?.classList.add('active');
                document.getElementById('statusTab')?.classList.remove('active');
                
                homeTabs.forEach(t => t.classList.remove('active'));
                accountTabs.forEach(t => t.classList.remove('active'));
                
                // Ensure Poké Designer tab is initialized
                if (typeof initPokeDesigner === 'function') {
                    initPokeDesigner();
                }
            } else if (currentPath === '/status' || currentPath === '/status/') {
                // Status page - use standalone page approach
                const mainContent = document.querySelector('main.main-content');
                const tradePageContainer = document.getElementById('tradePageContainer');
                const fileTraderPage = document.getElementById('fileTraderPage');
                const statusPage = document.getElementById('statusPage');
                
                if (mainContent) mainContent.style.display = 'none';
                if (tradePageContainer) {
                    tradePageContainer.style.display = 'none';
                    tradePageContainer.removeAttribute('data-active');
                }
                if (fileTraderPage) {
                    fileTraderPage.classList.remove('active');
                    document.body.classList.remove('file-trader-active');
                }
                if (statusPage) {
                    statusPage.classList.add('active');
                    statusPage.style.display = 'block';
                }
                
                // Hide all other tabs
                document.getElementById('homeTab')?.classList.remove('active');
                document.getElementById('accountTab')?.classList.remove('active');
                document.getElementById('pokeDesignerTab')?.classList.remove('active');
                document.getElementById('statusTab')?.classList.remove('active');
                
                // Update navigation highlighting
                homeTabs.forEach(t => t.classList.remove('active'));
                accountTabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.nav-tab[data-tab="status"]').forEach(t => t.classList.add('active'));
                
                // Start polling for status updates - load immediately then start polling
                setTimeout(() => {
                    if (typeof loadBotStatus === 'function') {
                        loadBotStatus();
                    }
                    if (typeof startBotStatusPolling === 'function') {
                        startBotStatusPolling();
                    }
                }, 100);
            } else if (currentPath === '/memberships' || currentPath === '/memberships/') {
                // Memberships page route
                // Stop bot status polling when navigating away
                if (typeof stopBotStatusPolling === 'function') {
                    stopBotStatusPolling();
                }
                
                // Hide status page
                const statusPage = document.getElementById('statusPage');
                if (statusPage) {
                    statusPage.classList.remove('active');
                    statusPage.style.display = 'none';
                }
                
                showMainContent();
                
                // Update navigation highlighting
                document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.nav-tab[data-tab="memberships"]').forEach(t => t.classList.add('active'));
            } else {
                // Home or other routes
                // Stop bot status polling when navigating away
                if (typeof stopBotStatusPolling === 'function') {
                    stopBotStatusPolling();
                }
                
                // Hide status page
                const statusPage = document.getElementById('statusPage');
                if (statusPage) {
                    statusPage.classList.remove('active');
                    statusPage.style.display = 'none';
                }
                
                showMainContent();
                document.getElementById('homeTab')?.classList.add('active');
                document.getElementById('accountTab')?.classList.remove('active');
                document.getElementById('pokeDesignerTab')?.classList.remove('active');
                document.getElementById('statusTab')?.classList.remove('active');
                
                accountTabs.forEach(t => t.classList.remove('active'));
                homeTabs.forEach(t => t.classList.add('active'));
            }
        }
        
        // Initial route handling - COMPLETE REVAMP
        function initializeRoutes() {
            const currentPath = window.location.pathname;
            
            if (currentPath === '/trading/trade') {
                // Hide main content and show trade container
                const mainContent = document.querySelector('main.main-content');
                const tradeContainer = document.getElementById('tradePageContainer');
                const homeTab = document.getElementById('homeTab');
                const fileTraderPage = document.getElementById('fileTraderPage');
                const statusPage = document.getElementById('statusPage');
                
                // Hide all other pages
                if (mainContent) mainContent.style.display = 'none';
                if (homeTab) {
                    homeTab.classList.remove('active');
                    homeTab.style.display = 'none';
                }
                if (fileTraderPage) {
                    fileTraderPage.classList.remove('active');
                    fileTraderPage.style.display = 'none';
                    document.body.classList.remove('file-trader-active');
                }
                if (statusPage) {
                    statusPage.classList.remove('active');
                    statusPage.style.display = 'none';
                }
                
                // Show trade container
                if (tradeContainer) {
                    tradeContainer.style.display = 'block';
                    tradeContainer.setAttribute('data-active', 'true');
                }
                
                // First, update tab highlighting
                updateActiveTab();
                // Then initialize trade page with a small delay to ensure DOM is ready
                setTimeout(() => {
                    initTradePage();
                }, 100);
            } else if (currentPath === '/trading/file-trader') {
                // Show file trader page immediately
                const fileTraderPage = document.getElementById('fileTraderPage');
                const mainContent = document.querySelector('main.main-content');
                const tradeContainer = document.getElementById('tradePageContainer');
                
                if (fileTraderPage) {
                    fileTraderPage.classList.add('active');
                    document.body.classList.add('file-trader-active');
                }
                if (mainContent) mainContent.style.display = 'none';
                if (tradeContainer) {
                    tradeContainer.style.display = 'none';
                    tradeContainer.removeAttribute('data-active');
                }
                
                // Initialize file trader page
                initFileTraderPage();
                
                // Update tab highlighting
                setTimeout(() => {
                    updateActiveTab();
                }, 50);
            } else if (currentPath === '/trading/poke-designer') {
                initPokeDesigner();
            } else if (currentPath === '/status' || currentPath === '/status/') {
                // Standalone Status Page approach
                const mainContent = document.querySelector('main.main-content');
                const tradePageContainer = document.getElementById('tradePageContainer');
                const fileTraderPage = document.getElementById('fileTraderPage');
                const statusPage = document.getElementById('statusPage');
                if (mainContent) mainContent.style.display = 'none';
                if (tradePageContainer) {
                    tradePageContainer.style.display = 'none';
                    tradePageContainer.removeAttribute('data-active');
                }
                if (fileTraderPage) {
                    fileTraderPage.classList.remove('active');
                    document.body.classList.remove('file-trader-active');
                }
                if (statusPage) {
                    statusPage.classList.add('active');
                    statusPage.style.display = 'block';
                }
                // Highlight nav
                document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.nav-tab[data-tab="status"]').forEach(t => t.classList.add('active'));
                // Start polling for status updates - load immediately then start polling
                setTimeout(() => {
                    if (typeof loadBotStatus === 'function') {
                        loadBotStatus();
                    }
                    if (typeof startBotStatusPolling === 'function') {
                        startBotStatusPolling();
                    }
                }, 100);
            } else if (currentPath === '/memberships' || currentPath === '/memberships/') {
                // Memberships page - standalone page, no special handling needed
                // Tab highlighting is handled by updateActiveTab()
                updateActiveTab();
            } else if (currentPath === '/account' || currentPath === '/account/') {
                // On account page, show account tab immediately (will be hidden if not logged in later)
                const accountTabs = document.querySelectorAll('.nav-tab[data-tab="account"]');
                accountTabs.forEach(tab => {
                    tab.style.display = 'inline-block';
                });
                
                // Load account info and expand menu
                if (typeof loadAccountInfo === 'function') {
                    loadAccountInfo().then(() => {
                        // Expand account menu after content loads
                        setTimeout(() => {
                            const content = document.getElementById('accountMenuContent');
                            const toggle = document.getElementById('accountMenuToggle');
                            if (content && toggle) {
                                content.style.display = 'block'; // Ensure it's visible
                                content.style.maxHeight = content.scrollHeight + 'px';
                                toggle.style.transform = 'rotate(180deg)';
                            }
                        }, 200);
                    }).catch(err => {
                        console.error('[ACCOUNT] Error loading account info:', err);
                    });
                } else {
                    console.error('[ACCOUNT] loadAccountInfo function not found');
                }
                updateActiveTab();
            } else {
                updateActiveTab();
            }
        }
        
        // Initialize when DOM is ready - MULTIPLE METHODS TO ENSURE IT RUNS
        function runInitialization() {
            initializeRoutes();
        }
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runInitialization);
        } else {
            // DOM is already ready
            runInitialization();
        }
        
        // Also try on window load as backup
        window.addEventListener('load', () => {
            const currentPath = window.location.pathname;
            if (currentPath === '/trading/trade') {
                updateActiveTab();
                setTimeout(() => {
                    initTradePage();
                }, 100);
            } else if (currentPath === '/trading/file-trader') {
                const fileTraderPage = document.getElementById('fileTraderPage');
                const mainContent = document.querySelector('main.main-content');
                const tradeContainer = document.getElementById('tradePageContainer');
                
                if (fileTraderPage) {
                    fileTraderPage.classList.add('active');
                    document.body.classList.add('file-trader-active');
                }
                if (mainContent) mainContent.style.display = 'none';
                if (tradeContainer) {
                    tradeContainer.style.display = 'none';
                    tradeContainer.removeAttribute('data-active');
                }
                updateActiveTab();
            } else if (currentPath === '/status' || currentPath === '/status/') {
                // Hide main content
                const mainContent = document.querySelector('main.main-content');
                if (mainContent) {
                    mainContent.style.display = 'none';
                }
                
                // Hide trade pages
                const tradePageContainer = document.getElementById('tradePageContainer');
                const fileTraderPage = document.getElementById('fileTraderPage');
                if (tradePageContainer) {
                    tradePageContainer.style.display = 'none';
                    tradePageContainer.removeAttribute('data-active');
                }
                if (fileTraderPage) {
                    fileTraderPage.classList.remove('active');
                    document.body.classList.remove('file-trader-active');
                }
                
                // Show status page
                const statusPage = document.getElementById('statusPage');
                if (statusPage) {
                    statusPage.classList.add('active');
                    statusPage.style.display = 'block';
                }
                
                updateActiveTab();
                setTimeout(() => {
                    if (typeof loadBotStatus === 'function') {
                        loadBotStatus();
                    }
                    if (typeof startBotStatusPolling === 'function') {
                        startBotStatusPolling();
                    }
                }, 100);
            }
        });
        
        // Ensure announcements are visible on all pages
        // Always ensure announcements are loaded (they should be on all pages)
        const checkAnnouncements = () => {
            const banner = document.getElementById('announcementsBanner');
            if (banner) {
                // Always try to load announcements to ensure they're visible
                loadAnnouncements();
            }
        };
        
        // Check announcements when account tab becomes active
        const accountTab = document.getElementById('accountTab');
        if (accountTab) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (accountTab.classList.contains('active')) {
                            checkAnnouncements();
                            // Also ensure account info loads when tab becomes active
                            const path = window.location.pathname;
                            if (typeof loadAccountInfo === 'function' && (path === '/account' || path === '/account/')) {
                                loadAccountInfo().catch(err => {
                                    console.error('[ACCOUNT] Error loading account info:', err);
                                });
                            }
                        }
                    }
                });
            });
            observer.observe(accountTab, { attributes: true, attributeFilter: ['class'] });
        }
        
        // Also check announcements on page load for account page
        if (currentPath === '/account' || currentPath === '/account/') {
            checkAnnouncements();
        }

        // Update auth UI
        // Dedicated function to show/hide account tabs (now always visible)
        function updateAccountTabsVisibility() {
            const accountTabs = document.querySelectorAll('.nav-tab[data-tab="account"]');
            
            // Always show account tabs - remove any hiding styles
            accountTabs.forEach(tab => {
                // Remove any inline style that might hide it
                if (tab.hasAttribute('style') && tab.getAttribute('style').includes('display: none')) {
                    const currentStyle = tab.getAttribute('style');
                    const newStyle = currentStyle.replace(/display\s*:\s*none\s*;?/gi, '').trim();
                    if (newStyle === '') {
                        tab.removeAttribute('style');
                    } else {
                        tab.setAttribute('style', newStyle);
                    }
                }
                // Ensure it's visible
                if (tab.style.display === 'none') {
                    tab.style.display = '';
                }
            });
        }

        // Make updateAuthUI globally accessible
        window.updateAuthUI = function() {
            const loginBtn = document.getElementById('loginBtn');
            const mobileLoginBtn = document.getElementById('mobileLoginBtn');
            const logoutBtn = document.getElementById('logoutBtn');
            const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
            const userName = document.getElementById('userName');
            const userEmail = document.getElementById('userEmail');
            const userPicture = document.getElementById('userPicture');
            const mobileUserName = document.getElementById('mobileUserName');
            const mobileUserEmail = document.getElementById('mobileUserEmail');
            const mobileUserPicture = document.getElementById('mobileUserPicture');
            
            // Account tab elements
            const accountTabs = document.querySelectorAll('.nav-tab[data-tab="account"]');
            const accountTabContent = document.getElementById('accountTab');

            // If authManager isn't ready yet, show login button by default
            if (!window.authManager) {
                if (loginBtn) loginBtn.style.display = 'block';
                if (mobileLoginBtn) mobileLoginBtn.style.display = 'block';
                if (logoutBtn) logoutBtn.style.display = 'none';
                if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'none';
                return;
            }

            if (window.authManager && window.authManager.isAuthenticated()) {
                const user = window.authManager.getUser();
                if (user) {
                    // Desktop
                    if (loginBtn) loginBtn.style.display = 'none';
                    if (logoutBtn) logoutBtn.style.display = 'flex';
                    if (userName) userName.textContent = user.name || user.email;
                    if (userEmail) userEmail.textContent = user.email;
                    if (userPicture && user.picture) {
                        userPicture.src = user.picture;
                        userPicture.style.display = 'block';
                    }
                    
                    // Mobile - Hide the separate login button
                    if (mobileLoginBtn) mobileLoginBtn.style.display = 'none';
                    if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'block';
                    if (mobileUserName) mobileUserName.textContent = user.name || user.email;
                    if (mobileUserEmail) mobileUserEmail.textContent = user.email;
                    if (mobileUserPicture && user.picture) {
                        mobileUserPicture.src = user.picture;
                        mobileUserPicture.style.display = 'block';
                    }
                    
                    // Mobile - Ensure "My Account" link is always "My Account" (no transformation needed)
                    const mobileAccountElement = document.querySelector('.mobile-menu-content .nav-tab[data-tab="account"]');
                    if (mobileAccountElement) {
                        // Remove any login button styling if present (from previous sessions)
                        mobileAccountElement.classList.remove('mobile-login-button');
                        mobileAccountElement.removeAttribute('data-skip-nav');
                        mobileAccountElement.href = '/account';
                        mobileAccountElement.textContent = 'My Account';
                        mobileAccountElement.style.cssText = ''; // Reset styles
                    }
                    
                    // Account tabs are always visible now
                    updateAccountTabsVisibility();
                    // Update active tab highlighting based on current route
                    // Don't update if on trade pages to avoid interfering with their display
                    const currentPath = window.location.pathname;
                    if (currentPath !== '/trading/trade' && currentPath !== '/trading/file-trader') {
                        updateActiveTab();
                    }
                }
            } else {
                // Desktop
                if (loginBtn) loginBtn.style.display = 'block';
                if (logoutBtn) logoutBtn.style.display = 'none';
                
                // Mobile - Hide the separate login button
                if (mobileLoginBtn) mobileLoginBtn.style.display = 'none';
                if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'none';
                
                // Mobile - Ensure "My Account" link is always "My Account" (no transformation)
                const mobileAccountLink = document.querySelector('.mobile-menu-content .nav-tab[data-tab="account"]');
                if (mobileAccountLink) {
                    // Remove any login button styling if present
                    mobileAccountLink.classList.remove('mobile-login-button');
                    mobileAccountLink.removeAttribute('data-skip-nav');
                    mobileAccountLink.href = '/account';
                    mobileAccountLink.textContent = 'My Account';
                    mobileAccountLink.style.cssText = ''; // Reset styles
                }
                
                // Account tabs are always visible now (no need to hide)
                updateAccountTabsVisibility();
                // Account tab content is already hidden by CSS (.tab-content: not active)
                // Update active tab highlighting
                // Don't update if on trade pages to avoid interfering with their display
                const currentPath = window.location.pathname;
                if (currentPath !== '/trading/trade' && currentPath !== '/trading/file-trader') {
                    updateActiveTab();
                }
                
                // If account tab was active, switch to home
                const activeAccountTab = document.querySelector('.nav-tab[data-tab="account"].active');
                if (activeAccountTab) {
                    const homeTab = document.querySelector('.nav-tab[data-tab="home"]');
                    if (homeTab) {
                        switchTab('home', homeTab);
                    }
                }
            }
        }

        // Handle mobile logout
        function handleMobileLogout() {
            if (window.closeMobileMenu) {
                window.closeMobileMenu();
            }
            if (window.authManager) {
                window.authManager.logout();
            }
        }
        
        // Make handleMobileLogout globally accessible
        window.handleMobileLogout = handleMobileLogout;

        // Load account info
        async function loadAccountInfo() {
            console.log('[ACCOUNT] loadAccountInfo called');
            const loading = document.getElementById('accountLoading');
            const error = document.getElementById('accountError');
            const content = document.getElementById('accountContent');

            if (!loading || !error || !content) {
                console.error('[ACCOUNT] Missing required elements:', { loading, error, content });
                return;
            }

            try {
                console.log('[ACCOUNT] Starting to load account info...');
                loading.style.display = 'block';
                error.style.display = 'none';
                content.style.display = 'none';

                console.log('[ACCOUNT] Checking authentication and fetching user data...');
                const authResponse = await fetch(`${API_BASE}/auth/me`, {
                    credentials: 'include',
                });
                
                if (!authResponse.ok) {
                    throw new Error(`Auth check failed: ${authResponse.status}`);
                }
                
                const authData = await authResponse.json();
                console.log('[ACCOUNT] Auth data received:', authData);

                if (!authData.authenticated || !authData.user) {
                    loading.style.display = 'none';
                    error.style.display = 'block';
                    error.innerHTML = `
                        <p style="margin-bottom: 1.5rem; color: var(--text-muted);">You must be logged in to view your account.</p>
                        <a href="/api/auth/google" class="btn-google" style="display: inline-flex; align-items: center; gap: 0.75rem; padding: 1rem 2rem; background: #4285F4; color: white; border: none; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 1rem; cursor: pointer; transition: background 0.2s;">
                            <span class="google-icon">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px;">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                            </span>
                            Sign in with Google
                        </a>
                    `;
                    return;
                }
                
                const user = authData.user;
                console.log('[ACCOUNT] User object:', user);
                
                // FORCE TIER FETCH - IMMEDIATELY, NO CONDITIONS
                console.log('🚀🚀🚀 TIER FETCH STARTING NOW 🚀🚀🚀');
                let tierData = { success: false, tier: 'regular', tierConfig: { name: 'Regular' }, activeSubscriptions: [] };
                const apiBase = window.API_BASE || '/api';
                const tierUrl = `${apiBase}/users/me/tier`;
                console.log('🚀 Fetching:', tierUrl);
                
                try {
                    const tierResponse = await fetch(tierUrl, { credentials: 'include' });
                    console.log('🚀 Response status:', tierResponse.status);
                    if (tierResponse.ok) {
                        tierData = await tierResponse.json();
                        console.log('🚀 Tier data:', tierData);
                    } else {
                        console.error('🚀 Fetch failed, using user data');
                        if (user.tier || user.tierConfig || user.activeSubscriptions) {
                            tierData = { success: true, tier: user.tier || 'regular', tierConfig: user.tierConfig || { name: 'Regular' }, activeSubscriptions: user.activeSubscriptions || [] };
                        }
                    }
                } catch (e) {
                    console.error('🚀 Fetch error:', e);
                    if (user.tier || user.tierConfig || user.activeSubscriptions) {
                        tierData = { success: true, tier: user.tier || 'regular', tierConfig: user.tierConfig || { name: 'Regular' }, activeSubscriptions: user.activeSubscriptions || [] };
                    }
                }
                console.log('🚀 Final tierData:', tierData);

                // Update UI elements
                const profilePicture = document.getElementById('profilePicture');
                if (profilePicture) {
                    profilePicture.src = user.picture || '';
                    profilePicture.onerror = function() {
                        this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Ccircle cx="48" cy="48" r="48" fill="%2310b981"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="36"%3E' + (user.name ? user.name.charAt(0).toUpperCase() : 'U') + '%3C/text%3E%3C/svg%3E';
                    };
                }
                
                const accountUserName = document.getElementById('accountUserName');
                if (accountUserName) {
                    // Use displayName if available, otherwise use name
                    const displayName = user.profile?.displayName || user.displayName || user.name || user.email || 'Unknown User';
                    accountUserName.textContent = displayName;
                }
                
                // Set display name input value
                const displayNameInput = document.getElementById('displayNameInput');
                if (displayNameInput) {
                    const displayName = user.profile?.displayName || user.displayName || user.name || '';
                    displayNameInput.value = displayName;
                }
                
                const accountUserEmail = document.getElementById('accountUserEmail');
                if (accountUserEmail) {
                    accountUserEmail.textContent = user.email || 'No email';
                }
                
                // Also update userEmailDisplay
                const userEmailDisplay = document.getElementById('userEmailDisplay');
                if (userEmailDisplay) {
                    userEmailDisplay.textContent = user.email || 'No email';
                }
                
                // Update membership tier display
                const membershipTier = document.getElementById('membershipTier');
                if (membershipTier && tierData && tierData.success) {
                    const tierName = tierData.tierConfig?.name || tierData.tier.charAt(0).toUpperCase() + tierData.tier.slice(1);
                    membershipTier.textContent = tierName;
                }

                // Update mobile menu user info
                const mobileUserName = document.getElementById('mobileUserName');
                if (mobileUserName) {
                    const displayName = user.profile?.displayName || user.displayName || user.name || user.email || 'Unknown User';
                    mobileUserName.textContent = displayName;
                }

                const mobileUserEmail = document.getElementById('mobileUserEmail');
                if (mobileUserEmail) {
                    mobileUserEmail.textContent = user.email || 'No email';
                }

                const mobileUserPicture = document.getElementById('mobileUserPicture');
                if (mobileUserPicture) {
                    mobileUserPicture.src = user.picture || '';
                    mobileUserPicture.style.display = user.picture ? 'block' : 'none';
                    mobileUserPicture.onerror = function() {
                        this.style.display = 'none';
                    };
                }

                const roleBadge = document.getElementById('roleBadge');
                if (roleBadge) {
                    const role = (user.role || 'user').toLowerCase();
                    roleBadge.textContent = role.charAt(0).toUpperCase() + role.slice(1);
                    roleBadge.className = `badge badge-role role-${role}`;
                }

                const statusBadge = document.getElementById('statusBadge');
                if (statusBadge) {
                    const status = (user.status || 'active').toLowerCase();
                    statusBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
                    statusBadge.className = `badge badge-status status-${status}`;
                }

                // Stats
                const memberSince = document.getElementById('memberSince');
                if (memberSince) {
                    if (user.createdAt) {
                        try {
                            const date = new Date(user.createdAt);
                            memberSince.textContent = date.toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            });
                        } catch (e) {
                            console.error('[ACCOUNT] Error formatting memberSince:', e);
                            memberSince.textContent = 'Unknown';
                        }
                    } else {
                        memberSince.textContent = 'Unknown';
                    }
                }

                const lastLogin = document.getElementById('lastLogin');
                if (lastLogin) {
                    if (user.lastLogin) {
                        lastLogin.textContent = getRelativeTime(user.lastLogin);
                    } else {
                        lastLogin.textContent = 'Never';
                    }
                }

                const loginCount = document.getElementById('loginCount');
                if (loginCount) {
                    loginCount.textContent = (user.stats && user.stats.loginCount) ? user.stats.loginCount : 0;
                }

                const accountStatus = document.getElementById('accountStatus');
                if (accountStatus) {
                    const status = (user.status || 'active').toLowerCase();
                    accountStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1);
                }

                // UPDATE TIER DISPLAY
                const updateTierDisplay = (tierInfo) => {
                    console.log('[ACCOUNT] updateTierDisplay called with:', tierInfo);
                    
                    if (!tierInfo) {
                        console.error('[ACCOUNT] updateTierDisplay: tierInfo is null/undefined');
                        return;
                    }
                    
                    const tier = String(tierInfo.tier || 'regular').toLowerCase().trim();
                    const tierName = tierInfo.tierConfig?.name || tier.charAt(0).toUpperCase() + tier.slice(1);
                    
                    console.log('[ACCOUNT] updateTierDisplay - tier:', tier, 'tierName:', tierName);
                    
                    const tierColors = {
                        'regular': { bg: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.8)' },
                        'basic': { bg: 'rgba(52, 152, 219, 0.2)', color: '#3498db' },
                        'standard': { bg: 'rgba(155, 89, 182, 0.2)', color: '#9b59b6' },
                        'premium': { bg: 'rgba(241, 196, 15, 0.2)', color: '#f1c40f' }
                    };
                    const colors = tierColors[tier] || tierColors['regular'];
                    
                    // Update tier badge
                    const tierBadge = document.getElementById('tierBadge');
                    if (tierBadge) {
                        tierBadge.textContent = tierName;
                        tierBadge.style.background = colors.bg;
                        tierBadge.style.color = colors.color;
                        console.log('[ACCOUNT] Tier badge updated:', tierName);
                    }
                    
                    // Update membership tier
                    const membershipTier = document.getElementById('membershipTier');
                    if (membershipTier) {
                        membershipTier.textContent = tierName;
                        membershipTier.style.color = colors.color;
                        console.log('[ACCOUNT] Membership tier updated:', tierName);
                    }
                };
                
                // Update tier - try with tierData, fallback to user data
                if (tierData && tierData.success && tierData.tier) {
                    console.log('[ACCOUNT] Updating tier from tierData');
                    updateTierDisplay(tierData);
                } else if (user.tier || user.tierConfig) {
                    console.log('[ACCOUNT] Updating tier from user data (fallback)');
                    updateTierDisplay({
                        tier: user.tier || 'regular',
                        tierConfig: user.tierConfig || { name: 'Regular' }
                    });
                } else {
                    console.warn('[ACCOUNT] No tier data available, using default');
                    updateTierDisplay({ tier: 'regular', tierConfig: { name: 'Regular' } });
                }

                // UPDATE SUBSCRIPTIONS DISPLAY
                const updateSubscriptionsDisplay = (subscriptions) => {
                    console.log('[ACCOUNT] updateSubscriptionsDisplay called with:', subscriptions);
                    
                    const container = document.getElementById('activeSubscriptionsList');
                    if (!container) {
                        console.error('[ACCOUNT] Subscriptions container not found!');
                        return;
                    }
                    
                    // Normalize to array
                    let subsArray = [];
                    if (subscriptions) {
                        if (Array.isArray(subscriptions)) {
                            subsArray = subscriptions;
                        } else if (typeof subscriptions === 'object') {
                            subsArray = Object.values(subscriptions);
                        }
                    }
                    
                    console.log('[ACCOUNT] Normalized subscriptions array length:', subsArray.length);
                    
                    if (!subsArray || subsArray.length === 0) {
                        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 1rem;">No active subscriptions. Claim a subscription using the form below.</p>';
                        console.log('[ACCOUNT] No subscriptions to display');
                        return;
                    }
                    
                    const tierColors = {
                        'regular': { bg: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.8)' },
                        'basic': { bg: 'rgba(52, 152, 219, 0.2)', color: '#3498db' },
                        'standard': { bg: 'rgba(155, 89, 182, 0.2)', color: '#9b59b6' },
                        'premium': { bg: 'rgba(241, 196, 15, 0.2)', color: '#f1c40f' }
                    };
                    
                    function escapeHtml(text) {
                        const div = document.createElement('div');
                        div.textContent = text;
                        return div.innerHTML;
                    }
                    
                    container.innerHTML = subsArray.map((sub, index) => {
                        console.log(`[ACCOUNT] Processing subscription ${index + 1}:`, sub);
                        const subTier = String(sub.system_tier || 'regular').toLowerCase();
                        const subTierName = sub.tier_name || subTier.charAt(0).toUpperCase() + subTier.slice(1);
                        const subColors = tierColors[subTier] || tierColors['regular'];
                        
                        let startDate, endDate, daysRemaining;
                        try {
                            startDate = new Date(sub.subscription_start_date);
                            endDate = new Date(sub.subscription_end_date);
                            daysRemaining = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));
                            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                                console.warn('[ACCOUNT] Invalid date in subscription:', sub);
                                daysRemaining = 0;
                            }
                        } catch (e) {
                            console.error('[ACCOUNT] Error parsing dates:', e);
                            startDate = new Date();
                            endDate = new Date();
                            daysRemaining = 0;
                        }
                        
                        return `<div style="background: rgba(14, 17, 23, 0.6); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(140, 82, 255, 0.25); margin-bottom: 1rem;">
                            <div class="subscription-badges" style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
                                <span style="padding: 0.5rem 1rem; border-radius: 8px; background: ${subColors.bg}; color: ${subColors.color}; font-weight: 600; font-size: 0.9rem;">${escapeHtml(subTierName)}</span>
                                <span style="padding: 0.5rem 1rem; border-radius: 8px; background: rgba(39, 174, 96, 0.2); color: #27ae60; font-weight: 600; font-size: 0.85rem;">Active</span>
                            </div>
                            <div style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.5rem;">
                                <strong style="color: var(--text);">Email:</strong> ${escapeHtml(sub.email || 'N/A')}
                            </div>
                            <div style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.5rem;">
                                <strong style="color: var(--text);">Started:</strong> ${startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </div>
                            <div style="color: var(--text-muted); font-size: 0.875rem;">
                                <strong style="color: var(--text);">Expires:</strong> ${endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} 
                                <span style="color: ${daysRemaining <= 7 ? '#e74c3c' : daysRemaining <= 14 ? '#f39c12' : '#27ae60'}; margin-left: 0.5rem;">
                                    (${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} remaining)
                                </span>
                            </div>
                        </div>`;
                    }).join('');
                    
                    console.log('[ACCOUNT] Subscriptions displayed successfully:', subsArray.length);
                };
                
                // Update subscriptions - try with tierData, fallback to user data
                // Only show the highest tier subscription if multiple exist
                let subscriptionsToDisplay = [];
                if (tierData && tierData.success && Array.isArray(tierData.activeSubscriptions)) {
                    console.log('[ACCOUNT] Using subscriptions from tierData');
                    subscriptionsToDisplay = tierData.activeSubscriptions;
                } else if (user.activeSubscriptions && Array.isArray(user.activeSubscriptions)) {
                    console.log('[ACCOUNT] Using subscriptions from user data (fallback)');
                    subscriptionsToDisplay = user.activeSubscriptions;
                } else {
                    console.log('[ACCOUNT] No subscriptions data available');
                }
                
                // Filter to only show the highest tier subscription
                if (subscriptionsToDisplay.length > 0) {
                    const tierPriority = {
                        'regular': 0,
                        'basic': 1,
                        'standard': 2,
                        'premium': 3
                    };
                    
                    // Sort by tier priority (highest first)
                    subscriptionsToDisplay.sort((a, b) => {
                        const tierA = String(a.system_tier || 'regular').toLowerCase();
                        const tierB = String(b.system_tier || 'regular').toLowerCase();
                        const priorityA = tierPriority[tierA] || 0;
                        const priorityB = tierPriority[tierB] || 0;
                        return priorityB - priorityA; // Descending order
                    });
                    
                    // Only keep the highest tier subscription
                    subscriptionsToDisplay = [subscriptionsToDisplay[0]];
                    console.log('[ACCOUNT] Filtered to highest tier subscription:', subscriptionsToDisplay[0]?.system_tier);
                }
                
                console.log('[ACCOUNT] Displaying subscriptions:', subscriptionsToDisplay.length);
                updateSubscriptionsDisplay(subscriptionsToDisplay);

                // Ensure all UI updates are complete before showing content
                await new Promise(resolve => setTimeout(resolve, 100));
                
                console.log('[ACCOUNT] Hiding loading, showing content');
                loading.style.display = 'none';
                content.style.display = 'block';
                console.log('[ACCOUNT] Account info loaded successfully');
                
                // Ensure account menu content is visible and expanded
                const accountMenuContent = document.getElementById('accountMenuContent');
                const accountMenuToggle = document.getElementById('accountMenuToggle');
                if (accountMenuContent && accountMenuToggle) {
                    accountMenuContent.style.display = 'block';
                    accountMenuContent.style.maxHeight = accountMenuContent.scrollHeight + 'px';
                    accountMenuToggle.style.transform = 'rotate(180deg)';
                }
                
                // Setup display name handlers after content is visible
                setTimeout(() => {
                    setupDisplayNameHandlers();
                }, 200);
                
                // Load activity log after content is shown
                await loadActivityLog();
            } catch (err) {
                console.error('[ACCOUNT] Error loading account info:', err);
                if (loading) loading.style.display = 'none';
                const errorEl = document.getElementById('accountError');
                if (errorEl) {
                    errorEl.style.display = 'block';
                    errorEl.textContent = `Error: ${err.message || 'Failed to load account information. Please try again.'}`;
                }
            }
        }

        // Load activity log
        async function loadActivityLog() {
            const loading = document.getElementById('activityLogLoading');
            const error = document.getElementById('activityLogError');
            const container = document.getElementById('activityLogContainer');
            const tbody = document.getElementById('activityLogBody');

            if (!loading || !error || !container || !tbody) {
                console.warn('[ACCOUNT] Activity log elements not found');
                return;
            }

            try {
                loading.style.display = 'block';
                error.style.display = 'none';
                container.style.display = 'none';

                const response = await fetch(`${API_BASE}/users/me/activity?limit=10`, {
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`Failed to load activity log: ${response.status}`);
                }

                const data = await response.json();
                if (!data.success || !data.logs) {
                    throw new Error('Invalid activity log data');
                }

                if (data.logs.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">No activity logs found</td></tr>';
                } else {
                    tbody.innerHTML = data.logs.map(log => {
                        const date = new Date(log.timestamp);
                        const formattedDate = date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                        
                        const statusClass = log.status === 'Success' ? 'status-success' :
                                          log.status === 'Error' ? 'status-error' :
                                          'status-info';
                        const statusColor = log.status === 'Success' ? '#27ae60' :
                                          log.status === 'Error' ? '#e74c3c' :
                                          '#3498db';

                        return `
                            <tr style="border-bottom: 1px solid var(--border); transition: background 0.2s;">
                                <td data-label="Event" style="padding: 12px; color: var(--text);">${escapeHtml(log.event || 'N/A')}</td>
                                <td data-label="IP Address" style="padding: 12px; color: var(--text-muted); font-family: monospace; font-size: 0.9rem;">${escapeHtml(log.ipAddress || 'N/A')}</td>
                                <td data-label="Date & Time" style="padding: 12px; color: var(--text-muted);">${formattedDate}</td>
                                <td data-label="Details" style="padding: 12px; color: var(--text-light);">${escapeHtml(log.details || '-')}</td>
                                <td data-label="Status" style="padding: 12px;">
                                    <span style="background: ${statusColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.85em; font-weight: 500;">
                                        ${escapeHtml(log.status || 'Info')}
                                    </span>
                                </td>
                            </tr>
                        `;
                    }).join('');
                }

                loading.style.display = 'none';
                container.style.display = 'block';
                
                // Re-setup display name handlers after content is shown
                setupDisplayNameHandlers();
            } catch (err) {
                console.error('[ACCOUNT] Error loading activity log:', err);
                loading.style.display = 'none';
                error.style.display = 'block';
                error.textContent = `Error loading activity log: ${err.message}`;
            }
        }

        // Update display name
        async function updateDisplayName() {
            console.log('[ACCOUNT] updateDisplayName called');
            const input = document.getElementById('displayNameInput');
            const error = document.getElementById('displayNameError');
            const btn = document.getElementById('updateDisplayNameBtn');

            console.log('[ACCOUNT] Elements found:', { input: !!input, error: !!error, btn: !!btn });

            if (!input || !error || !btn) {
                console.error('[ACCOUNT] Missing required elements for display name update');
                return;
            }

            const displayName = input.value.trim();
            console.log('[ACCOUNT] Display name value:', displayName);

            if (!displayName) {
                error.style.display = 'block';
                error.textContent = 'Display name cannot be empty';
                return;
            }

            if (displayName.length > 100) {
                error.style.display = 'block';
                error.textContent = 'Display name must be 100 characters or less';
                return;
            }

            try {
                error.style.display = 'none';
                error.style.color = 'var(--error)';
                btn.disabled = true;
                btn.textContent = 'Updating...';

                console.log('[ACCOUNT] Sending request to:', `${API_BASE}/users/me/profile`);
                const response = await fetch(`${API_BASE}/users/me/profile`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ displayName }),
                });

                console.log('[ACCOUNT] Response status:', response.status);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('[ACCOUNT] Update failed:', errorData);
                    throw new Error(errorData.error || 'Failed to update display name');
                }

                const data = await response.json();
                if (data.success) {
                    // Update the displayed name in multiple places
                    const accountUserName = document.getElementById('accountUserName');
                    if (accountUserName) {
                        accountUserName.textContent = displayName;
                    }
                    
                    // Update mobile user name if it exists
                    const mobileUserName = document.getElementById('mobileUserName');
                    if (mobileUserName) {
                        mobileUserName.textContent = displayName;
                    }
                    
                    // Update input field to reflect the new value
                    if (input) {
                        input.value = displayName;
                    }
                    
                    // Show success message
                    error.style.display = 'block';
                    error.style.color = 'var(--success)';
                    error.textContent = 'Display name updated successfully!';
                    
                    // Clear success message after 3 seconds
                    setTimeout(() => {
                        error.style.display = 'none';
                    }, 3000);
                    
                    // Reload activity log to show the update
                    setTimeout(() => {
                        loadActivityLog();
                    }, 500);
                } else {
                    throw new Error(data.error || 'Update failed');
                }
            } catch (err) {
                console.error('[ACCOUNT] Error updating display name:', err);
                error.style.display = 'block';
                error.style.color = 'var(--error)';
                error.textContent = err.message || 'Failed to update display name';
            } finally {
                btn.disabled = false;
                btn.textContent = 'Update Name';
            }
        }

        // Make updateDisplayName globally accessible
        window.updateDisplayName = updateDisplayName;

        // Function to setup display name update handlers
        function setupDisplayNameHandlers() {
            // Use event delegation to handle clicks on the button
            // This works even if the button is added dynamically
            const updateDisplayNameBtn = document.getElementById('updateDisplayNameBtn');
            if (updateDisplayNameBtn) {
                console.log('[ACCOUNT] Found updateDisplayNameBtn, adding listener');
                // Remove old listener by cloning
                const newBtn = updateDisplayNameBtn.cloneNode(true);
                updateDisplayNameBtn.parentNode.replaceChild(newBtn, updateDisplayNameBtn);
                
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[ACCOUNT] Update button clicked');
                    updateDisplayName();
                });
            } else {
                console.log('[ACCOUNT] updateDisplayNameBtn not found, will use event delegation');
            }
            
            const displayNameInput = document.getElementById('displayNameInput');
            if (displayNameInput) {
                displayNameInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        console.log('[ACCOUNT] Enter key pressed');
                        updateDisplayName();
                    }
                });
            }
        }

        // Make setupDisplayNameHandlers globally accessible
        window.setupDisplayNameHandlers = setupDisplayNameHandlers;

        // Initialize
        document.addEventListener('DOMContentLoaded', async () => {
            // If on file trader page, set it up IMMEDIATELY before anything else
            if (window.location.pathname === '/trading/file-trader') {
                const fileTraderPage = document.getElementById('fileTraderPage');
                const mainContent = document.querySelector('main.main-content');
                const tradeContainer = document.getElementById('tradePageContainer');
                const fileTraderForm = document.getElementById('fileTraderForm');
                
                if (fileTraderPage) {
                    fileTraderPage.classList.add('active');
                    document.body.classList.add('file-trader-active');
                }
                if (mainContent) mainContent.style.display = 'none';
                if (tradeContainer) {
                    tradeContainer.style.display = 'none';
                    tradeContainer.removeAttribute('data-active');
                }
                if (fileTraderForm) {
                    fileTraderForm.style.display = 'block';
                    fileTraderForm.style.visibility = 'visible';
                }
            }
            
            updateAuthUI();
            // Also ensure account tabs are visible
            setTimeout(() => updateAccountTabsVisibility(), 100);
            
            // Use event delegation for the button (works even when hidden)
            document.addEventListener('click', (e) => {
                if (e.target && e.target.id === 'updateDisplayNameBtn') {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[ACCOUNT] Update button clicked (event delegation)');
                    updateDisplayName();
                }
            });
            
            // Use event delegation for Enter key
            document.addEventListener('keypress', (e) => {
                if (e.target && e.target.id === 'displayNameInput' && e.key === 'Enter') {
                    e.preventDefault();
                    console.log('[ACCOUNT] Enter key pressed (event delegation)');
                    updateDisplayName();
                }
            });
            
            // Also try direct setup
            setupDisplayNameHandlers();
            
            // Add event listener to mobile login button as backup
            const mobileLoginBtn = document.querySelector('#mobileLoginBtn button');
            if (mobileLoginBtn) {
                mobileLoginBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[MOBILE] Login button clicked via event listener');
                    window.handleMobileLogin();
                });
            }
            
            // Handle URL errors first (suspension, banned, etc.)
            handleURLErrors();
            
            if (window.authManager) {
                window.authManager.checkAuth().then(() => {
                    // Check if we're on file trader page BEFORE doing anything
                    const currentPath = window.location.pathname;
                    const isFileTraderPage = currentPath === '/trading/file-trader';
                    
                    if (isFileTraderPage) {
                        const fileTraderPage = document.getElementById('fileTraderPage');
                        const mainContent = document.querySelector('main.main-content');
                        const tradeContainer = document.getElementById('tradePageContainer');
                        
                        if (fileTraderPage) {
                            fileTraderPage.classList.add('active');
                            document.body.classList.add('file-trader-active');
                        }
                        if (mainContent) mainContent.style.display = 'none';
                        if (tradeContainer) {
                            tradeContainer.style.display = 'none';
                            tradeContainer.removeAttribute('data-active');
                        }
                    }
                    
                    updateAuthUI();
                    
                    // Restore file trader page state AFTER updateAuthUI
                    if (isFileTraderPage) {
                        const fileTraderPage = document.getElementById('fileTraderPage');
                        const mainContent = document.querySelector('main.main-content');
                        const fileTraderForm = document.getElementById('fileTraderForm');
                        
                        if (fileTraderPage) {
                            fileTraderPage.classList.add('active');
                            document.body.classList.add('file-trader-active');
                        }
                        if (mainContent) mainContent.style.display = 'none';
                        if (fileTraderForm) {
                            fileTraderForm.style.display = 'block';
                            fileTraderForm.style.visibility = 'visible';
                        }
                    }
                    
                    // Check account status after auth check
                    checkAccountStatus();
                    
                    // Load account info if on account page and authenticated
                    if ((currentPath === '/account' || currentPath === '/account/') && typeof loadAccountInfo === 'function') {
                        if (window.authManager.isAuthenticated()) {
                            loadAccountInfo().catch(err => {
                                console.error('[ACCOUNT] Error loading account info after auth:', err);
                            });
                        }
                    }
                });
                
                // Listen for auth changes
                document.addEventListener('authChange', () => {
                    // Check if we're on file trader page BEFORE doing anything
                    const currentPath = window.location.pathname;
                    const isFileTraderPage = currentPath === '/trading/file-trader';
                    
                    if (isFileTraderPage) {
                        const fileTraderPage = document.getElementById('fileTraderPage');
                        const mainContent = document.querySelector('main.main-content');
                        const tradeContainer = document.getElementById('tradePageContainer');
                        
                        if (fileTraderPage) {
                            fileTraderPage.classList.add('active');
                            document.body.classList.add('file-trader-active');
                        }
                        if (mainContent) mainContent.style.display = 'none';
                        if (tradeContainer) {
                            tradeContainer.style.display = 'none';
                            tradeContainer.removeAttribute('data-active');
                        }
                    }
                    
                    updateAuthUI();
                    
                    // Restore file trader page state AFTER updateAuthUI
                    if (isFileTraderPage) {
                        const fileTraderPage = document.getElementById('fileTraderPage');
                        const mainContent = document.querySelector('main.main-content');
                        const fileTraderForm = document.getElementById('fileTraderForm');
                        
                        if (fileTraderPage) {
                            fileTraderPage.classList.add('active');
                            document.body.classList.add('file-trader-active');
                        }
                        if (mainContent) mainContent.style.display = 'none';
                        if (fileTraderForm) {
                            fileTraderForm.style.display = 'block';
                            fileTraderForm.style.visibility = 'visible';
                        }
                    }
                    
                    // Check account status when auth changes
                    checkAccountStatus();
                    
                    // Load account info if on account page and authenticated
                    if ((currentPath === '/account' || currentPath === '/account/') && typeof loadAccountInfo === 'function') {
                        if (window.authManager.isAuthenticated()) {
                            loadAccountInfo().catch(err => {
                                console.error('[ACCOUNT] Error loading account info on auth change:', err);
                            });
                        }
                    }
                });
            }

            // Load announcements after DOM is ready (on all pages)
            loadAnnouncements();
        });

        // Handle announcements above header
        async function loadAnnouncements() {
            console.log('[ANNOUNCEMENTS] loadAnnouncements() called');
            const banner = document.getElementById('announcementsBanner');
            const bannerContent = document.getElementById('announcementsBannerContent');
            const mainHeader = document.getElementById('mainHeader');

            console.log('[ANNOUNCEMENTS] Banner element:', banner);
            console.log('[ANNOUNCEMENTS] BannerContent element:', bannerContent);
            console.log('[ANNOUNCEMENTS] MainHeader element:', mainHeader);

            if (!banner || !bannerContent) {
                console.error('[ANNOUNCEMENTS] Banner elements not found!');
                return;
            }

            try {
                const pagePath = window.location.pathname;
                const apiUrl = `${API_BASE}/announcements?page=${encodeURIComponent(pagePath)}`;
                console.log('[ANNOUNCEMENTS] Loading announcements for page:', pagePath);
                console.log('[ANNOUNCEMENTS] API URL:', apiUrl);
                console.log('[ANNOUNCEMENTS] API_BASE:', API_BASE);
                
                const response = await fetch(apiUrl);
                console.log('[ANNOUNCEMENTS] Response status:', response.status);
                console.log('[ANNOUNCEMENTS] Response ok:', response.ok);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('[ANNOUNCEMENTS] Response data:', JSON.stringify(data, null, 2));
                    
                    if (data.success && data.announcements && data.announcements.length > 0) {
                        console.log('[ANNOUNCEMENTS] Found', data.announcements.length, 'announcements');
                        bannerContent.innerHTML = '';
                        
                        data.announcements.forEach((announcement, index) => {
                            console.log(`[ANNOUNCEMENTS] Processing announcement ${index + 1}:`, announcement);
                            
                            const bannerDiv = document.createElement('div');
                            bannerDiv.className = 'announcement-banner';
                            const color = announcement.color || announcement.backgroundColor || '#10b981';
                            // Ensure color is a valid hex color (not CSS variable)
                            const finalColor = color.startsWith('var(') ? '#10b981' : color;
                            bannerDiv.style.background = `linear-gradient(135deg, ${finalColor} 0%, ${finalColor}dd 100%)`;
                            // Don't override CSS with inline styles for positioning/sizing
                            
                            const contentDiv = document.createElement('div');
                            contentDiv.className = 'announcement-content';
                            
                            const icon = document.createElement('i');
                            icon.className = 'fas fa-exclamation-circle announcement-icon';
                            
                            const textSpan = document.createElement('span');
                            textSpan.className = 'announcement-text';
                            textSpan.textContent = announcement.title ? 
                                `${announcement.title}${announcement.message ? ' - ' + announcement.message : ''}` : 
                                (announcement.message || 'Announcement');
                            
                            contentDiv.appendChild(icon);
                            contentDiv.appendChild(textSpan);
                            bannerDiv.appendChild(contentDiv);
                            bannerContent.appendChild(bannerDiv);
                            
                            console.log(`[ANNOUNCEMENTS] Added announcement ${index + 1} to DOM`);
                        });
                        
                        // Show banner (part of page flow, above header)
                        console.log('[ANNOUNCEMENTS] Showing banner...');
                        banner.classList.remove('hidden');
                        banner.style.display = 'block';
                        
                        // No need to adjust body margin - banner is in normal flow
                    } else {
                        console.log('[ANNOUNCEMENTS] No active announcements. Data:', data);
                        // Hide banner if no announcements
                        banner.classList.add('hidden');
                        banner.style.display = 'none';
                    }
                } else {
                    const errorText = await response.text();
                    console.error('[ANNOUNCEMENTS] Response not OK:', response.status, errorText);
                    banner.classList.add('hidden');
                    banner.style.display = 'none';
                }
            } catch (error) {
                console.error('[ANNOUNCEMENTS] Error loading announcements:', error);
                console.error('[ANNOUNCEMENTS] Error stack:', error.stack);
                banner.classList.add('hidden');
                banner.style.display = 'none';
            }
        }

        // Show suspension popup (PERSISTENT - cannot be dismissed)
        function showSuspensionPopup(message) {
            console.log('[SUSPENSION] showSuspensionPopup called with message:', message);
            
            // Wait for body to exist
            const ensureBody = () => {
                if (document.body) {
                    createPopup();
                } else {
                    console.log('[SUSPENSION] Body not ready, waiting...');
                    setTimeout(ensureBody, 50);
                }
            };
            
            const createPopup = () => {
                try {
            // Remove any existing popup
            const existing = document.getElementById('suspensionPopup');
                    if (existing) {
                        console.log('[SUSPENSION] Removing existing popup');
                        existing.remove();
                    }
            
            const popup = document.createElement('div');
            popup.id = 'suspensionPopup';
            popup.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                        background: rgba(0, 0, 0, 0.9);
                        z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                        pointer-events: auto;
            `;
            
            popup.innerHTML = `
                <div style="
                    background: var(--surface);
                            border: 3px solid var(--error);
                    border-radius: 16px;
                            padding: 40px;
                            max-width: 600px;
                    width: 100%;
                            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    text-align: center;
                            position: relative;
                ">
                    <div style="
                                font-size: 64px;
                        margin-bottom: 20px;
                        color: var(--error);
                    ">⚠️</div>
                    <h2 style="
                        color: var(--error);
                                margin-bottom: 20px;
                                font-size: 1.75em;
                                font-weight: 700;
                    ">Account Suspended</h2>
                    <p style="
                        color: var(--text);
                                margin-bottom: 30px;
                                line-height: 1.8;
                        white-space: pre-wrap;
                                font-size: 1.1em;
                    ">${escapeHtml(message)}</p>
                            <div style="
                                padding: 15px;
                                background: rgba(220, 53, 69, 0.1);
                        border-radius: 8px;
                                margin-top: 20px;
                                color: var(--text-muted);
                                font-size: 0.9em;
                            ">
                                This message cannot be dismissed. Please contact support if you believe this is an error.
                            </div>
                </div>
            `;
            
            document.body.appendChild(popup);
                    console.log('[SUSPENSION] Popup created and appended to body');
                } catch (err) {
                    console.error('[SUSPENSION] Error creating popup:', err);
                    // Fallback: show alert
                    alert('Account Suspended\n\n' + message);
                }
            };
            
            ensureBody();
        }
        
        // Show banned popup (PERSISTENT - cannot be dismissed)
        function showBannedPopup(message) {
            const existing = document.getElementById('bannedPopup');
            if (existing) existing.remove();
            
            const popup = document.createElement('div');
            popup.id = 'bannedPopup';
            popup.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                pointer-events: auto;
            `;
            
            popup.innerHTML = `
                <div style="
                    background: var(--surface);
                    border: 3px solid var(--error);
                    border-radius: 16px;
                    padding: 40px;
                    max-width: 600px;
                    width: 100%;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    text-align: center;
                ">
                    <div style="
                        font-size: 64px;
                        margin-bottom: 20px;
                        color: var(--error);
                    ">🚫</div>
                    <h2 style="
                        color: var(--error);
                        margin-bottom: 20px;
                        font-size: 1.75em;
                        font-weight: 700;
                    ">Account Banned</h2>
                    <p style="
                        color: var(--text);
                        margin-bottom: 30px;
                        line-height: 1.8;
                        white-space: pre-wrap;
                        font-size: 1.1em;
                    ">${escapeHtml(message)}</p>
                    <div style="
                        padding: 15px;
                        background: rgba(220, 53, 69, 0.1);
                        border-radius: 8px;
                        margin-top: 20px;
                        color: var(--text-muted);
                        font-size: 0.9em;
                    ">
                        This message cannot be dismissed. Please contact support if you believe this is an error.
                    </div>
                </div>
            `;
            
            document.body.appendChild(popup);
            console.log('[BANNED] Popup displayed with message:', message);
        }
        
        // Show error popup (PERSISTENT - cannot be dismissed)
        function showErrorPopup(message) {
            const existing = document.getElementById('errorPopup');
            if (existing) existing.remove();
            
            const popup = document.createElement('div');
            popup.id = 'errorPopup';
            popup.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                pointer-events: auto;
            `;
            
            popup.innerHTML = `
                <div style="
                    background: var(--surface);
                    border: 3px solid var(--warning);
                    border-radius: 16px;
                    padding: 40px;
                    max-width: 600px;
                    width: 100%;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    text-align: center;
                ">
                    <div style="
                        font-size: 64px;
                        margin-bottom: 20px;
                        color: var(--warning);
                    ">⚠️</div>
                    <h2 style="
                        color: var(--warning);
                        margin-bottom: 20px;
                        font-size: 1.75em;
                        font-weight: 700;
                    ">Access Restricted</h2>
                    <p style="
                        color: var(--text);
                        margin-bottom: 30px;
                        line-height: 1.8;
                        white-space: pre-wrap;
                        font-size: 1.1em;
                    ">${escapeHtml(message)}</p>
                    <div style="
                        padding: 15px;
                        background: rgba(255, 193, 7, 0.1);
                        border-radius: 8px;
                        margin-top: 20px;
                        color: var(--text-muted);
                        font-size: 0.9em;
                    ">
                        This message cannot be dismissed. Please contact support if you believe this is an error.
                    </div>
                </div>
            `;
            
            document.body.appendChild(popup);
            console.log('[ERROR] Popup displayed with message:', message);
        }
        
        // Handle URL error parameters (suspension, IP restriction, etc.)
        function handleURLErrors() {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const error = urlParams.get('error');
                const reason = urlParams.get('reason') || urlParams.get('message');
                
                if (!error) {
                    console.log('[URL ERRORS] No error parameter found');
                    return;
                }
                
                console.log('[URL ERRORS] Detected error:', error, 'reason:', reason);
                
                // Decode the reason if it's URL encoded
                let decodedReason = null;
                if (reason) {
                    try {
                        decodedReason = decodeURIComponent(reason);
                    } catch (e) {
                        console.warn('[URL ERRORS] Failed to decode reason, using raw:', e);
                        decodedReason = reason;
                    }
                }
                
                // Wait for DOM to be ready
                const showError = () => {
                    if (error === 'suspended') {
                        const message = decodedReason || 'Your account has been suspended due to a violation of our terms of service.';
                        console.log('[URL ERRORS] Showing suspension popup with message:', message);
                        if (typeof showSuspensionPopup === 'function') {
                            showSuspensionPopup(message);
                        } else {
                            console.error('[URL ERRORS] showSuspensionPopup is not a function!');
                            alert('Account Suspended\n\n' + message);
                        }
                        // Clear URL params
                        window.history.replaceState({}, document.title, window.location.pathname);
                    } else if (error === 'banned') {
                        const message = decodedReason || 'Your account has been banned due to a violation of our terms of service.';
                        console.log('[URL ERRORS] Showing banned popup');
                        if (typeof showBannedPopup === 'function') {
                            showBannedPopup(message);
                        } else {
                            alert('Account Banned\n\n' + message);
                        }
                        // Clear URL params
                        window.history.replaceState({}, document.title, window.location.pathname);
                    } else if (error === 'ip_restriction') {
                        const message = decodedReason || 'An account already exists for this IP address. Only one account per IP is allowed.';
                        console.log('[URL ERRORS] Showing error popup');
                        if (typeof showErrorPopup === 'function') {
                            showErrorPopup(message);
                        } else {
                            alert('Access Restricted\n\n' + message);
                        }
                        // Clear URL params
                        window.history.replaceState({}, document.title, window.location.pathname);
                    } else {
                        // Generic error handling
                        if (decodedReason) {
                            console.log('[URL ERRORS] Showing generic error notification');
                            if (typeof showNotification === 'function') {
                                showNotification(decodedReason, 'error', 10000);
                            } else {
                                alert('Error\n\n' + decodedReason);
                            }
                            window.history.replaceState({}, document.title, window.location.pathname);
                        }
                    }
                };
                
                // Wait for body to exist
                if (document.body) {
                    setTimeout(showError, 100);
                } else {
                    console.log('[URL ERRORS] Body not ready, waiting for DOMContentLoaded');
                    document.addEventListener('DOMContentLoaded', () => {
                        setTimeout(showError, 100);
                    });
                }
            } catch (err) {
                console.error('[ERROR] Failed to handle URL errors:', err);
                // Fallback: try to show a notification with the raw error
                const urlParams = new URLSearchParams(window.location.search);
                const error = urlParams.get('error');
                const reason = urlParams.get('reason') || urlParams.get('message');
                if (error && reason) {
                    try {
                        const decoded = decodeURIComponent(reason);
                        alert('Error: ' + error + '\n\n' + decoded);
                    } catch (e) {
                        console.error('[ERROR] Failed to show error notification:', e);
                        alert('An error occurred. Please check the console for details.');
                    }
                }
            }
        }
        
        // Call immediately on script load to catch errors early
        console.log('[URL ERRORS] Script loaded, readyState:', document.readyState);
        if (document.readyState === 'loading') {
            // DOM is still loading, wait for it
            console.log('[URL ERRORS] Waiting for DOMContentLoaded');
            document.addEventListener('DOMContentLoaded', () => {
                console.log('[URL ERRORS] DOMContentLoaded fired, calling handleURLErrors');
        handleURLErrors();
            });
        } else {
            // DOM is already loaded
            console.log('[URL ERRORS] DOM already loaded, calling handleURLErrors immediately');
            handleURLErrors();
        }
        
        // Check for suspended/banned accounts on page load
        async function checkAccountStatus() {
            if (!window.authManager) return;
            
            try {
                // Get current auth status (don't call checkAuth again if already authenticated)
                const isAuth = window.authManager.isAuthenticated();
                if (!isAuth || !window.authManager.user) {
                    return;
                }
                
                const user = window.authManager.user;
                
                // Get full user data to check actual status (banned takes priority)
                const response = await fetch(`${API_BASE}/users/me`, {
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.user) {
                        // Check if account is banned FIRST (banned takes priority over suspended)
                        if (data.user.status === 'banned') {
                            let message = 'Your account has been permanently banned due to a violation of our terms of service.';
                            if (data.user.banReason) {
                                message += ` Reason: ${data.user.banReason}`;
                            }
                            showBannedPopup(message);
                            return;
                        }
                        // Check if account is suspended
                        else if (data.user.status === 'suspended') {
                            const suspensionEndDate = data.user.suspensionEndDate;
                            let message = 'Your account has been suspended due to a violation of our terms of service.';
                            if (suspensionEndDate) {
                                const endDate = new Date(suspensionEndDate);
                                const now = new Date();
                                if (endDate > now) {
                                    const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
                                    message += ` Your suspension will be lifted on ${endDate.toLocaleDateString()} (${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining).`;
                                }
                            }
                            if (data.user.banReason) {
                                message += ` Reason: ${data.user.banReason}`;
                            }
                            showSuspensionPopup(message);
                            return;
                        }
                    }
                }
            } catch (error) {
                console.error('[AUTH] Error checking account status:', error);
            }
        }
        
        // Escape HTML to prevent XSS
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        // Convert date to relative time (e.g., "2 hours ago", "5 minutes ago", "3 days ago")
        function getRelativeTime(date) {
            if (!date) return 'Never';
            
            try {
                const now = new Date();
                const past = new Date(date);
                const diffMs = now - past;
                const diffSeconds = Math.floor(diffMs / 1000);
                const diffMinutes = Math.floor(diffSeconds / 60);
                const diffHours = Math.floor(diffMinutes / 60);
                const diffDays = Math.floor(diffHours / 24);
                const diffWeeks = Math.floor(diffDays / 7);
                const diffMonths = Math.floor(diffDays / 30);
                const diffYears = Math.floor(diffDays / 365);
                
                if (diffSeconds < 60) {
                    return diffSeconds <= 0 ? 'Just now' : `${diffSeconds} second${diffSeconds !== 1 ? 's' : ''} ago`;
                } else if (diffMinutes < 60) {
                    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
                } else if (diffHours < 24) {
                    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
                } else if (diffDays < 7) {
                    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
                } else if (diffWeeks < 4) {
                    return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
                } else if (diffMonths < 12) {
                    return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
                } else {
                    return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
                }
            } catch (e) {
                console.error('[ACCOUNT] Error calculating relative time:', e);
                return 'Unknown';
            }
        }
        
        // Load and display bot status
        async function loadBotStatus() {
            // Always use statusPage elements when on /status route
            const isStandalone = window.location.pathname === '/status' || window.location.pathname === '/status/';
            const statusPage = document.getElementById('statusPage');
            
            // Get elements - prefer statusPage elements
            let loading = document.getElementById('statusPageLoading');
            let error = document.getElementById('statusPageError');
            let content = document.getElementById('statusPageContent');
            
            // Fallback to tab elements if statusPage elements don't exist
            if (!loading) loading = document.getElementById('statusLoading');
            if (!error) error = document.getElementById('statusError');
            if (!content) content = document.getElementById('statusContent');
            
            // If we're on the status page, ensure it's visible
            if (isStandalone && statusPage) {
                statusPage.classList.add('active');
                statusPage.style.display = 'block';
                const mainContent = document.querySelector('main.main-content');
                if (mainContent) mainContent.style.display = 'none';
            }
            
            // Create elements if they don't exist (for robustness)
            if (!loading) {
                loading = document.createElement('div');
                loading.id = 'statusPageLoading';
                loading.className = 'loading';
                loading.style.cssText = 'text-align: center; padding: 2rem; display: none; color: var(--text);';
                loading.textContent = 'Loading bot status...';
                if (statusPage) statusPage.appendChild(loading);
            }
            
            if (!error) {
                error = document.createElement('div');
                error.id = 'statusPageError';
                error.className = 'error';
                error.style.cssText = 'display: none; text-align: center; padding: 1rem; margin: 1rem 0; background: rgba(255, 0, 0, 0.1); border: 1px solid rgba(255, 0, 0, 0.3); border-radius: 8px; color: #ff4444;';
                if (statusPage) statusPage.appendChild(error);
            }
            
            if (!content) {
                content = document.createElement('div');
                content.id = 'statusPageContent';
                content.style.cssText = 'display: none;';
                if (statusPage) statusPage.appendChild(content);
            }
            
            loading.style.display = 'block';
            error.style.display = 'none';
            content.style.display = 'none';
            
            try {
                console.log('[loadBotStatus] Fetching /api/bot/status...');
                const response = await fetch('/api/bot/status', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                
                console.log('[loadBotStatus] Response status:', response.status, response.statusText);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('[loadBotStatus] Error response:', errorText);
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                console.log('[loadBotStatus] Received data:', data);
                
                if (!data.success) {
                    throw new Error(data.error || 'Failed to load bot status');
                }
                
                if (!data.status) {
                    throw new Error('No status data in response');
                }
                
                loading.style.display = 'none';
                content.style.display = 'block';
                renderBotStatus(data.status, content);
            } catch (err) {
                console.error('[loadBotStatus] Failed to load bot status:', err);
                loading.style.display = 'none';
                error.style.display = 'block';
                error.textContent = `Failed to load bot status: ${err.message}`;
                if (content) {
                    content.style.display = 'none';
                }
            }
        }
        
        // Render bot status grouped by game with aggregate stats
        function renderBotStatus(statusData, contentElement = null) {
            // Use provided element or find it
            let content = contentElement;
            if (!content) {
                content = (document.getElementById('statusPage')?.classList.contains('active') ? document.getElementById('statusPageContent') : null) || document.getElementById('statusContent');
            }
            if (!content) {
                console.error('Status content container not found');
                return;
            }
            
            if (!statusData || typeof statusData !== 'object') {
                content.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-muted);">No status data available</div>';
                return;
            }
            
            const gameOrder = ['plza', 'SV', 'SWSH', 'bdsp', 'LA', 'lgpe'];
            // Grid: 3 cards per line on desktop, single column on mobile
            // align-items: stretch ensures all cards have the same height
            let html = '<div class="status-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 1rem; align-items: stretch;">';
            let hasAnyData = false;
            
            gameOrder.forEach(game => {
                const gameData = statusData[game];
                // Always show all games, even if no data or all bots offline
                if (!gameData) {
                    // Create default data for games with no bots
                    const gameNames = {
                        'plza': 'Legends: Z-A',
                        'bdsp': 'Brilliant Diamond & Shining Pearl',
                        'SV': 'Scarlet & Violet',
                        'SWSH': 'Sword & Shield',
                        'LA': 'Legends: Arceus',
                        'lgpe': "Let's Go Pikachu/Eevee"
                    };
                    html += `
                    <div class="status-card" style="background: var(--gradient-surface); padding: 2rem; border-radius: 20px; box-shadow: var(--shadow-lg); border: 1px solid var(--border); transition: var(--transition); display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;" 
                         onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-xl)'; this.style.borderColor='rgba(99, 102, 241, 0.4)'"
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-lg)'; this.style.borderColor='var(--border)'">
                        <div class="status-card-header" style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); min-height: 3.5rem; flex-shrink: 0; position: relative; z-index: 1;">
                            <h2 class="status-game-title" style="font-size: 1.75rem; margin: 0; color: var(--text); font-weight: 700; background: linear-gradient(135deg, #8c52ff 0%, #3b82f6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; flex: 1; min-width: 0; word-wrap: break-word; overflow-wrap: break-word; line-height: 1.3;">
                                ${gameNames[game] || game}
                            </h2>
                            <span class="status-badge" style="padding: 0.6rem 1rem; background: rgba(107, 114, 128, 0.2); color: #6b7280; border-radius: 12px; font-size: 0.95rem; font-weight: 600; border: 1px solid rgba(107, 114, 128, 0.3); white-space: nowrap;">
                                Offline
                            </span>
                        </div>
                        <div class="status-stats-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; flex-shrink: 0;">
                            <div class="status-stat-card" style="background: var(--surface); padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border); box-shadow: var(--shadow); transition: var(--transition);">
                                <div class="status-stat-label" style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 500;">Total Bots</div>
                                <div class="status-stat-value" style="font-size: 1.75rem; font-weight: 700; color: var(--primary);">0</div>
                            </div>
                            <div class="status-stat-card" style="background: var(--surface); padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border); box-shadow: var(--shadow); transition: var(--transition);">
                                <div class="status-stat-label" style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 500;">Total in Queue</div>
                                <div class="status-stat-value" style="font-size: 1.75rem; font-weight: 700; color: #10b981;">0</div>
                            </div>
                        </div>
                    </div>
                `;
                    hasAnyData = true;
                    return;
                }
                
                hasAnyData = true;
                
                const { gameName, onlineBots, totalCapacity, currentLoad, queueStats } = gameData;
                const availableCapacity = totalCapacity - currentLoad;
                const loadPercent = totalCapacity > 0 ? Math.round((currentLoad / totalCapacity) * 100) : 0;
                
                html += `
                    <div class="status-card" style="background: var(--gradient-surface); padding: 2rem; border-radius: 20px; box-shadow: var(--shadow-lg); border: 1px solid var(--border); transition: var(--transition); display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;" 
                         onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-xl)'; this.style.borderColor='rgba(99, 102, 241, 0.4)'"
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-lg)'; this.style.borderColor='var(--border)'">
                        <div class="status-card-header" style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); min-height: 3.5rem; flex-shrink: 0; position: relative; z-index: 1;">
                            <h2 class="status-game-title" style="font-size: 1.75rem; margin: 0; color: var(--text); font-weight: 700; background: linear-gradient(135deg, #8c52ff 0%, #3b82f6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; flex: 1; min-width: 0; word-wrap: break-word; overflow-wrap: break-word; line-height: 1.3;">
                                ${gameName}
                            </h2>
                            ${onlineBots > 0 ? `
                                <span class="status-badge" style="padding: 0.6rem 1rem; background: rgba(16, 185, 129, 0.2); color: #10b981; border-radius: 12px; font-size: 0.95rem; font-weight: 600; border: 1px solid rgba(16, 185, 129, 0.3); white-space: nowrap;">
                                    Online
                                </span>
                            ` : `
                                <span class="status-badge" style="padding: 0.6rem 1rem; background: rgba(107, 114, 128, 0.2); color: #6b7280; border-radius: 12px; font-size: 0.95rem; font-weight: 600; border: 1px solid rgba(107, 114, 128, 0.3); white-space: nowrap;">
                                    Offline
                                </span>
                            `}
                        </div>
                        
                        <div class="status-stats-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; flex-shrink: 0;">
                            <div class="status-stat-card" style="background: var(--surface); padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border); box-shadow: var(--shadow); transition: var(--transition);">
                                <div class="status-stat-label" style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 500;">Total Bots</div>
                                <div class="status-stat-value" style="font-size: 1.75rem; font-weight: 700; color: var(--primary);">${totalCapacity || 0}</div>
                            </div>
                            <div class="status-stat-card" style="background: var(--surface); padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border); box-shadow: var(--shadow); transition: var(--transition);">
                                <div class="status-stat-label" style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 500;">Total in Queue</div>
                                <div class="status-stat-value" style="font-size: 1.75rem; font-weight: 700; color: #10b981;">${queueStats.total || 0}</div>
                            </div>
                        </div>
                        
                        ${onlineBots > 0 && totalCapacity > 0 ? `
                            <div style="margin-bottom: 1.5rem; flex-shrink: 0;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; flex-wrap: wrap; gap: 0.5rem;">
                                    <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 500;">Capacity Usage</span>
                                    <span style="font-size: 0.9rem; color: var(--text); font-weight: 600;">${currentLoad || 0} / ${totalCapacity}</span>
                                </div>
                                <div style="width: 100%; height: 10px; background: rgba(140, 82, 255, 0.1); border-radius: 5px; overflow: hidden;">
                                    <div style="width: ${loadPercent}%; height: 100%; background: linear-gradient(90deg, #8c52ff 0%, #3b82f6 100%); border-radius: 5px; transition: width 0.3s ease;"></div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                `;
            });
            
            html += '</div>';
            
            if (!hasAnyData) {
                html = '<div style="padding: 3rem; text-align: center; color: var(--text-muted); background: var(--gradient-surface); border-radius: 20px; border: 1px solid var(--border); box-shadow: var(--shadow-lg);"><i class="fas fa-robot" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; display: block; color: var(--text-muted);"></i><div style="font-size: 1.1rem; color: var(--text);">No bot data available</div><div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.7;">Bots will appear here once they register and come online.</div></div>';
            }
            
            content.innerHTML = html;
        }
        
        // Auto-refresh bot status when on status page
        let botStatusPollInterval = null;
        
        function startBotStatusPolling() {
            // Clear any existing polling
            if (botStatusPollInterval) {
                console.log('[Bot Status Polling] Clearing existing polling interval');
                clearInterval(botStatusPollInterval);
            }
            
            console.log('[Bot Status Polling] Starting bot status polling (every 5 seconds)');
            
            // Load immediately
            loadBotStatus();
            
            // Poll every 5 seconds (5000ms)
            botStatusPollInterval = setInterval(() => {
                // Check if we're on the status page
                const isStatusRoute = window.location.pathname === '/status' || window.location.pathname === '/status/';
                const statusPage = document.getElementById('statusPage');
                const isStatusPageActive = isStatusRoute || (statusPage && statusPage.classList.contains('active'));
                
                if (isStatusPageActive) {
                    console.log('[Bot Status Polling] Refreshing bot status...');
                    loadBotStatus();
                } else {
                    // Stop polling if user navigated away
                    console.log('[Bot Status Polling] Status page not active, stopping polling');
                    if (botStatusPollInterval) {
                        clearInterval(botStatusPollInterval);
                        botStatusPollInterval = null;
                    }
                }
            }, 5000); // 5 seconds
        }
        
        function stopBotStatusPolling() {
            if (botStatusPollInterval) {
                clearInterval(botStatusPollInterval);
                botStatusPollInterval = null;
            }
        }
        
        // Make loadBotStatus globally accessible
        window.loadBotStatus = loadBotStatus;
        
        // Force load on status page immediately if we're on that route
        if (window.location.pathname === '/status' || window.location.pathname === '/status/') {
            // Wait for DOM to be ready
            const initStatusPage = () => {
                    setTimeout(() => {
                        console.log('[Status Page] Auto-loading bot status on page load');
                        loadBotStatus();
                    // Start polling automatically
                    if (typeof startBotStatusPolling === 'function') {
                        startBotStatusPolling();
                    }
                    }, 200);
            };
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initStatusPage);
            } else {
                initStatusPage();
            }
        }
        window.startBotStatusPolling = startBotStatusPolling;
        window.stopBotStatusPolling = stopBotStatusPolling;
        
        // Make updateAccountTabsVisibility globally accessible and call it on load
        window.updateAccountTabsVisibility = updateAccountTabsVisibility;
        
        // Also call it when window loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                console.log('[ACCOUNT TABS] Window load - checking account tabs');
                updateAccountTabsVisibility();
            }, 500);
        });
        
        // Global Turnstile initialization - runs on page load to catch any visible widgets
        function initializeAllTurnstileWidgets() {
            // Initialize Showdown Trader widget
            const turnstileWidget = document.getElementById('turnstileWidget');
            if (turnstileWidget && !turnstileWidget.getAttribute('data-widget-id') && window.turnstile) {
                try {
                    console.log('[GLOBAL] Initializing Turnstile widget (invisible mode)...');
                    const widgetId = window.turnstile.render(turnstileWidget, {
                        sitekey: '0x4AAAAAACBJOjTk1J-lAEX8',
                        theme: 'dark',
                        size: 'invisible', // Invisible mode
                        callback: function(token) {
                            console.log('[GLOBAL] Turnstile token received (invisible mode)');
                            window.turnstileToken = token;
                        },
                        'error-callback': function(error) {
                            console.error('[GLOBAL] Turnstile error:', error);
                            window.turnstileToken = null;
                        }
                    });
                    turnstileWidget.setAttribute('data-widget-id', widgetId);
                    console.log('[GLOBAL] Turnstile widget initialized');
                    
                    // Wait for token to be generated
                    setTimeout(() => {
                        const token = window.turnstile.getResponse(widgetId);
                        if (token) {
                            window.turnstileToken = token;
                            console.log('[GLOBAL] Turnstile token retrieved');
                        }
                    }, 1000);
                } catch (error) {
                    console.error('[GLOBAL] Error initializing Turnstile:', error);
                }
            }
            
            // Initialize File Trader widget
            const fileTurnstileWidget = document.getElementById('fileTurnstileWidget');
            if (fileTurnstileWidget && !fileTurnstileWidget.getAttribute('data-widget-id') && window.turnstile) {
                try {
                    console.log('[GLOBAL] Initializing File Trader Turnstile widget (invisible mode)...');
                    const widgetId = window.turnstile.render(fileTurnstileWidget, {
                        sitekey: '0x4AAAAAACBJOjTk1J-lAEX8',
                        theme: 'dark',
                        size: 'invisible', // Invisible mode
                        callback: function(token) {
                            console.log('[GLOBAL] File Trader Turnstile token received (invisible mode)');
                            window.fileTurnstileToken = token;
                        },
                        'error-callback': function(error) {
                            console.error('[GLOBAL] File Trader Turnstile error:', error);
                            window.fileTurnstileToken = null;
                        }
                    });
                    fileTurnstileWidget.setAttribute('data-widget-id', widgetId);
                    console.log('[GLOBAL] File Trader Turnstile widget initialized');
                    
                    // Wait for token to be generated
                    setTimeout(() => {
                        const token = window.turnstile.getResponse(widgetId);
                        if (token) {
                            window.fileTurnstileToken = token;
                            console.log('[GLOBAL] File Trader Turnstile token retrieved');
                        }
                    }, 1000);
                } catch (error) {
                    console.error('[GLOBAL] Error initializing File Trader Turnstile:', error);
                }
            }
        }
        
        // Try to initialize widgets when Turnstile script loads
        function waitForTurnstileAndInit() {
            if (window.turnstile) {
                initializeAllTurnstileWidgets();
            } else {
                setTimeout(waitForTurnstileAndInit, 100);
            }
        }
        
        // Start waiting for Turnstile to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(waitForTurnstileAndInit, 500);
            });
        } else {
            setTimeout(waitForTurnstileAndInit, 500);
        }
        
        // Also try on window load
        window.addEventListener('load', () => {
            setTimeout(initializeAllTurnstileWidgets, 1000);
        });
    
