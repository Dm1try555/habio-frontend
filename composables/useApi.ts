export const useApi = () => {
    const {$api} = useNuxtApp()
  
    const getChannels = async () => {
      const res = await $api.get("/channels/")
      return res.data
    }
  
    const createLead = async (data: { channel: number, contact: string, message?: string }) => {
      const res = await $api.post("/lead/", data)
      return res.data
    }
  
    return { getChannels, createLead }
  }
  