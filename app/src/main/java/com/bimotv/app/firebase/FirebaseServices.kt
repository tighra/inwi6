package com.bimotv.app.firebase

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.ktx.auth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase

object FirebaseServices {
    fun auth(): FirebaseAuth? = runCatching { Firebase.auth }.getOrNull()
    fun firestore(): FirebaseFirestore? = runCatching { Firebase.firestore }.getOrNull()
}
