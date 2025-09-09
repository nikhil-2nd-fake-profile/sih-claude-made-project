// Main JavaScript file for CropCare application

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    // Get current page from URL
    const currentPage = getCurrentPage();
    
    // Initialize based on current page
    switch(currentPage) {
        case 'index':
            initializeDashboard();
            break;
        case 'sensors':
            initializeSensors();
            break;
        case 'crops':
            initializeCrops();
            break;
        default:
            console.log('Unknown page');
    }
    
    // Initialize common functionality
    initializeCommon();
}

// Get current page from URL
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().split('.')[0];
    return page || 'index';
}

// Initialize common functionality across all pages
function initializeCommon() {
    // Add smooth scrolling to navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add click animation to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
}

// Dashboard page functionality
function initializeDashboard() {
    console.log('Initializing dashboard...');
    
    // Initialize irrigation button
    const startIrrigationBtn = document.getElementById('startIrrigation');
    if (startIrrigationBtn) {
        startIrrigationBtn.addEventListener('click', handleStartIrrigation);
    }
    
    // Initialize weather updates
    updateWeatherData();
    
    // Initialize soil moisture updates
    updateSoilMoisture();
    
    // Set up periodic updates
    setInterval(updateDashboardData, 30000); // Update every 30 seconds
}

// Handle start irrigation button click
function handleStartIrrigation() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to start irrigation for Field 2?')) {
        // Simulate irrigation start
        showNotification('Irrigation started for Field 2', 'success');
        
        // Update button text temporarily
        const button = document.getElementById('startIrrigation');
        const originalText = button.textContent;
        button.textContent = 'Starting...';
        button.disabled = true;
        
        // Reset after 3 seconds
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            showNotification('Irrigation system activated successfully', 'info');
        }, 3000);
    }
}

// Update weather data
function updateWeatherData() {
    // Simulate weather data update
    const weatherConditions = [
        { temp: '28°C', condition: 'Sunny', wind: '15 km/h', humidity: '60%' },
        { temp: '26°C', condition: 'Partly Cloudy', wind: '12 km/h', humidity: '65%' },
        { temp: '30°C', condition: 'Clear', wind: '18 km/h', humidity: '55%' }
    ];
    
    // This would normally fetch from an API
    console.log('Weather data updated');
}

// Update soil moisture data
function updateSoilMoisture() {
    // Simulate soil moisture updates
    const field1Progress = document.querySelector('.moisture-item:first-of-type .progress-fill');
    const field2Progress = document.querySelector('.moisture-item:last-of-type .progress-fill');
    
    if (field1Progress && field2Progress) {
        // Simulate slight variations in moisture levels
        const field1Moisture = Math.max(70, Math.min(80, 75 + (Math.random() - 0.5) * 10));
        const field2Moisture = Math.max(55, Math.min(65, 60 + (Math.random() - 0.5) * 10));
        
        field1Progress.style.width = field1Moisture + '%';
        field2Progress.style.width = field2Moisture + '%';
        
        // Update percentage text
        const field1Percentage = document.querySelector('.moisture-item:first-of-type .moisture-percentage');
        const field2Percentage = document.querySelector('.moisture-item:last-of-type .moisture-percentage');
        
        if (field1Percentage) field1Percentage.textContent = Math.round(field1Moisture) + '%';
        if (field2Percentage) field2Percentage.textContent = Math.round(field2Moisture) + '%';
    }
}

// Update all dashboard data
function updateDashboardData() {
    updateWeatherData();
    updateSoilMoisture();
    console.log('Dashboard data refreshed');
}

// Sensors page functionality
function initializeSensors() {
    console.log('Initializing sensors page...');
    
    // Initialize sensor form
    const sensorForm = document.getElementById('sensorForm');
    if (sensorForm) {
        sensorForm.addEventListener('submit', handleAddSensor);
    }
    
    // Initialize add sensor button in sidebar
    const addSensorBtn = document.getElementById('addSensorBtn');
    if (addSensorBtn) {
        addSensorBtn.addEventListener('click', function() {
            document.getElementById('sensorId').focus();
        });
    }
    
    // Initialize configure buttons
    const configureButtons = document.querySelectorAll('.configure-btn');
    configureButtons.forEach(button => {
        button.addEventListener('click', handleConfigureSensor);
    });
    
    // Initialize sensor status updates
    updateSensorStatuses();
    setInterval(updateSensorStatuses, 60000); // Update every minute
}

// Handle add sensor form submission
function handleAddSensor(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const sensorId = formData.get('sensorId');
    const location = formData.get('location');
    
    // Validate inputs
    if (!sensorId || !location) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Check if sensor ID already exists
    const existingSensors = document.querySelectorAll('.sensors-table tbody tr td:first-child');
    const existingIds = Array.from(existingSensors).map(td => td.textContent);
    
    if (existingIds.includes(sensorId)) {
        showNotification('Sensor ID already exists', 'error');
        return;
    }
    
    // Add new sensor to table
    addSensorToTable(sensorId, location);
    
    // Reset form
    event.target.reset();
    
    // Show success message
    showNotification(`Sensor ${sensorId} added successfully`, 'success');
}

// Add sensor to the table
function addSensorToTable(sensorId, location) {
    const tableBody = document.getElementById('sensorsTableBody');
    if (!tableBody) return;
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${sensorId}</td>
        <td>${location}</td>
        <td><span class="status-badge active">Active</span></td>
        <td>Just added</td>
        <td><button class="configure-btn">Configure</button></td>
    `;
    
    // Add event listener to the new configure button
    const configureBtn = newRow.querySelector('.configure-btn');
    configureBtn.addEventListener('click', handleConfigureSensor);
    
    tableBody.appendChild(newRow);
}

// Handle configure sensor button click
function handleConfigureSensor(event) {
    const row = event.target.closest('tr');
    const sensorId = row.querySelector('td:first-child').textContent;
    
    // Show configuration modal or redirect
    showNotification(`Configuration for ${sensorId} - Feature coming soon!`, 'info');
}

// Update sensor statuses
function updateSensorStatuses() {
    const statusBadges = document.querySelectorAll('.status-badge');
    const lastReadingCells = document.querySelectorAll('.sensors-table tbody tr td:nth-child(4)');
    
    // Simulate status updates
    statusBadges.forEach((badge, index) => {
        // Randomly simulate sensor status changes (90% chance to stay active)
        if (Math.random() > 0.9) {
            if (badge.classList.contains('active')) {
                badge.classList.remove('active');
                badge.classList.add('inactive');
                badge.textContent = 'Inactive';
            } else {
                badge.classList.remove('inactive');
                badge.classList.add('active');
                badge.textContent = 'Active';
            }
        }
        
        // Update last reading time for active sensors
        if (badge.classList.contains('active') && lastReadingCells[index]) {
            const readingTimes = ['Just now', '5 minutes ago', '15 minutes ago', '1 hour ago'];
            const randomTime = readingTimes[Math.floor(Math.random() * readingTimes.length)];
            lastReadingCells[index].textContent = randomTime;
        }
    });
}

// Crops page functionality
function initializeCrops() {
    console.log('Initializing crops page...');
    
    // Initialize notification button
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            showNotification('No new notifications', 'info');
        });
    }
    
    // Add scroll animations for sections
    initializeScrollAnimations();
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const sections = document.querySelectorAll('.content-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: '14px',
        zIndex: '1000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#38e07b';
            notification.style.color = '#111714';
            break;
        case 'error':
            notification.style.backgroundColor = '#d32f2f';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ff9800';
            notification.style.color = '#111714';
            break;
        default:
            notification.style.backgroundColor = '#29382f';
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility function to format time
function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
}

// Utility function to generate random sensor data
function generateSensorData() {
    return {
        temperature: Math.round((Math.random() * 15 + 20) * 10) / 10, // 20-35°C
        humidity: Math.round((Math.random() * 30 + 50) * 10) / 10, // 50-80%
        soilMoisture: Math.round((Math.random() * 40 + 40) * 10) / 10, // 40-80%
        lightLevel: Math.round(Math.random() * 100000), // 0-100000 lux
        timestamp: new Date()
    };
}

// Handle window resize
window.addEventListener('resize', function() {
    // Adjust layout for mobile devices
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (window.innerWidth <= 768) {
        if (sidebar && mainContent) {
            // Mobile layout adjustments
            console.log('Switched to mobile layout');
        }
    } else {
        // Desktop layout
        console.log('Switched to desktop layout');
    }
});

// Handle online/offline status
window.addEventListener('online', function() {
    showNotification('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    showNotification('Connection lost - working offline', 'warning');
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        showNotification,
        formatTime,
        generateSensorData
    };
}