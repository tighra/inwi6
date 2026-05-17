package com.bimotv.app.data

import android.content.Context
import com.bimotv.app.firebase.FirebaseServices
import com.bimotv.app.model.Channel
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.withContext
import java.net.URL

class ChannelRepository(context: Context) {
    private val firestore: FirebaseFirestore? = FirebaseServices.firestore()
    private val parser = M3uParser()
    private val preferences = context.getSharedPreferences("bimo_channels", Context.MODE_PRIVATE)
    private val _channels = MutableStateFlow(DemoChannels.channels)
    val channels: StateFlow<List<Channel>> = _channels.asStateFlow()
    init { loadCachedM3u(); listenForFirestoreChannels() }
    suspend fun addChannel(channel: Channel) {
        val safe = channel.copy(id = channel.id.ifBlank { channel.name.slugId() })
        firestore?.collection("channels")?.document(safe.id)?.set(safe)?.await()
        _channels.update { (it.filterNot { item -> item.id == safe.id } + safe).sortedBy { item -> item.name } }
    }
    suspend fun importM3u(url: String, defaultCategory: String): List<Channel> = withContext(Dispatchers.IO) {
        val playlist = URL(url).readText()
        val parsed = parser.parse(playlist, defaultCategory)
        preferences.edit().putString("cached_playlist", playlist).apply()
        _channels.update { (it + parsed).distinctBy { item -> item.id }.sortedBy { item -> item.name } }
        parsed
    }
    private fun loadCachedM3u() { preferences.getString("cached_playlist", null).orEmpty().takeIf { it.isNotBlank() }?.let { playlist -> _channels.update { (it + parser.parse(playlist)).distinctBy { item -> item.id } } } }
    private fun listenForFirestoreChannels() { firestore?.collection("channels")?.addSnapshotListener { snapshot, _ -> snapshot?.documents?.mapNotNull { it.toObject(Channel::class.java) }?.takeIf { it.isNotEmpty() }?.let { remote -> _channels.update { (DemoChannels.channels + remote + it).distinctBy { item -> item.id } } } } }
    private fun String.slugId(): String = lowercase().replace(Regex("[^a-z0-9]+"), "-").trim('-').ifBlank { System.currentTimeMillis().toString() }
}
