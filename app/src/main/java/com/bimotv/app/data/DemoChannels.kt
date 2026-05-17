package com.bimotv.app.data

import com.bimotv.app.model.Category
import com.bimotv.app.model.Channel

object DemoChannels {
    val channels = listOf(
        Channel("sports-one-hls", "BIMO Sports One", Category.SPORTS.id, "https://dummyimage.com/320x180/b00020/ffffff.png&text=BIMO+Sports", "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", "en", "Mux test stream for player integration demos", "Fast-loading sports-style demo channel", true),
        Channel("movies-sintel", "BIMO Cinema", Category.MOVIES.id, "https://dummyimage.com/320x180/7b1fa2/ffffff.png&text=BIMO+Cinema", "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8", "en", "Sintel open movie stream", "Licensed open movie stream for testing"),
        Channel("news-demo", "BIMO News Live", Category.NEWS.id, "https://dummyimage.com/320x180/1565c0/ffffff.png&text=BIMO+News", "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8", "en", "Shaka Player public demo stream", "News-style legally available demo feed", true),
        Channel("kids-bunny", "BIMO Kids", Category.KIDS.id, "https://dummyimage.com/320x180/f9a825/000000.png&text=BIMO+Kids", "https://test-streams.mux.dev/test_001/stream.m3u8", "en", "Public test stream for app development", "Family-friendly demo content"),
        Channel("music-stage", "BIMO Music Stage", Category.MUSIC.id, "https://dummyimage.com/320x180/00897b/ffffff.png&text=BIMO+Music", "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8", "fr", "Public HLS validation stream", "Music-style demo stream with Cast and PiP support")
    )
}
