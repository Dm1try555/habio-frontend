import { ref } from 'vue'
import { useApi } from './useApi'

export interface Project {
  id: number
  name: string
  timezone: string
  is_active: boolean
  webhook_url?: string
  webhook_secret?: string
  created_at: string
  updated_at: string
}

export const useProjects = () => {
  const { api } = useApi()
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadProjects = async () => {
    try {
      loading.value = true
      error.value = null
      projects.value = await api.get<Project[]>('/projects/')
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to load projects'
      console.error('Failed to load projects:', err)
    } finally {
      loading.value = false
    }
  }

  const createProject = async (data: Partial<Project>) => {
    try {
      loading.value = true
      error.value = null
      const project = await api.post<Project>('/projects/', data)
      projects.value.push(project)
      return project
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to create project'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProject = async (id: number, data: Partial<Project>) => {
    try {
      loading.value = true
      error.value = null
      const project = await api.put<Project>(`/projects/${id}/`, data)
      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = project
      }
      return project
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to update project'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProject = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      await api.delete(`/projects/${id}/`)
      projects.value = projects.value.filter(p => p.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to delete project'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getProject = (id: number) => {
    return projects.value.find(p => p.id === id)
  }

  return {
    projects,
    loading,
    error,
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject
  }
}