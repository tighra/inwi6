package com.bimotv.app.notifications

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.content.getSystemService
import com.bimotv.app.R

object NotificationHelper {
    const val CHANNEL_UPDATES = "bimo_tv_updates"
    fun createChannels(context: Context) { if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return; val manager = context.getSystemService<NotificationManager>() ?: return; manager.createNotificationChannel(NotificationChannel(CHANNEL_UPDATES, context.getString(R.string.notification_channel_updates), NotificationManager.IMPORTANCE_DEFAULT).apply { description = context.getString(R.string.notification_channel_updates_desc) }) }
}
