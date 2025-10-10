/* eslint-disable no-console */
import cron from 'node-cron'
import { statsService } from '../services/stats.service.js'

export const startDailyStatsCron = () => {
  //   // 🧪 Test: mỗi 1 phút
  // cron.schedule('*/1 * * * *', async () => {
  //   const now = new Date().toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
  //   console.log('📊 CRON: Cập nhật Stats lúc', now)
  //   try {
  //     const data = await statsService.getCurrentStats()
  //     // Format date as yyyy-MM-dd for Asia/Ho_Chi_Minh
  //     const nowDate = new Date()
  //     const year = nowDate.getFullYear().toString()
  //     const month = (nowDate.getMonth() + 1).toString().padStart(2, '0')
  //     const day = nowDate.getDate().toString().padStart(2, '0')
  //     const formattedDate = `${year}-${month}-${day}`
  //     await statsService.updateStats(data, formattedDate)
  //     console.log('✅ CRON: Cập nhật Stats thành công')
  //   } catch (err) {
  //     console.error('❌ CRON: Lỗi cập nhật Stats:', err.message)
  //   }
  // });

  // ⏰ Production: mỗi ngày 23:59
  cron.schedule('59 23 * * *', async () => {
    const now = new Date().toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
    console.log('📊 CRON: Cập nhật Stats lúc', now)
    try {
      const data = await statsService.getCurrentStats()
      // Format date as yyyy-MM-dd for Asia/Ho_Chi_Minh
      const nowDate = new Date()
      const year = nowDate.getFullYear().toString()
      const month = (nowDate.getMonth() + 1).toString().padStart(2, '0')
      const day = nowDate.getDate().toString().padStart(2, '0')
      const formattedDate = `${year}-${month}-${day}`
      await statsService.updateStats(data, formattedDate)
      console.log('✅ CRON: Cập nhật Stats thành công')
    } catch (err) {
      console.error('❌ CRON: Lỗi cập nhật Stats:', err.message)
    }
  }, {
    timezone: 'Asia/Ho_Chi_Minh'
  })

  console.log('✅ CRON: Job cập nhật Stats đã được kích hoạt')
}
