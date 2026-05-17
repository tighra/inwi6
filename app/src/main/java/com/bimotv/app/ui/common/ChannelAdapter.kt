package com.bimotv.app.ui.common

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import coil.load
import com.bimotv.app.R
import com.bimotv.app.databinding.ItemChannelBinding
import com.bimotv.app.model.Channel

class ChannelAdapter(private val onClick: (Channel) -> Unit, private val onFavorite: (Channel) -> Unit) : ListAdapter<Channel, ChannelAdapter.Holder>(Diff) {
    private var favorites: Set<String> = emptySet()
    fun setFavoriteIds(ids: Set<String>) { favorites = ids; notifyDataSetChanged() }
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) = Holder(ItemChannelBinding.inflate(LayoutInflater.from(parent.context), parent, false))
    override fun onBindViewHolder(holder: Holder, position: Int) = holder.bind(getItem(position))
    inner class Holder(private val binding: ItemChannelBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(channel: Channel) { binding.channelName.text = channel.name; binding.channelCategory.text = channel.category; binding.channelDescription.text = channel.description; binding.channelLogo.load(channel.logoUrl) { crossfade(true); placeholder(R.drawable.ic_bimo_logo); error(R.drawable.ic_bimo_logo) }; binding.favoriteButton.setImageResource(if (channel.id in favorites) R.drawable.ic_favorite_filled else R.drawable.ic_favorite_border); binding.root.setOnClickListener { onClick(channel) }; binding.favoriteButton.setOnClickListener { onFavorite(channel) }; binding.root.alpha = 0f; binding.root.animate().alpha(1f).setDuration(220L).start() }
    }
    object Diff : DiffUtil.ItemCallback<Channel>() { override fun areItemsTheSame(old: Channel, new: Channel) = old.id == new.id; override fun areContentsTheSame(old: Channel, new: Channel) = old == new }
}
