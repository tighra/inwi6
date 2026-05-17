package com.bimotv.app.data

import com.bimotv.app.model.Category
import com.bimotv.app.model.Channel
import java.security.MessageDigest

class M3uParser {
    fun parse(content: String, defaultCategory: String = Category.NEWS.id): List<Channel> {
        val result = mutableListOf<Channel>()
        var info: String? = null
        content.lineSequence().map { it.trim() }.filter { it.isNotBlank() }.forEach { line ->
            when {
                line.startsWith("#EXTINF", true) -> info = line
                !line.startsWith("#") && info != null -> {
                    val ext = info.orEmpty()
                    val name = ext.substringAfterLast(',', "Channel").trim().ifBlank { "Imported Channel" }
                    result += Channel(stableId("$name|$line"), name, attribute(ext, "group-title").ifBlank { defaultCategory }, attribute(ext, "tvg-logo"), line, attribute(ext, "tvg-language").ifBlank { "en" }, "Imported playlist item — verify licensing before publishing", "Imported from M3U playlist")
                    info = null
                }
            }
        }
        return result
    }
    private fun attribute(info: String, key: String): String = Regex("$key=\"([^\"]*)\"").find(info)?.groupValues?.getOrNull(1).orEmpty()
    private fun stableId(value: String): String = MessageDigest.getInstance("SHA-256").digest(value.toByteArray()).take(12).joinToString("") { "%02x".format(it) }
}
