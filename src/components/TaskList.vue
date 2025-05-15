<template>
  <div class="table-container">
    <div class="table-header">
      <h2>Tasks</h2>
      <button class="new-task-btn" @click="$emit('showModal')">
        <span class="plus-icon">+</span>
        New Task
      </button>
    </div>
    <table class="task-table">
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
          <td class="title-cell">
            <div class="task-title">{{ task.title }}</div>
          </td>
          <td>
            <div class="task-description">{{ task.description }}</div>
          </td>
          <td>
            <div class="due-date">{{ formatDate(task.dueDate) }}</div>
          </td>
          <td>
            <span class="status-badge" :class="task.status.toLowerCase()">
              {{ task.status }}
            </span>
          </td>
          <td>
            <div class="task-actions">
              <button class="action-btn edit">
                <span>Edit</span>
              </button>
              <button class="action-btn delete">
                <span>Delete</span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
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
}
</style>
