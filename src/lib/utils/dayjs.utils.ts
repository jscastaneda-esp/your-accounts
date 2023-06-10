import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/es'

dayjs.locale('es')
dayjs.extend(relativeTime)

export default dayjs
