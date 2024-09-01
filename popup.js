document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const newTitleInput = document.getElementById('new-title');
    const newUrlInput = document.getElementById('new-url');
    const addTaskButton = document.getElementById('add-task');
  
    const itemsPerPage = 5; // Show 5 items per page
    let currentPage = 1;
    let tasks = [];
  
    // Load tasks from local storage
    chrome.storage.local.get(['tasks'], (result) => {
      tasks = result.tasks || [];
      renderTasks();
    });
  
    // Add task event
    addTaskButton.addEventListener('click', () => {
      const title = newTitleInput.value;
      const url = newUrlInput.value;
      if (title && url) {
        tasks.push({ title, url });
        saveTasks();
        renderTasks();
        newTitleInput.value = '';
        newUrlInput.value = '';
      }
    });
  
    // Render tasks with pagination and numbering
    function renderTasks() {
      taskList.innerHTML = '';
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const tasksToShow = tasks.slice(startIndex, endIndex);
  
      tasksToShow.forEach((task, index) => addTaskToList(startIndex + index + 1, task.title, task.url));
  
      renderPagination();
    }
  
    // Function to add task to list with numbering
    function addTaskToList(number, title, url) {
      const li = document.createElement('li');
      const taskNumber = document.createElement('span');
      taskNumber.textContent = `${number}. `;
      taskNumber.style.marginRight = '5px';
      
      const link = document.createElement('a');
      link.href = url;
      link.textContent = title;
      link.target = '_blank'; // Open link in a new tab
  
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => {
        tasks = tasks.filter(task => task.title !== title || task.url !== url);
        saveTasks();
        renderTasks();
      });
  
      li.appendChild(taskNumber);
      li.appendChild(link);
      li.appendChild(removeButton);
      taskList.appendChild(li);
    }
  
    // Save tasks to local storage
    function saveTasks() {
      chrome.storage.local.set({ tasks });
    }
  
    // Render pagination controls
    function renderPagination() {
      const pagination = document.getElementById('pagination');
      pagination.innerHTML = '';
  
      const totalPages = Math.ceil(tasks.length / itemsPerPage);
  
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('pagination-button');
        if (i === currentPage) {
          pageButton.classList.add('active');
        }
  
        pageButton.addEventListener('click', () => {
          currentPage = i;
          renderTasks();
        });
  
        pagination.appendChild(pageButton);
      }
    }
  });
  