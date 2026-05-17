package com.bimotv.app

import android.app.Application
import com.bimotv.app.di.ServiceLocator
import com.bimotv.app.notifications.NotificationHelper
import com.google.firebase.FirebaseApp

class BimoTvApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        runCatching { FirebaseApp.initializeApp(this) }
        NotificationHelper.createChannels(this)
        ServiceLocator.initialize(this)
    }
}
