package com.bimotv.app.ui.player

import android.app.PictureInPictureParams
import android.os.Build
import android.os.Bundle
import android.util.Rational
import androidx.appcompat.app.AppCompatActivity
import androidx.media3.common.MediaItem
import androidx.media3.exoplayer.ExoPlayer
import com.bimotv.app.databinding.ActivityPlayerBinding
import com.bimotv.app.model.Channel
import com.google.android.gms.cast.framework.CastButtonFactory

class PlayerActivity : AppCompatActivity() {
    private lateinit var binding: ActivityPlayerBinding
    private var player: ExoPlayer? = null
    private var channel: Channel? = null
    override fun onCreate(state: Bundle?) { super.onCreate(state); binding = ActivityPlayerBinding.inflate(layoutInflater); setContentView(binding.root); channel = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) intent.getParcelableExtra(EXTRA_CHANNEL, Channel::class.java) else @Suppress("DEPRECATION") intent.getParcelableExtra(EXTRA_CHANNEL); binding.channelTitle.text = channel?.name.orEmpty(); binding.licenseText.text = channel?.license.orEmpty(); CastButtonFactory.setUpMediaRouteButton(applicationContext, binding.mediaRouteButton); initializePlayer(); binding.pipButton.setOnClickListener { enterPipMode() }; binding.backButton.setOnClickListener { finish() } }
    private fun initializePlayer() { val mediaChannel = channel ?: return; player = ExoPlayer.Builder(this).build().also { binding.playerView.player = it; it.setMediaItem(MediaItem.fromUri(mediaChannel.streamUrl)); it.prepare(); it.playWhenReady = true } }
    private fun enterPipMode() { if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) enterPictureInPictureMode(PictureInPictureParams.Builder().setAspectRatio(Rational(16, 9)).build()) }
    override fun onUserLeaveHint() { super.onUserLeaveHint(); enterPipMode() }
    override fun onStop() { super.onStop(); if (!isInPictureInPictureMode) player?.pause() }
    override fun onDestroy() { player?.release(); player = null; super.onDestroy() }
    companion object { const val EXTRA_CHANNEL = "extra_channel" }
}
