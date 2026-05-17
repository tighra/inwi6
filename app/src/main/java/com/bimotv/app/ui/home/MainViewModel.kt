package com.bimotv.app.ui.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.bimotv.app.di.ServiceLocator
import com.bimotv.app.model.Category
import com.bimotv.app.model.Channel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class MainViewModel : ViewModel() {
    private val channelRepository = ServiceLocator.channelRepository
    private val favoritesRepository = ServiceLocator.favoritesRepository
    private val recentRepository = ServiceLocator.recentlyWatchedRepository
    private val query = MutableStateFlow("")
    private val selectedCategory = MutableStateFlow<String?>(null)
    val channels: StateFlow<List<Channel>> = combine(channelRepository.channels, query, selectedCategory) { channels, text, category -> channels.filter { (text.isBlank() || it.name.contains(text, true)) && (category == null || it.category == category) } }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val featured: StateFlow<List<Channel>> = combine(channelRepository.channels, query) { channels, text -> channels.filter { it.featured && (text.isBlank() || it.name.contains(text, true)) } }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val favoriteIds = favoritesRepository.favoriteIds
    val recent = recentRepository.recent
    val categories = Category.entries
    fun setQuery(value: String) { query.value = value }
    fun selectCategory(category: String?) { selectedCategory.value = category }
    fun toggleFavorite(channelId: String) = favoritesRepository.toggle(channelId)
    fun markWatched(channel: Channel) = recentRepository.markWatched(channel)
    fun addChannel(channel: Channel) { viewModelScope.launch { channelRepository.addChannel(channel) } }
    fun importPlaylist(url: String, category: String) { viewModelScope.launch { channelRepository.importM3u(url, category) } }
}
