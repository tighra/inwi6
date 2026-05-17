package com.bimotv.app.model

enum class Category(val id: String, val title: String, val icon: String) {
    SPORTS("Sports", "Sports", "🏆"), MOVIES("Movies", "Movies", "🎬"), NEWS("News", "News", "📰"), KIDS("Kids", "Kids", "🧸"), MUSIC("Music", "Music", "🎵");
    companion object { fun ids(): List<String> = entries.map { it.id } }
}
