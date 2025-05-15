<template>
  <div class="table-container">
    <div class="table-header">
      <h2>Tasks</h2>
      <button class="new-task-btn" @click="$emit('showModal')">
        <span class="plus-icon">+</span>
        New Task
      </button>
    </div>

    <!-- Desktop Table -->
    <table class="task-table desktop-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>{{ task.title }}</td>
          <td>{{ task.description }}</td>
          <td>{{ formatDate(task.dueDate) }}</td>
          <td>
            <span class="status-badge" :class="task.status.toLowerCase()">
              {{ task.status }}
            </span>
          </td>
          <td>
            <div class="task-actions">
              <button class="action-btn edit">Edit</button>
              <button class="action-btn delete">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Mobile Cards -->
    <div class="mobile-cards">
      <div v-for="task in tasks" :key="task.id" class="task-card">
        <div class="card-header">
          <h3>{{ task.title }}</h3>
          <span class="status-badge" :class="task.status.toLowerCase()">
            {{ task.status }}
          </span>
        </div>
        <p class="card-description">{{ task.description }}</p>
        <div class="card-footer">
          <span class="due-date">Due: {{ formatDate(task.dueDate) }}</span>
          <div class="task-actions">
            <button class="action-btn edit">Edit</button>
            <button class="action-btn delete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Task {
  id: number
  title: string
  description: string
  dueDate: string
  status: string
}

const tasks: Task[] = [
  {
    id: 1,
    title: 'Complete Project Proposal',
    description: 'Draft and finalize the project proposal for client review',
    dueDate: '2024-03-20',
    status: 'TODO',
  },
  {
    id: 2,
    title: 'Team Meeting',
    description: 'Weekly sync-up with development team',
    dueDate: '2024-03-15',
    status: 'IN_PROGRESS',
  },
  {
    id: 3,
    title: 'Code Review',
    description: 'Review pull requests for the new feature',
    dueDate: '2024-03-10',
    status: 'COMPLETED',
  },
]

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
.table-container {
  width: 100%;
  background: #0f172a;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.table-header h2 {
  color: white;
  font-size: 1.75rem;
  font-weight: 500;
  margin: 0;
}

.new-task-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f89c1c;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
}

.plus-icon {
  font-weight: 400;
}

.task-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.75rem;
}

th {
  text-align: left;
  padding: 0.75rem 1.5rem;
  color: #64748b;
  font-weight: 500;
  font-size: 0.95rem;
  text-transform: uppercase;
}

td {
  padding: 1.25rem 1.5rem;
  background: #1e293b;
  color: #e2e8f0;
}

tr td:first-child {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  color: white;
  font-weight: 500;
}

tr td:last-child {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

.task-title {
  font-weight: 500;
  color: #fff;
}

.task-description {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.due-date {
  color: #64748b;
  font-size: 0.875rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.todo {
  background: rgba(220, 38, 38, 0.2);
  color: #ef4444;
}

.status-badge.in_progress {
  background: rgba(245, 158, 11, 0.2);
  color: #f89c1c;
}

.status-badge.completed {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.task-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
}

.action-btn.edit {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.action-btn.delete {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

@media (max-width: 768px) {
  .table-container {
    padding: 1rem;
    border-radius: 16px;
  }

  td,
  th {
    padding: 1rem;
  }

  .table-header {
    flex-direction: column-reverse;
    gap: 1rem;
    align-items: flex-start;
  }
}

.desktop-table {
  display: table;
}

.mobile-cards {
  display: none;
}

.task-card {
  background: #1e293b;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.card-header h3 {
  color: white;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
}

.card-description {
  color: #94a3b8;
  margin: 0.75rem 0;
  font-size: 0.95rem;
  line-height: 1.5;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.due-date {
  color: #64748b;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .desktop-table {
    display: none;
  }

  .mobile-cards {
    display: block;
  }

  .task-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.75rem;
    width: 100%;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
    text-align: center;
  }

  .card-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
