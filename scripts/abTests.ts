import { ref } from 'vue'
import { useABTests } from '~/composables/useABTests'

export const useABTestScripts = () => {
  const {
    abTests,
    loadABTests,
    createABTest,
    updateABTest,
    deleteABTest,
    getABTest
  } = useABTests()

  const showABTestForm = ref(false)
  const editingABTest = ref(null)

  const editABTest = (test: any) => {
    editingABTest.value = test
    showABTestForm.value = true
  }

  const handleDeleteABTest = async (id: number) => {
    if (confirm('Удалить тест?')) {
      try {
        await deleteABTest(id)
      } catch (error) {
        console.error('Failed to delete AB test:', error)
      }
    }
  }

  return {
    abTests,
    loadABTests,
    createABTest,
    updateABTest,
    deleteABTest,
    getABTest,
    showABTestForm,
    editingABTest,
    editABTest,
    handleDeleteABTest
  }
}