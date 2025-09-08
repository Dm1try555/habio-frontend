import { useProjectScripts } from './projects'
import { useChannelScripts } from './channels'
import { useScheduleScripts } from './schedules'
import { useLeadScripts } from './leads'
import { useChatScripts } from './chat'
import { useABTestScripts } from './abTests'
import { useUserScripts } from './users'
import { useSettingScripts } from './settings'
import { getRoleLabel } from '~/utils/roleUtils'

export const useAdminScripts = () => {
  const projectScripts = useProjectScripts()
  const channelScripts = useChannelScripts()
  const scheduleScripts = useScheduleScripts()
  const leadScripts = useLeadScripts()
  const chatScripts = useChatScripts()
  const abTestScripts = useABTestScripts()
  const userScripts = useUserScripts()
  const settingScripts = useSettingScripts()

  return {
    ...projectScripts,
    ...channelScripts,
    ...scheduleScripts,
    ...leadScripts,
    ...chatScripts,
    ...abTestScripts,
    ...userScripts,
    ...settingScripts,
    getRoleLabel
  }
}