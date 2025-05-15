import { ref } from 'vue'

interface DeleteItem {
  id: string | number
  title: string
}

export function useDeleteModal() {
  const showDeleteModal = ref(false)
  const itemToDelete = ref<DeleteItem | null>(null)

  const openDeleteModal = (item: DeleteItem) => {
    itemToDelete.value = item
    showDeleteModal.value = true
  }

  const closeDeleteModal = () => {
    showDeleteModal.value = false
    itemToDelete.value = null
  }

  return {
    showDeleteModal,
    itemToDelete,
    openDeleteModal,
    closeDeleteModal,
  }
}
