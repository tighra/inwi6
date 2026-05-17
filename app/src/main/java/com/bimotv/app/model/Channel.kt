package com.bimotv.app.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Channel(
    val id: String = "",
    val name: String = "",
    val category: String = Category.SPORTS.id,
    val logoUrl: String = "",
    val streamUrl: String = "",
    val language: String = "en",
    val license: String = "Licensed demo stream",
    val description: String = "",
    val featured: Boolean = false
) : Parcelable
