import defaultSettings from '@/settings'

const title = defaultSettings.title || '山西农业大学:家政服务预约平台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
