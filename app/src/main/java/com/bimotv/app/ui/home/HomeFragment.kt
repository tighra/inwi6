package com.bimotv.app.ui.home

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.widget.doOnTextChanged
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import com.bimotv.app.databinding.FragmentHomeBinding
import com.bimotv.app.model.Channel
import com.bimotv.app.ui.common.CategoryAdapter
import com.bimotv.app.ui.common.ChannelAdapter
import com.bimotv.app.ui.player.PlayerActivity
import kotlinx.coroutines.launch

class HomeFragment : Fragment() {
    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!
    private val viewModel: MainViewModel by viewModels()
    private lateinit var channels: ChannelAdapter
    private lateinit var featured: ChannelAdapter
    private lateinit var categories: CategoryAdapter
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, state: Bundle?): View { _binding = FragmentHomeBinding.inflate(inflater, container, false); return binding.root }
    override fun onViewCreated(view: View, state: Bundle?) { channels = ChannelAdapter(::open) { viewModel.toggleFavorite(it.id) }; featured = ChannelAdapter(::open) { viewModel.toggleFavorite(it.id) }; categories = CategoryAdapter { categories.select(it?.id); viewModel.selectCategory(it?.id) }; binding.searchInput.doOnTextChanged { text, _, _, _ -> viewModel.setQuery(text?.toString().orEmpty()) }; binding.categoriesRecycler.layoutManager = LinearLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false); binding.categoriesRecycler.adapter = categories; binding.featuredRecycler.layoutManager = LinearLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false); binding.featuredRecycler.adapter = featured; binding.channelsRecycler.layoutManager = GridLayoutManager(requireContext(), if (resources.configuration.screenWidthDp >= 600) 3 else 2); binding.channelsRecycler.adapter = channels; collect() }
    private fun collect() { viewLifecycleOwner.lifecycleScope.launch { repeatOnLifecycle(Lifecycle.State.STARTED) { launch { viewModel.channels.collect { channels.submitList(it) } }; launch { viewModel.featured.collect { featured.submitList(it) } }; launch { viewModel.favoriteIds.collect { ids -> channels.setFavoriteIds(ids); featured.setFavoriteIds(ids) } } } } }
    private fun open(channel: Channel) { viewModel.markWatched(channel); startActivity(Intent(requireContext(), PlayerActivity::class.java).putExtra(PlayerActivity.EXTRA_CHANNEL, channel)) }
    override fun onDestroyView() { super.onDestroyView(); _binding = null }
}
