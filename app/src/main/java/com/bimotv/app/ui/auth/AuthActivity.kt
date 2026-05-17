package com.bimotv.app.ui.auth

import android.os.Bundle
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import com.bimotv.app.R
import com.bimotv.app.databinding.ActivityAuthBinding
import com.bimotv.app.firebase.FirebaseServices
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.material.snackbar.Snackbar
import com.google.firebase.auth.GoogleAuthProvider

class AuthActivity : AppCompatActivity() {
    private lateinit var binding: ActivityAuthBinding
    private val auth = FirebaseServices.auth()
    private val googleLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result -> runCatching { val account = GoogleSignIn.getSignedInAccountFromIntent(result.data).result; val credential = GoogleAuthProvider.getCredential(account.idToken, null); auth?.signInWithCredential(credential)?.addOnSuccessListener { finish() }?.addOnFailureListener { show(it.localizedMessage ?: getString(R.string.auth_failed)) } }.onFailure { show(it.localizedMessage ?: getString(R.string.auth_failed)) } }
    override fun onCreate(savedInstanceState: Bundle?) { super.onCreate(savedInstanceState); binding = ActivityAuthBinding.inflate(layoutInflater); setContentView(binding.root); binding.googleButton.setOnClickListener { google() }; binding.emailButton.setOnClickListener { email(false) }; binding.createAccountButton.setOnClickListener { email(true) } }
    private fun google() { val id = getString(R.string.google_web_client_id); if (id.startsWith("REPLACE")) { show(getString(R.string.configure_google_client)); return }; val options = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN).requestIdToken(id).requestEmail().build(); googleLauncher.launch(GoogleSignIn.getClient(this, options).signInIntent) }
    private fun email(create: Boolean) { val email = binding.emailInput.text?.toString().orEmpty(); val password = binding.passwordInput.text?.toString().orEmpty(); if (email.isBlank() || password.length < 6) { show(getString(R.string.email_password_validation)); return }; val task = if (create) auth?.createUserWithEmailAndPassword(email, password) else auth?.signInWithEmailAndPassword(email, password); task?.addOnSuccessListener { finish() }?.addOnFailureListener { show(it.localizedMessage ?: getString(R.string.auth_failed)) } ?: show(getString(R.string.configure_firebase)) }
    private fun show(message: String) = Snackbar.make(binding.root, message, Snackbar.LENGTH_LONG).show()
}
