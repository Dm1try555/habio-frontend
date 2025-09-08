import { ref } from 'vue'
import { useProjects } from '~/composables/useProjects'

export const useProjectScripts = () => {
  const {
    projects,
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject
  } = useProjects()

  const showProjectForm = ref(false)
  const editingProject = ref(null)

  const projectForm = ref({
    name: '',
    timezone: 'UTC',
    is_active: true
  })

  const getProjectName = (projectId: number) => {
    const project = getProject(projectId)
    return project ? project.name : `Project ${projectId}`
  }

  const editProject = (project: any) => {
    editingProject.value = project
    projectForm.value = { ...project }
    showProjectForm.value = true
  }

  const saveProject = async () => {
    try {
      if (editingProject.value) {
        await updateProject(editingProject.value.id, projectForm.value)
      } else {
        await createProject(projectForm.value)
      }
      closeProjectForm()
    } catch (error) {
      console.error('Failed to save project:', error)
    }
  }

  const handleDeleteProject = async (id: number) => {
    if (confirm('Удалить проект?')) {
      try {
        await deleteProject(id)
      } catch (error) {
        console.error('Failed to delete project:', error)
      }
    }
  }

  const closeProjectForm = () => {
    showProjectForm.value = false
    editingProject.value = null
    projectForm.value = { name: '', timezone: 'UTC', is_active: true }
  }

  return {
    projects,
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    showProjectForm,
    editingProject,
    projectForm,
    getProjectName,
    editProject,
    saveProject,
    handleDeleteProject,
    closeProjectForm
  }
}