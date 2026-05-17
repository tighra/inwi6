package com.bimotv.app.data

import android.content.Context
import com.bimotv.app.model.Channel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import org.json.JSONArray
import org.json.JSONObject

class RecentlyWatchedRepository(context: Context) {
    private val prefs = context.getSharedPreferences("bimo_recent", Context.MODE_PRIVATE)
    private val _recent = MutableStateFlow(load())
    val recent: StateFlow<List<Channel>> = _recent.asStateFlow()
    fun markWatched(channel: Channel) { val updated = (listOf(channel) + _recent.value.filterNot { it.id == channel.id }).take(12); _recent.value = updated; prefs.edit().putString("recent_channels", JSONArray(updated.map { it.toJson() }).toString()).apply() }
    private fun load(): List<Channel> = runCatching { val arr = JSONArray(prefs.getString("recent_channels", "[]")); List(arr.length()) { arr.getJSONObject(it).toChannel() } }.getOrDefault(emptyList())
    private fun Channel.toJson(): JSONObject = JSONObject().put("id", id).put("name", name).put("category", category).put("logoUrl", logoUrl).put("streamUrl", streamUrl).put("language", language).put("license", license).put("description", description).put("featured", featured)
    private fun JSONObject.toChannel(): Channel = Channel(optString("id"), optString("name"), optString("category"), optString("logoUrl"), optString("streamUrl"), optString("language"), optString("license"), optString("description"), optBoolean("featured"))
}
