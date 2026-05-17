package com.bimotv.app.ui.recent

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.recyclerview.widget.GridLayoutManager
import com.bimotv.app.R
import com.bimotv.app.databinding.FragmentListBinding
import com.bimotv.app.model.Channel
import com.bimotv.app.ui.common.ChannelAdapter
import com.bimotv.app.ui.home.MainViewModel
import com.bimotv.app.ui.player.PlayerActivity
import kotlinx.coroutines.launch

class RecentFragment : Fragment() {
    private var _binding: FragmentListBinding? = null
    private val binding get() = _binding!!
    private val viewModel: MainViewModel by viewModels()
    private lateinit var adapter: ChannelAdapter
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, state: Bundle?): View { _binding = FragmentListBinding.inflate(inflater, container, false); return binding.root }
    override fun onViewCreated(view: View, state: Bundle?) { binding.title.text = getString(R.string.recently_watched); adapter = ChannelAdapter(::open) { viewModel.toggleFavorite(it.id) }; binding.recycler.layoutManager = GridLayoutManager(requireContext(), if (resources.configuration.screenWidthDp >= 600) 3 else 2); binding.recycler.adapter = adapter; viewLifecycleOwner.lifecycleScope.launch { repeatOnLifecycle(Lifecycle.State.STARTED) { launch { viewModel.favoriteIds.collect { adapter.setFavoriteIds(it) } }; launch { viewModel.recent.collect { adapter.submitList(it) } } } } }
    private fun open(channel: Channel) { viewModel.markWatched(channel); startActivity(Intent(requireContext(), PlayerActivity::class.java).putExtra(PlayerActivity.EXTRA_CHANNEL, channel)) }
    override fun onDestroyView() { super.onDestroyView(); _binding = null }
}
