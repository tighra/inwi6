package com.bimotv.app.ui.admin

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import com.bimotv.app.R
import com.bimotv.app.databinding.FragmentAdminBinding
import com.bimotv.app.model.Category
import com.bimotv.app.model.Channel
import com.bimotv.app.ui.home.MainViewModel
import com.google.android.material.snackbar.Snackbar

class AdminFragment : Fragment() {
    private var _binding: FragmentAdminBinding? = null
    private val binding get() = _binding!!
    private val viewModel: MainViewModel by viewModels()
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, state: Bundle?): View { _binding = FragmentAdminBinding.inflate(inflater, container, false); return binding.root }
    override fun onViewCreated(view: View, state: Bundle?) { binding.categoryInput.setText(Category.SPORTS.id); binding.saveChannelButton.setOnClickListener { save() }; binding.importPlaylistButton.setOnClickListener { importPlaylist() } }
    private fun save() { val name = binding.nameInput.text?.toString().orEmpty(); val stream = binding.streamUrlInput.text?.toString().orEmpty(); if (name.isBlank() || stream.isBlank()) { Snackbar.make(binding.root, R.string.admin_validation, Snackbar.LENGTH_LONG).show(); return }; viewModel.addChannel(Channel(name.lowercase().replace(Regex("[^a-z0-9]+"), "-").trim('-'), name, binding.categoryInput.text?.toString().orEmpty().ifBlank { Category.SPORTS.id }, binding.logoInput.text?.toString().orEmpty(), stream, binding.languageInput.text?.toString().orEmpty().ifBlank { "en" }, binding.licenseInput.text?.toString().orEmpty().ifBlank { getString(R.string.licensed_stream) }, binding.descriptionInput.text?.toString().orEmpty(), binding.featuredSwitch.isChecked)); Snackbar.make(binding.root, R.string.channel_saved, Snackbar.LENGTH_SHORT).show() }
    private fun importPlaylist() { val url = binding.playlistInput.text?.toString().orEmpty(); if (url.isBlank()) { Snackbar.make(binding.root, R.string.playlist_validation, Snackbar.LENGTH_LONG).show(); return }; viewModel.importPlaylist(url, binding.categoryInput.text?.toString().orEmpty().ifBlank { Category.NEWS.id }); Snackbar.make(binding.root, R.string.playlist_import_started, Snackbar.LENGTH_SHORT).show() }
    override fun onDestroyView() { super.onDestroyView(); _binding = null }
}
