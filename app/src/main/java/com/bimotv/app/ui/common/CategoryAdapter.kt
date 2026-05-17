package com.bimotv.app.ui.common

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bimotv.app.R
import com.bimotv.app.databinding.ItemCategoryBinding
import com.bimotv.app.model.Category

class CategoryAdapter(private val onClick: (Category?) -> Unit) : RecyclerView.Adapter<CategoryAdapter.Holder>() {
    private val items = listOf<Category?>(null) + Category.entries
    private var selected: String? = null
    fun select(id: String?) { selected = id; notifyDataSetChanged() }
    override fun getItemCount() = items.size
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) = Holder(ItemCategoryBinding.inflate(LayoutInflater.from(parent.context), parent, false))
    override fun onBindViewHolder(holder: Holder, position: Int) = holder.bind(items[position])
    inner class Holder(private val binding: ItemCategoryBinding) : RecyclerView.ViewHolder(binding.root) { fun bind(category: Category?) { binding.categoryIcon.text = category?.icon ?: "★"; binding.categoryTitle.text = category?.title ?: binding.root.context.getString(R.string.all_channels); binding.root.isChecked = category?.id == selected || (category == null && selected == null); binding.root.setOnClickListener { selected = category?.id; onClick(category); notifyDataSetChanged() } } }
}
