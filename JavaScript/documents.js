document.addEventListener('DOMContentLoaded', function () {
    // Hide preloader after 2 seconds
    setTimeout(function () {
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.style.display = 'none';
    }, 2000);

    loadDocuments();

    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        // Highlight upload area on dragover
        uploadArea.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.add('border-blue-500');
        });

        // Remove highlight on dragleave
        uploadArea.addEventListener('dragleave', function (e) {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.remove('border-blue-500');
        });

        // Handle file drop
        uploadArea.addEventListener('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.remove('border-blue-500');
            const files = e.dataTransfer.files;
            handleFiles(files);
        });
    }

    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        // Handle file input change
        fileInput.addEventListener('change', function (e) {
            const files = e.target.files;
            handleFiles(files);
        });
    }

    const burgerMenu = document.getElementById('burger-menu');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('close-sidebar');
    const body = document.body;

    if (closeSidebar) {
        closeSidebar.addEventListener('click', () => {
            if (sidebar) sidebar.classList.add('hidden');
            body.classList.remove('body-no-interaction');
        });
    }

    if (burgerMenu && sidebar) {
        burgerMenu.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
            if (sidebar.classList.contains('hidden')) {
                body.classList.remove('body-no-interaction');
            } else {
                body.classList.add('body-no-interaction');
            }
        });
    }

    const searchBar = document.getElementById('searchBar');
    const sortOptions = document.getElementById('sortOptions');

    if (searchBar) {
        // Filter documents on search input
        searchBar.addEventListener('input', () => {
            displayDocuments();
        });
    }

    if (sortOptions) {
        // Sort documents on sort option change
        sortOptions.addEventListener('change', () => {
            displayDocuments();
        });
    }
});

// Save documents to localStorage
function saveDocuments(documents) {
    try {
        localStorage.setItem('documents', JSON.stringify(documents));
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            console.error('Quota exceeded! Clearing old documents...');
            clearOldDocuments();
            try {
                localStorage.setItem('documents', JSON.stringify(documents));
            } catch (e) {
                console.error('Failed to save documents after clearing old data:', e);
            }
        } else {
            console.error('Failed to save documents:', e);
        }
    }
}

// Clear old documents to make room in localStorage
function clearOldDocuments() {
    const documents = getDocuments();
    if (documents.length > 0) {
        documents.shift(); // Remove the oldest document
        localStorage.setItem('documents', JSON.stringify(documents));
    }
}

// Maximum file size (5MB only)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Handle file upload
function handleFiles(files) {
    for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
            showWarningModal();
            continue;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const documents = getDocuments();
            documents.push({
                name: file.name,
                content: e.target.result,
                date: new Date(file.lastModified).toLocaleDateString(),
                size: (file.size / 1024).toFixed(2) + ' KB',
                type: getFileType(file.name)
            });
            saveDocuments(documents);
            displayDocuments();
            updateDocumentStatistics();
            updateRecentDocuments();
        };
        reader.readAsDataURL(file);
    }
}

// Show warning modal
function showWarningModal() {
    const warningModal = document.getElementById('warningModal');
    if (warningModal) {
        warningModal.classList.remove('hidden');
    }
}

// Close warning modal
function closeWarningModal() {
    const warningModal = document.getElementById('warningModal');
    if (warningModal) {
        warningModal.classList.add('hidden');
    }
}

// Retrieve documents from localStorage
function getDocuments() {
    const documents = localStorage.getItem('documents');
    return documents ? JSON.parse(documents) : [];
}

// Load and display documents on page load
function loadDocuments() {
    displayDocuments();
    updateDocumentStatistics();
    updateRecentDocuments();
}

// Get the appropriate icon for the file type
function getFileIcon(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
        case 'pdf': return 'fas fa-file-pdf text-red-500';
        case 'doc':
        case 'docx': return 'fas fa-file-word text-blue-500';
        case 'xls':
        case 'xlsx': return 'fas fa-file-excel text-green-500';
        case 'ppt':
        case 'pptx': return 'fas fa-file-powerpoint text-orange-500';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif': return 'fas fa-file-image text-yellow-500';
        case 'txt': return 'fas fa-file-alt text-gray-500';
        default: return 'fas fa-file text-gray-500';
    }
}

// Determine the file type based on the file extension
function getFileType(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
        case 'pdf': return 'Document';
        case 'doc':
        case 'docx': return 'Document';
        case 'xls':
        case 'xlsx': return 'Spreadsheet';
        case 'ppt':
        case 'pptx': return 'Presentation';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif': return 'Image';
        case 'txt': return 'Text';
        default: return 'Other';
    }
}

// Display the documents on the page
function displayDocuments() {
    const searchBar = document.getElementById('searchBar');
    const sortOptions = document.getElementById('sortOptions');
    let documents = getDocuments();

    if (searchBar) {
        const searchQuery = searchBar.value.toLowerCase();
        documents = documents.filter(doc => doc.name.toLowerCase().includes(searchQuery));
    }

    if (sortOptions) {
        const sortOption = sortOptions.value;
        documents.sort((a, b) => {
            if (sortOption === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortOption === 'date') {
                return new Date(a.date) - new Date(b.date);
            } else if (sortOption === 'size') {
                return parseFloat(a.size) - parseFloat(b.size);
            }
        });
    }

    const documentList = document.getElementById('documentItems');
    if (documentList) {
        documentList.innerHTML = '';

        if (documents.length === 0) {
            documentList.innerHTML = `
                <div class="p-4 bg-white shadow rounded text-center col-span-full">
                    <p class="text-gray-600">No documents available. Please upload a document to get started.</p>
                </div>
            `;
            return;
        }

        documents.forEach((doc, index) => {
            const docElement = document.createElement('div');
            docElement.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 border-b border-gray-200';
            docElement.innerHTML = `
                <div class="flex items-center truncate">
                    <i class="${getFileIcon(doc.name)} mr-3"></i>
                    <span class="truncate">${doc.name}</span>
                </div>
                <div>${doc.size}</div>
                <div>${doc.type}</div>
                <div class="flex items-center justify-between">
                    <span>${doc.date}</span>
                    <div>
                        <a href="${doc.content}" download="${doc.name}" class="text-green-500 hover:text-green-700 mr-2"><i class="fas fa-download"></i></a>
                        <button onclick="deleteDocument(${index})" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
            documentList.appendChild(docElement);
        });
    }
}

// Delete a document from the list
function deleteDocument(index) {
    const documents = getDocuments();
    documents.splice(index, 1);
    saveDocuments(documents);
    displayDocuments();
    updateDocumentStatistics();
    updateRecentDocuments();
}

// Update document statistics
function updateDocumentStatistics() {
    const documents = getDocuments();
    const totalDocuments = documents.length;
    const totalSize = documents.reduce((acc, doc) => acc + parseFloat(doc.size), 0).toFixed(2) + ' KB';

    const totalDocumentsElement = document.getElementById('totalDocuments');
    const totalSizeElement = document.getElementById('totalSize');

    if (totalDocumentsElement) totalDocumentsElement.textContent = `Total Documents: ${totalDocuments}`;
    if (totalSizeElement) totalSizeElement.textContent = `Total Size: ${totalSize}`;
}

// Update the list of recent documents
function updateRecentDocuments() {
    const documents = getDocuments();
    const recentDocuments = documents.slice(-5).reverse(); // Get the last 5 documents

    const recentDocumentList = document.getElementById('recentDocumentList');
    if (recentDocumentList) {
        recentDocumentList.innerHTML = '';

        if (recentDocuments.length === 0) {
            recentDocumentList.innerHTML = `
                <li class="text-gray-400">No recent documents.</li>
            `;
            return;
        }

        recentDocuments.forEach(doc => {
            const docElement = document.createElement('li');
            docElement.className = 'flex items-center space-x-2';
            docElement.innerHTML = `
                <i class="${getFileIcon(doc.name)}"></i>
                <span class="truncate">${doc.name}</span>
            `;
            recentDocumentList.appendChild(docElement);
        });
    }
}