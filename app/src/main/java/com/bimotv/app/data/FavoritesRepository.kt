package com.bimotv.app.data

import android.content.Context
import com.bimotv.app.firebase.FirebaseServices
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class FavoritesRepository(context: Context) {
    private val prefs = context.getSharedPreferences("bimo_favorites", Context.MODE_PRIVATE)
    private val firestore = FirebaseServices.firestore()
    private val auth = FirebaseServices.auth()
    private val _favoriteIds = MutableStateFlow(prefs.getStringSet("favorite_channel_ids", emptySet()).orEmpty())
    val favoriteIds: StateFlow<Set<String>> = _favoriteIds.asStateFlow()
    fun toggle(channelId: String) {
        val updated = if (channelId in _favoriteIds.value) _favoriteIds.value - channelId else _favoriteIds.value + channelId
        _favoriteIds.value = updated
        prefs.edit().putStringSet("favorite_channel_ids", updated).apply()
        auth?.currentUser?.uid?.let { uid -> firestore?.collection("users")?.document(uid)?.collection("profile")?.document("favorites")?.set(mapOf("channelIds" to updated.toList())) }
    }
}
