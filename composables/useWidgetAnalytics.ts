export function useWidgetAnalytics() {
  const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        event_category: 'habio_widget',
        ...parameters
      })
    }
    console.log('Analytics Event:', eventName, parameters)
  }

  const getClientId = () => {
    let clientId = localStorage.getItem('habio_client_id')
    if (!clientId) {
      clientId = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('habio_client_id', clientId)
    }
    return clientId
  }

  const getUrlParameter = (name: string) => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(name)
  }

  return {
    trackEvent,
    getClientId,
    getUrlParameter
  }
}