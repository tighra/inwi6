package com.bimotv.app.di

import android.content.Context
import com.bimotv.app.data.ChannelRepository
import com.bimotv.app.data.FavoritesRepository
import com.bimotv.app.data.RecentlyWatchedRepository

object ServiceLocator {
    private lateinit var appContext: Context
    val channelRepository: ChannelRepository by lazy { ChannelRepository(appContext) }
    val favoritesRepository: FavoritesRepository by lazy { FavoritesRepository(appContext) }
    val recentlyWatchedRepository: RecentlyWatchedRepository by lazy { RecentlyWatchedRepository(appContext) }
    fun initialize(context: Context) { appContext = context.applicationContext }
}
