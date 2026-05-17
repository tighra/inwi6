package com.bimotv.app.ui

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.bimotv.app.R
import com.bimotv.app.databinding.ActivityMainBinding
import com.bimotv.app.firebase.FirebaseServices
import com.bimotv.app.ui.admin.AdminFragment
import com.bimotv.app.ui.auth.AuthActivity
import com.bimotv.app.ui.favorites.FavoritesFragment
import com.bimotv.app.ui.home.HomeFragment
import com.bimotv.app.ui.recent.RecentFragment
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.MobileAds

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    override fun onCreate(savedInstanceState: Bundle?) { super.onCreate(savedInstanceState); binding = ActivityMainBinding.inflate(layoutInflater); setContentView(binding.root); MobileAds.initialize(this); binding.adView.loadAd(AdRequest.Builder().build()); FirebaseServices.auth()?.takeIf { it.currentUser == null }?.let { startActivity(Intent(this, AuthActivity::class.java)) }; binding.bottomNavigation.setOnItemSelectedListener { item -> when (item.itemId) { R.id.nav_home -> show(HomeFragment()); R.id.nav_favorites -> show(FavoritesFragment()); R.id.nav_recent -> show(RecentFragment()); R.id.nav_admin -> show(AdminFragment()); else -> false } }; if (savedInstanceState == null) show(HomeFragment()) }
    private fun show(fragment: Fragment): Boolean { supportFragmentManager.beginTransaction().setCustomAnimations(R.anim.fade_in, R.anim.fade_out).replace(R.id.fragmentContainer, fragment).commit(); return true }
}
