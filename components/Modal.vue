<script setup>
const props = defineProps({
    isOpen: Boolean,
    title: String
})
const emit = defineEmits(['update:isOpen'])

function openModal() {
    emit('update:isOpen', true)
}
function closeModal() {
    emit('update:isOpen', false)
}

</script>
<template>
    <div>
    <!-- Modal Background -->
    <div v-if="isOpen" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <!-- Modal Content -->
      
      <div class="bg-white rounded w-[397px]">
        <!-- Close Button -->
        <div class="flex justify-between p-2 items-center h-[54px] bg-[#1D50A2] rounded-t-[2px]">
          <h2 class="text-md font-semibold text-white">{{ title }}</h2>
          <!-- Close Button -->
          <div @click="closeModal" class="cursor-pointer"> 
            <Icon name="ic:baseline-close" color="white"/>
          </div>
          
        </div>
        
        <!-- Modal Content -->
        <div class="flex flex-wrap justify-center mt-2 container">
          <!-- Your Modal Content Goes Here -->
          <slot />
          
        </div>
      </div>
    </div>
  </div>
</template>
