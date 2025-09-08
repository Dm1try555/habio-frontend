import { useLeads } from '~/composables/useLeads'

export const useLeadScripts = () => {
  const {
    leads,
    loadLeads,
    updateLeadStatus,
    deleteLead,
    getLead
  } = useLeads()

  const getContactName = (contact: string) => {
    if (!contact) return '-'
    const match = contact.match(/^([^<]+)/)
    return match ? match[1]?.trim() : contact
  }

  const getContactEmail = (contact: string) => {
    if (!contact) return '-'
    const match = contact.match(/<([^>]+)>/)
    return match ? match[1]?.trim() : '-'
  }

  const getContactPhone = (message: string) => {
    if (!message) return '-'
    const phoneMatch = message.match(/Телефон:\s*([^\n]+)/)
    return phoneMatch ? phoneMatch[1]?.trim() : '-'
  }

  const getContactMessage = (message: string) => {
    if (!message) return '-'
    // Remove phone line from message
    return message.replace(/Телефон:\s*[^\n]+\n?\n?/, '').trim() || '-'
  }

  const toggleLeadStatus = async (leadId: number, processed: boolean) => {
    try {
      await updateLeadStatus(leadId, processed ? 'processed' : 'pending')
    } catch (error) {
      console.error('Failed to update lead status:', error)
    }
  }

  const handleDeleteLead = async (leadId: number) => {
    if (confirm('Удалить лид?')) {
      try {
        await deleteLead(leadId)
      } catch (error) {
        console.error('Failed to delete lead:', error)
      }
    }
  }

  return {
    leads,
    loadLeads,
    deleteLead,
    getLead,
    getContactName,
    getContactEmail,
    getContactPhone,
    getContactMessage,
    toggleLeadStatus,
    handleDeleteLead
  }
}